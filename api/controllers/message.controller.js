// controller to add a new message to a chat
// and update the chat's last message and seenBy fields

// imports
import prisma from "../lib/prisma.js";


// controller to add a new message to a chat
export const addMessage = async (req, res) => {

  // extract user ID from the verified token and chat ID and message text from request body
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  // validate chat ID presence
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    // if chat not found or user not a participant, respond with error
    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // create the new message in the database
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    // update the chat's last message and seenBy fields
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenUserId],
        lastMessage: text,
      },
    });

    // respond with the newly created message
    res.status(200).json(message);
    
  } catch (err) {
    // respond with error if adding message fails
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};