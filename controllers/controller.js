// const News = require("../models/news");

// const getNews = async (req, res) => {
//   try {
//     const news = await News.find().sort({ pubDate: -1 }).limit(10);
//     res.json(news);
//   } catch (error) {
//     console.error("Error fetching news:", error);
//     res.status(500).json({ error: "Error fetching news" });
//   }
// };

// module.exports = { getNews };

const News = require("../models/news");

const getNews = async (req, res) => {
  try {
    const category = req.query.category || "tin-tuc";
    const news = await News.find({
      category: category.charAt(0).toUpperCase() + category.slice(1),
    })
      .sort({ pubDate: -1 })
      .limit(10);
    res.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Error fetching news" });
  }
};

module.exports = { getNews };
