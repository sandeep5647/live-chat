import { getReceiverSocketId, io } from "../SocketIO/server.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import crypto from 'crypto';

// Encryption and decryption setup
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Generate a random key
const iv = crypto.randomBytes(16); // Generate a random initialization vector

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
};

const decrypt = (encryptedMessage) => {
  const iv = Buffer.from(encryptedMessage.iv, 'hex');
  const encryptedData = Buffer.from(encryptedMessage.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id; // current logged in user

    // Encrypt the message
    const encryptedMessage = encrypt(message);

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message: JSON.stringify(encryptedMessage), // Store the encrypted message as a string
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]); // run parallel

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Emit the decrypted message to the receiver
      io.to(receiverSocketId).emit("newMessage", { 
        ...newMessage.toObject(), 
        message: message // Send the plain text message
      });
    }

    // Send the decrypted message back to the sender
    res.status(201).json({
      ...newMessage.toObject(),
      message: message // Send the plain text message
    });
  } catch (error) {
    console.log("Error in sendMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate('messages');
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Decrypt the messages
    const decryptedMessages = conversation.messages.map(message => {
      const encryptedMessage = JSON.parse(message.message);
      const decryptedMessage = decrypt(encryptedMessage);
      return { ...message.toObject(), message: decryptedMessage };
    });

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.log("Error in getMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ************************** Without encryption/decryption ****************************

// import { getReceiverSocketId, io } from "../SocketIO/server.js";
// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";

// export const sendMessage = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id; // current logged in user
//     let conversation = await Conversation.findOne({
//       members: { $all: [senderId, receiverId] },
//     });
//     if (!conversation) {
//       conversation = await Conversation.create({
//         members: [senderId, receiverId],
//       });
//     }
//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//     });
//     if (newMessage) {
//       conversation.messages.push(newMessage._id);
//     }
//     // await conversation.save()
//     // await newMessage.save();
//     await Promise.all([conversation.save(), newMessage.save()]); // run parallel
//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }
//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getMessage = async (req, res) => {
//   try {
//     const { id: chatUser } = req.params;
//     const senderId = req.user._id; // current logged in user
//     let conversation = await Conversation.findOne({
//       members: { $all: [senderId, chatUser] },
//     }).populate("messages");
//     if (!conversation) {
//       return res.status(201).json([]);
//     }
//     const messages = conversation.messages;
//     res.status(201).json(messages);
//   } catch (error) {
//     console.log("Error in getMessage", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

