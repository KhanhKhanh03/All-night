// const axios = require("axios");
// const xml2js = require("xml2js");
// const News = require("../models/news");
// const { htmlToText } = require("html-to-text");

// function extractImageFromDescription(description) {
//   const imgRegex = /<img[^>]+src=["'](.*?)["']/;
//   const match = description.match(imgRegex);
//   return match ? match[1] : null;
// }

// const fetchAndStoreNews = async () => {
//   try {
//     const response = await axios.get("https://vnexpress.net/rss/giao-duc.rss");
//     const xml = await xml2js.parseStringPromise(response.data);
//     const items = xml.rss.channel[0].item;

//     const newsItems = items.map((item) => {
//       const descriptionHtml = item.description[0];

//       // Chuyển HTML sang text
//       const strippedText = htmlToText(descriptionHtml, { wordwrap: 130 });

//       // Loại bỏ các đường link URL khỏi text
//       const cleanedText = strippedText
//         .replace(/https?:\/\/[^\s]+/g, "")
//         .replace(/^\s*\[\s*/, "");

//       return {
//         title: item.title[0],
//         description: cleanedText.trim(),
//         link: item.link[0],
//         pubDate: new Date(item.pubDate[0]),
//         image:
//           (item["media:thumbnail"] && item["media:thumbnail"][0].$.url) ||
//           extractImageFromDescription(descriptionHtml) ||
//           null,
//         category: "Education",
//       };
//     });

//     // Store in MongoDB, skip duplicates
//     for (const newsItem of newsItems) {
//       await News.findOneAndUpdate({ link: newsItem.link }, newsItem, {
//         upsert: true,
//         new: true,
//       });
//     }
//     console.log("News updated successfully");
//   } catch (error) {
//     console.error("Error fetching news:", error.message);
//     throw error;
//   }
// };

// module.exports = { fetchAndStoreNews };

const axios = require("axios");
const xml2js = require("xml2js");
const News = require("../models/news");
const { htmlToText } = require("html-to-text");

function extractImageFromDescription(description) {
  const imgRegex = /<img[^>]+src=["'](.*?)["']/;
  const match = description.match(imgRegex);
  return match ? match[1] : null;
}

// Định nghĩa danh sách RSS theo danh mục
const rssUrls = {
  "tin-tuc": "https://vnexpress.net/rss/giao-duc.rss",
  "tuyen-sinh": "https://vnexpress.net/rss/tuyen-sinh.rss",
  "goc-nhin": "https://vnexpress.net/rss/goc-nhin.rss",
  "giao-duc-4-0": "https://vnexpress.net/rss/khoa-hoc.rss",
};

const fetchAndStoreNews = async (category = "tin-tuc") => {
  try {
    const rssUrl = rssUrls[category] || rssUrls["tin-tuc"]; // Mặc định là Tin tức
    const response = await axios.get(rssUrl);
    const xml = await xml2js.parseStringPromise(response.data);
    const items = xml.rss.channel[0].item;

    const newsItems = items.map((item) => {
      const descriptionHtml = item.description[0];

      // Chuyển HTML sang text
      const strippedText = htmlToText(descriptionHtml, { wordwrap: 130 });

      // Loại bỏ các đường link URL khỏi text
      const cleanedText = strippedText
        .replace(/https?:\/\/[^\s]+/g, "")
        .replace(/^\s*\[\s*/, "");

      return {
        title: item.title[0],
        description: cleanedText.trim(),
        link: item.link[0],
        pubDate: new Date(item.pubDate[0]),
        image:
          (item["media:thumbnail"] && item["media:thumbnail"][0].$.url) ||
          extractImageFromDescription(descriptionHtml) ||
          null,
        category: category.charAt(0).toUpperCase() + category.slice(1), // Lưu danh mục
      };
    });

    // Store in MongoDB, skip duplicates
    for (const newsItem of newsItems) {
      await News.findOneAndUpdate({ link: newsItem.link }, newsItem, {
        upsert: true,
        new: true,
      });
    }
    console.log(`News updated successfully for category: ${category}`);
  } catch (error) {
    console.error(
      `Error fetching news for category ${category}:`,
      error.message
    );
    throw error;
  }
};

// Hàm để cập nhật tất cả danh mục (dùng cho cron job)
const fetchAndStoreAllNews = async () => {
  for (const category of Object.keys(rssUrls)) {
    await fetchAndStoreNews(category);
  }
};

module.exports = { fetchAndStoreNews, fetchAndStoreAllNews };
