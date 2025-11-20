import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const cityFilter = query.city
      ? { contains: query.city.trim(), mode: "insensitive" }
      : undefined;
    const propertyFilter = query.property
      ? { contains: query.property.trim(), mode: "insensitive" }
      : undefined;
    const typeFilter = query.type ? query.type.trim() : undefined;
    const userIDFilter = query.userID ? query.userID.trim() : undefined;

    const parseIntSafe = (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      const n = parseInt(val, 10);
      return Number.isFinite(n) ? n : undefined;
    };

    const bedroomFilter = parseIntSafe(query.bedroom);
    const bathroomFilter = parseIntSafe(query.bathroom);

    const minPrice = parseIntSafe(query.minPrice);
    const maxPrice = parseIntSafe(query.maxPrice);

    const posts = await prisma.post.findMany({
      where: {
        city: cityFilter,
        type: typeFilter,
        property: propertyFilter,
        bedroom: bedroomFilter,
        bathroom: bathroomFilter,
        userID: userIDFilter,
        price: {
          gte: minPrice !== undefined ? minPrice : 0,
          lte: maxPrice !== undefined ? maxPrice : 1000000000000,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;
    let savedPostIds = [];
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const savedPosts = await prisma.savedPost.findMany({
          where: {
            userId: payload?.id,
            postId: {
              in: posts.map(p => p.id),
            },
          },
          select: {
            postId: true,
          },
        });
        savedPostIds = savedPosts.map(sp => sp.postId);
      } catch (e) {
        console.warn('getPosts token verify / saved lookup failed:', e && e.message);
      }
    }

    const postsWithSaved = posts.map(post => ({
      ...post,
      isSaved: savedPostIds.includes(post.id),
    }));


    res.status(200).json(postsWithSaved);
   
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        postDetail: true,
      },
    });
    if(!post){
      return res.status(404).json({ error: 'post not found' });
    }
    const token = req.cookies?.token;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload?.id,
            },
          },
        });
        return res.status(200).json({ ...post, isSaved: !!saved });
      } catch (e) {
        console.warn('getPost token verify / saved lookup failed:', e && e.message);
      }
    }

    return res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenuserId = req.userId;
  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        user: { connect: { id: tokenuserId } },
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to add post" });
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const tokenuserId = req.userId;
  const { postData, postDetail } = req.body;
  
  try {
    const existing = await prisma.post.findUnique({ 
      where: { id: postId },
      include: {
        postDetail: true,
      }
    });
    
    if (!existing) {
      return res.status(404).json({ error: "post not found" });
    }
    
    if (existing.userID !== tokenuserId) {
      return res
        .status(403)
        .json({ error: "you are not allowed to update this post" });
    }
    
    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        ...postData,
        postDetail: {
          update: postDetail,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        postDetail: true,
      },
    });
    
    return res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const tokenuserId = req.userId;
    
    console.log("Delete request:", { postId, tokenuserId });
    
    if (!tokenuserId) {
      console.log("No userId found in request");
      return res.status(401).json({ error: "Not authenticated" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        postDetail: true,
      }
    });
    
    if (!post) {
      console.log("Post not found:", postId);
      return res.status(404).json({ error: "post not found" });
    }
    
    const postUserId = String(post.userID);
    const tokenUserId = String(tokenuserId);
    
    console.log("Delete post check:", {
      postId,
      postUserId,
      tokenUserId,
      match: postUserId === tokenUserId,
      postUserIDType: typeof post.userID,
      tokenUserIdType: typeof tokenuserId
    });
    
    if (postUserId !== tokenUserId) {
      console.log("User ID mismatch - not authorized");
      return res
        .status(403)
        .json({ error: "you are not allowed to delete this post" });
    }
    
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: { postId: postId }
      });
    }
    
    await prisma.post.delete({
      where: { id: postId },
    });
    
    console.log("Post deleted successfully");
    return res.status(200).json({ message: "post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      meta: err.meta
    });
    res.status(500).json({ error: err.message || "failed to delete post" });
  }
};
export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenuserId = req.userId;
  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenuserId,
          postId,
        },
      },
    });
    if (savedPost) {
      await prisma.savedPost.delete({ where: { id: savedPost.id } });
      return res.status(200).json({ message: "post removed from saved list" });
    }
    try {
      await prisma.savedPost.create({ data: { userId: tokenuserId, postId } });
      return res.status(201).json({ message: "post saved successfully" });
    } catch (createErr) {
      if (createErr && createErr.code === 'P2002') {
        try {
          const existing = await prisma.savedPost.findFirst({
            where: { userId: tokenuserId, postId },
          });
          if (existing) {
            await prisma.savedPost.delete({ where: { id: existing.id } });
            return res.status(200).json({ message: "post removed from saved list (conflict resolved)" });
          }
        } catch (innerErr) {
          console.log('Error while resolving P2002 conflict:', innerErr);
        }
        const target = createErr?.meta?.target;
        console.warn('P2002 while creating SavedPost; target:', target);
        if (typeof target === 'string' && target.includes('userId')) {
          const mongoUrl = process.env.DATABASE_URL;
          let client;
          try {
            client = new MongoClient(mongoUrl);
            await client.connect();

            const withoutParams = mongoUrl.split('?')[0];
            const dbName = withoutParams.substring(withoutParams.lastIndexOf('/') + 1) || undefined;
            const db = dbName ? client.db(dbName) : client.db();

            const coll = db.collection('SavedPost');
            const indexes = await coll.indexes();
            const idxToDrop = indexes.find(i => (i.key && Object.keys(i.key).length === 1 && i.key.userId === 1) || i.name === 'SavedPost_userId_key');
            if (idxToDrop) {
              console.warn('Dropping incorrect index on SavedPost:', idxToDrop.name || idxToDrop.key);
              await coll.dropIndex(idxToDrop.name || Object.keys(idxToDrop.key).join('_'));
            } else {
              console.warn('No single-field userId index found to drop. Indexes:', indexes.map(i => i.name));
            }

            try {
              await prisma.savedPost.create({ data: { userId: tokenuserId, postId } });
              return res.status(201).json({ message: "post saved successfully (index auto-fixed)" });
            } catch (retryErr) {
              console.log('Retry create after dropping index failed:', retryErr);
            }
          } catch (dropErr) {
            console.log('Failed to auto-drop incorrect index:', dropErr && dropErr.message);
          } finally {
            try { await client?.close(); } catch (e) {}
          }
        }
      return res.status(409).json({ error: "Unique constraint violation while saving post. Please remove incorrect unique index on SavedPost (userId) in the database." });
      }

      throw createErr;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to toggle saved post" });
  }
};
