import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
    } catch (error) {
    res.status(500).json({ error: 'failed to get users' });
  }
};


export const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'failed to get user' });
  } 
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const tokenUserId = req.userId;
  const {password,avatar, ...body} = req.body;

  if ( userId !== tokenUserId) {
    return res.status(400).json({ error: 'You are not allowed to update this user' });
  }

  let updatedPassword = null;
  try {
    if(password){
      
      updatedPassword = await bcrypt.hash(password,10);
      body.password=updatedPassword;
    }


    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {...body,...(password && { password: updatedPassword }), ...(avatar && { avatar } )},
    });
    const { password:userPassword, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const tokenUserId = req.userId;
  const {password,avatar, ...body} = req.body;

  if ( userId !== tokenUserId) {
    return res.status(400).json({ error: 'You are not allowed to update this user' });
  }
  
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'failed to delete user' });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const userPosts = await prisma.post.findMany({
      where: { userID: tokenUserId },
    });

    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: { post: true },
    });

    const savedPosts = saved
      .map((item) => item.post)
      .filter(Boolean)
      .map((post) => ({ ...post, isSaved: true }));

    res.status(200).json({ userPosts, savedPosts });
  } catch (error) {
    console.error('profilePosts error:', error);
    res.status(500).json({ error: 'failed to load profile posts' });
  }
};


export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getAgents = async (req, res) => {
  try {
    const usersWithPosts = await prisma.user.findMany({
      where: {
        posts: {
          some: {}
        }
      },
      include: {
        _count: {
          select: {
            posts: true
          }
        },
        posts: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            createdAt: true
          }
        }
      }
    });

    const agents = usersWithPosts
      .map(user => {
        const postCount = user._count.posts;
        const accountAge = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 365)); 
        const yearsExperience = Math.max(1, accountAge); 

        const propertiesSold = postCount;

        const specialties = ["Residential", "Commercial"];
        const specialtiesAr = ["سكني", "تجاري"];
        const languages = ["Arabic", "English"];
        const languagesAr = ["العربية", "الإنجليزية"];

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar || "/noavatar.jpg",
          propertiesSold: propertiesSold,
          yearsExperience: yearsExperience,
          specialties: specialties,
          specialtiesAr: specialtiesAr,
          languages: languages,
          languagesAr: languagesAr,
          createdAt: user.createdAt
        };
      })
      .sort((a, b) => b.propertiesSold - a.propertiesSold); 

    res.status(200).json(agents);
  } catch (error) {
    console.error('getAgents error:', error);
    res.status(500).json({ error: 'failed to get agents' });
  }
};