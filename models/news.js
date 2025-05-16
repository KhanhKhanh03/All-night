const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    link: { type: String, required: true, unique: true },
    pubDate: Date,
    image: String,
    category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
