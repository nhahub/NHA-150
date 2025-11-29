// api/controllers/user.controller.js
// this controller handles user-related operations such as getting user info, updating user info, deleting users, and fetching profile posts
// imports

import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// controller to get all users
export const getUsers = async (req, res) => {
  try {
    // fetch all users from the database
    const users = await prisma.user.findMany();
    // respond with the list of users
    res.status(200).json(users);
  }catch (error) {
    // respond with error if fetching users fails
    res.status(500).json({ error: 'failed to get users' });
  }
};

// controller to get a specific user by ID
export const getUser = async (req, res) => {
  // extract user ID from request parameters
  const userId = req.params.id;

  // fetch the user from the database
  try {
    // find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    // if user not found, respond with error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // respond with the user details
    res.status(200).json(user);
  } catch (error) {
    // respond with error if fetching user fails
    res.status(500).json({ error: 'failed to get user' });
  } 
};

// controller to update a specific user by ID
export const updateUser = async (req, res) => {
  // extract user ID from request parameters and authenticated user ID from token
  const userId = req.params.id;
  const tokenUserId = req.userId;
  const {password,avatar, ...body} = req.body;

  // ensure the authenticated user is updating their own profile
  if ( userId !== tokenUserId) {
    return res.status(400).json({ error: 'You are not allowed to update this user' });
  }

  // hash the new password if provided  
  let updatedPassword = null;
  try {
    if(password){
      // hash the new password
      updatedPassword = await bcrypt.hash(password,10);
      body.password=updatedPassword;
    }

    // update the user in the database 
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {...body,...(password && { password: updatedPassword }), ...(avatar && { avatar } )},
    });
    // respond with the updated user details excluding the password
    const { password:userPassword, ...userWithoutPassword } = updatedUser;
    // respond with updated user data
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'failed to update user' });
  }
};

// controller to delete a specific user by ID
export const deleteUser = async (req, res) => {
  // extract user ID from request parameters and authenticated user ID from token
  const userId = req.params.id;
  const tokenUserId = req.userId;
  const {password,avatar, ...body} = req.body;

  // ensure the authenticated user is deleting their own profile
  if ( userId !== tokenUserId) {
    return res.status(400).json({ error: 'You are not allowed to update this user' });
  }

  // delete the user from the database
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  
    // respond with success message
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    // respond with error if deleting user fails
    res.status(500).json({ error: 'failed to delete user' });
  }
};

// controller to get profile posts for the authenticated user
export const profilePosts = async (req, res) => {

  // extract authenticated user ID from token
  const tokenUserId = req.userId;

  // fetch user's posts and saved posts from the database
  try {
    // find posts created by the user
    const userPosts = await prisma.post.findMany({
      where: { userID: tokenUserId },
    });

    // find posts saved by the user
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: { post: true },
    });

    // map saved posts to include isSaved flag
    const savedPosts = saved
      .map((item) => item.post)
      .filter(Boolean)
      .map((post) => ({ ...post, isSaved: true }));

    // respond with user's posts and saved posts
    res.status(200).json({ userPosts, savedPosts });

  } catch (error) {
    // respond with error if fetching profile posts fails
    console.error('profilePosts error:', error);
    res.status(500).json({ error: 'failed to load profile posts' });
  }
};

// controller to get the number of unseen notifications for the authenticated user
export const getNotificationNumber = async (req, res) => {
  // extract authenticated user ID from token
  const tokenUserId = req.userId;

  // count chats with unseen messages for the user
  try {
    // count chats where the user is a participant but has not seen the messages
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
    // respond with the count of unseen notifications
    res.status(200).json(number);
  } catch (err) {
    // respond with error if counting unseen notifications fails
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

// controller to get agents (users with posts)
export const getAgents = async (req, res) => {

  // fetch users who have created posts
  try {
    // find users with at least one post
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

    // map users to agent format
    const agents = usersWithPosts
      .map(user => {
        // calculate properties sold and years of experience
        const postCount = user._count.posts;
        const accountAge = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 365)); 
        const yearsExperience = Math.max(1, accountAge); 

        const propertiesSold = postCount;

        const specialties = ["Residential", "Commercial"];
        const specialtiesAr = ["سكني", "تجاري"];
        const languages = ["Arabic", "English"];
        const languagesAr = ["العربية", "الإنجليزية"];

        // return agent object
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
      // sort agents by properties sold in descending order
      .sort((a, b) => b.propertiesSold - a.propertiesSold); 

    // respond with the list of agents
    res.status(200).json(agents);
  } catch (error) {
    // respond with error if fetching agents fails
    console.error('getAgents error:', error);
    res.status(500).json({ error: 'failed to get agents' });
  }
};