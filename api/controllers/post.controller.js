// controller for managing posts (list, get, add, update, delete, save)
// imports
import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

// controller to get all posts with optional filters
export const getPosts = async (req, res) => {
  const query = req.query;

  // build filters based on query parameters
  try {
    // construct filters
    const cityFilter = query.city
      ? { contains: query.city.trim(), mode: "insensitive" }
      : undefined;
    // property is an enum, so filter with exact match
    const propertyFilter = query.property ? query.property.trim().toLowerCase() : undefined;
    const typeFilter = query.type ? query.type.trim() : undefined;
    const userIDFilter = query.userID ? query.userID.trim() : undefined;

    // helper to safely parse integers used for filtering
    const parseIntSafe = (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      const n = parseInt(val, 10);
      return Number.isFinite(n) ? n : undefined;
    };
    // parse numeric filters
    const bedroomFilter = parseIntSafe(query.bedroom);
    const bathroomFilter = parseIntSafe(query.bathroom);
    // parse price range filters
    const minPrice = parseIntSafe(query.minPrice);
    const maxPrice = parseIntSafe(query.maxPrice);

    // fetch posts from the database with applied filters
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
      // include related user data
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

    // check saved posts for the requesting user
    const token = req.cookies?.token;
    let savedPostIds = [];
    if (token) {
      try {
        // verify token and get saved posts
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
        // extract saved post IDs
        savedPostIds = savedPosts.map(sp => sp.postId);
      } catch (e) {
        console.warn('getPosts token verify / saved lookup failed:', e && e.message);
      }
    }

    // mark posts as saved or not
    const postsWithSaved = posts.map(post => ({
      ...post,
      isSaved: savedPostIds.includes(post.id),
    }));

    // respond with the list of posts
    res.status(200).json(postsWithSaved);
   
  } catch (err) {
    // respond with error if fetching posts fails
    console.log(err);
    res.status(500).json({ error: "failed to get posts" });
  }
};

// controller to get a specific post by ID
export const getPost = async (req, res) => {
  // extract post ID from request parameters
  const id = req.params.id;

  // fetch the post from the database
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

    // if post not found, respond with error
    if(!post){
      return res.status(404).json({ error: 'post not found' });
    }

    // check if the post is saved by the requesting user
    const token = req.cookies?.token;
    if (token) {
      try {
        // verify token and check saved status
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload?.id,
            },
          },
        });

        // respond with the post and saved status (!! is to convert to boolean)
        return res.status(200).json({ ...post, isSaved: !!saved });
      } catch (e) {
        console.warn('getPost token verify / saved lookup failed:', e && e.message);
      }
    }

    // respond with the post and saved status (false if no token or error)
    return res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    // respond with error if fetching the post fails
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// controller to add a new post
export const addPost = async (req, res) => {
  // extract post data from request body
  const body = req.body;
  const tokenuserId = req.userId;

  // create the new post in the database
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
    // respond with the newly created post
    res.status(201).json(newPost);
  } catch (err) {
    // respond with error if adding the post fails
    console.log(err);
    res.status(500).json({ error: "failed to add post" });
  }
};

// controller to update an existing post
export const updatePost = async (req, res) => {
  // extract post ID and updated data from request parameters and body
  const postId = req.params.id;
  const tokenuserId = req.userId;
  const { postData, postDetail } = req.body;

  // update the post in the database
  try {
    // check if the post exists and belongs to the user
    const existing = await prisma.post.findUnique({ 
      where: { id: postId },
      include: {
        postDetail: true,
      }
    });
    
    // if post not found, respond with error
    if (!existing) {
      return res.status(404).json({ error: "post not found" });
    }
    
    // if the post does not belong to the user, respond with error
    if (existing.userID !== tokenuserId) {
      return res
        .status(403)
        .json({ error: "you are not allowed to update this post" });
    }
    
    // perform the update
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

// controller to delete a post
export const deletePost = async (req, res) => {
  try {
    // extract post ID from request parameters and user ID from verified token
    const postId = req.params.id;
    const tokenuserId = req.userId;
    
    console.log("Delete request:", { postId, tokenuserId });
    
    // validate user authentication
    if (!tokenuserId) {
      console.log("No userId found in request");
      return res.status(401).json({ error: "Not authenticated" });
    }

    // check if the post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        postDetail: true,
      }
    });
    
    // if post not found, respond with error
    if (!post) {
      console.log("Post not found:", postId);
      return res.status(404).json({ error: "post not found" });
    }

    const postUserId = String(post.userID);
    const tokenUserId = String(tokenuserId);
    
    // if the post does not belong to the user, respond with error
    if (postUserId !== tokenUserId) {
      console.log("User ID mismatch, not authorized");
      return res
        .status(403)
        .json({ error: "you are not allowed to delete this post" });
    }
    
    // delete the post and its details
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: { postId: postId }
      });
    }
    
    // delete the post from the database
    await prisma.post.delete({
      where: { id: postId },
    });
    
    // respond with success message
    console.log("Post deleted successfully");
    return res.status(200).json({ message: "post deleted successfully" });
  } catch (err) {
    // respond with error if deleting the post fails
    console.error("Delete post error:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      meta: err.meta
    });
    res.status(500).json({ error: err.message || "failed to delete post" });
  }
};

// controller to save or unsave a post for the authenticated user
export const savePost = async (req, res) => {
  // extract post ID from request body and user ID from verified token
  const postId = req.body.postId;
  const tokenuserId = req.userId;

  // toggle saved status in the database
  try {
    // check if the post is already saved
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenuserId,
          postId,
        },
      },
    });
    // if saved, remove it
    if (savedPost) {
      await prisma.savedPost.delete({ where: { id: savedPost.id } });
      return res.status(200).json({ message: "post removed from saved list" });
    }
    
    // if not saved, save the post
    try {
      // create saved post entry
      await prisma.savedPost.create({ data: { userId: tokenuserId, postId } });
      return res.status(201).json({ message: "post saved successfully" });
    } catch (createErr) {
      throw createErr;
    }
  } catch (err) {
    // respond with error if toggling saved status fails
    console.log(err);
    res.status(500).json({ error: "failed to toggle saved post" });
  }
};