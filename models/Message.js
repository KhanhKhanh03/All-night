const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: String, enum: ["user", "bot"], required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

messageSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model("chat_history", messageSchema);
