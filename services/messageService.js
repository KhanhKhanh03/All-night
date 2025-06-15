// const Message = require("../models/Message");

// // Lưu tin nhắn vào collection chat_history
// const saveMessage = async (content, sender, userId) => {
//   try {
//     // Kiểm tra dữ liệu đầu vào
//     if (!content || !sender || !userId) {
//       throw new Error("Missing required fields: content, sender, or userId");
//     }

//     const message = await Message.create({
//       content,
//       sender,
//       userId,
//       timestamp: new Date(),
//     });

//     console.log(`Saved message for user ${userId}:`, message);
//     return message;
//   } catch (error) {
//     console.error(`Error saving message for user ${userId}:`, error.message);
//     throw error;
//   }
// };

// // Truy xuất lịch sử chat dựa trên userId
// const getHistory = async (userId) => {
//   try {
//     if (!userId) {
//       throw new Error("userId is required to fetch history");
//     }

//     const messages = await Message.find({ userId })
//       .sort({ timestamp: 1 })
//       .lean();

//     console.log(`Fetched history for user ${userId}:`, messages);
//     return messages;
//   } catch (error) {
//     console.error(`Error fetching history for user ${userId}:`, error.message);
//     throw error;
//   }
// };

// module.exports = { saveMessage, getHistory };

const Message = require("../models/Message");

const saveMessage = async (content, sender, userId) => {
  try {
    if (!content || !sender || !userId) {
      throw new Error("Missing required fields");
    }
    const message = await Message.create({
      content,
      sender,
      userId,
      timestamp: new Date(),
    });
    return message;
  } catch (error) {
    console.error("Error saving message:", error.message);
    throw error;
  }
};

const getHistory = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }
    const messages = await Message.find({ userId })
      .sort({ timestamp: 1 })
      .lean();
    return messages;
  } catch (error) {
    console.error("Error fetching history:", error.message);
    throw error;
  }
};

const loadChat = async (timestamp, userId) => {
  try {
    if (!timestamp || !userId) {
      throw new Error("Timestamp and userId are required");
    }
    const messages = await Message.find({
      userId,
      timestamp: { $lte: new Date(timestamp) },
    })
      .sort({ timestamp: 1 })
      .lean();
    return messages;
  } catch (error) {
    console.error("Error loading chat:", error.message);
    throw error;
  }
};

const newChat = async (userId) => {
  try {
    // Không xóa lịch sử, chỉ báo hiệu client làm mới giao diện
    return { success: true };
  } catch (error) {
    console.error("Error starting new chat:", error.message);
    throw error;
  }
};

module.exports = { saveMessage, getHistory, loadChat, newChat };
