import {user as User} from "../models/User.js";
import {Message} from "../models/Message.js";

// import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, text, messageType, mediaUrl } = req.body;
    // const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // let imageUrl;
    // if (image) {
    //   // Upload base64 image to cloudinary
    //   const uploadResponse = await cloudinary.uploader.upload(image);
    //   imageUrl = uploadResponse.secure_url;
    // }

    // const newMessage = new Message({
    //   senderId,
    //   receiverId,
    //   text,
    //   // image: imageUrl,
    //   image,
    // });

    // await newMessage.save();

    // Create message in database
    const message = await Message.create({
      chat: chatId,
      receiver: receiverId,
      sender: senderId,
      text,
      messageType: messageType || "text",
      mediaUrl,
      image
    });

        // Populate sender info
    await message.populate("sender", "name avatar email");

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    // Update chat's last message
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        lastMessage: message._id,
        lastMessageAt: new Date(),
      },
      { new: true }
    ).populate("participants", "name email avatar");

    // Send real-time notification via socket
    if (chat) {
      // Notify all participants
      chat.participants.forEach((participant) => {
        const participantId = participant._id.toString();
        
        // Skip the sender
        if (participantId === senderId.toString()) return;

        // Check if participant is online
        const receiverSocketId = getReceiverSocketId(participantId);
        
        if (receiverSocketId) {
          // User is online - send real-time message
          io.to(receiverSocketId).emit("new-message", {
            message,
            chat: {
              _id: chat._id,
              type: chat.type,
              name: chat.type === "group" ? chat.groupName : undefined,
            },
          });

          // Send notification
          io.to(receiverSocketId).emit("new-notification", {
            type: "new-message",
            chatId: chat._id,
            message: `${message.sender.name}: ${message.text.substring(0, 50)}${message.text.length > 50 ? '...' : ''}`,
            timestamp: new Date(),
          });
        } else {
          // User is offline - you can add push notification logic here
          console.log(`User ${participantId} is offline, send push notification`);
          // await sendPushNotification(participantId, message);
        }
      });

      // Also emit to chat room (for users currently viewing the chat)
      io.to(`chat:${chatId}`).emit("new-message", {
        message,
        chat: {
          _id: chat._id,
          type: chat.type,
        },
      });
    }

    res.status(201).json({
      success: true,
      data: message,
    });

    // res.status(201).json(message);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Example: Notify user when someone starts a chat with them
export const notifyNewChat = (senderId, receiverId, chat) => {
  const receiverSocketId = getReceiverSocketId(receiverId);
  
  if (receiverSocketId && io) {
    io.to(receiverSocketId).emit("new-chat-created", {
      chat,
      createdBy: senderId,
    });
  }
};

// Example: Notify user when they're added to a group
export const notifyAddedToGroup = (userId, groupChat) => {
  const userSocketId = getReceiverSocketId(userId);
  
  if (userSocketId && io) {
    io.to(userSocketId).emit("added-to-group", {
      chat: groupChat,
    });
  }
};