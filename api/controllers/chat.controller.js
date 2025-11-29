// this file contains controller functions for managing chat-related operations
// imports
import prisma from "../lib/prisma.js";

// controller to get all chats for the authenticated user
export const getChats = async (req, res) => {
  // extract user ID from the verified token
  const tokenUserId = req.userId;

  // fetch chats involving the authenticated user
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    // for each chat, find the other participant's details
    for (const chat of chats) {
      // identify the other user in the chat
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

      // fetch receiver's basic information
      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      // attach receiver info to the chat object
      chat.receiver = receiver;
    }
    // respond with the list of chats
    res.status(200).json(chats);
  } catch (err) {
    // respond with error if fetching chats fails
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

// controller to get a specific chat by ID
export const getChat = async (req, res) => {
  // extract user ID from the verified token
  const tokenUserId = req.userId;

  // fetch the specific chat if the user is a participant
  try {
    // find the chat by ID and ensure the user is part of it
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // mark the chat as seen by the user
    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

    // respond with the chat details
    res.status(200).json(chat);

  } catch (err) {
    // respond with error if fetching the chat fails
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// controller to add a new chat or return existing one
export const addChat = async (req, res) => {

  // extract user ID from the verified token
  const tokenUserId = req.userId;
  // get receiver ID from request body
  const receiverId = req.body.receiverId;
  
  // validate receiver ID presence
  if (!receiverId) {
    return res.status(400).json({ message: "Receiver ID is required!" });
  }

  // prevent users from chatting with themselves
  if (tokenUserId === receiverId) {
    return res.status(400).json({ message: "You cannot chat with yourself!" });
  }

  // check for existing chat or create a new one
  try {
    const existingChat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId],
        },
      },
    });

    // if chat exists, return it
    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // create a new chat if none exists
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
      },
    });

    // respond with the newly created chat
    res.status(200).json(newChat);

  } catch (err) {
    // respond with error if adding chat fails
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

// controller to mark a chat as read by the authenticated user
export const readChat = async (req, res) => {
  // extract user ID from the verified token
  const tokenUserId = req.userId;

  // update the chat to mark it as read by the user
  try {

    // find and update the chat's seenBy field
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    // respond with the updated chat
    res.status(200).json(chat);

  } catch (err) {
    // respond with error if marking chat as read fails
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};