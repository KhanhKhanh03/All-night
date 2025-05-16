const Message = require("../models/Message");

// Lưu tin nhắn vào collection chat_history
const saveMessage = async (content, sender, userId) => {
  try {
    // Kiểm tra dữ liệu đầu vào
    if (!content || !sender || !userId) {
      throw new Error("Missing required fields: content, sender, or userId");
    }

    const message = await Message.create({
      content,
      sender,
      userId,
      timestamp: new Date(),
    });

    console.log(`Saved message for user ${userId}:`, message);
    return message;
  } catch (error) {
    console.error(`Error saving message for user ${userId}:`, error.message);
    throw error;
  }
};

// Truy xuất lịch sử chat dựa trên userId
const getHistory = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required to fetch history");
    }

    const messages = await Message.find({ userId })
      .sort({ timestamp: 1 })
      .lean();

    console.log(`Fetched history for user ${userId}:`, messages);
    return messages;
  } catch (error) {
    console.error(`Error fetching history for user ${userId}:`, error.message);
    throw error;
  }
};

module.exports = { saveMessage, getHistory };
