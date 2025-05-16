const express = require("express");
const WebSocket = require("ws");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cron = require("node-cron");
const { connectDB } = require("../connect/db");
const newsRoutes = require("../routers/routers");
const newsService = require("../services/service");
const { saveMessage, getHistory } = require("../services/messageService");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "robo.html"));
});

// Routes for news API
app.use("/api", newsRoutes);

// Connect to MongoDB
connectDB();

// Schedule daily news update at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    await newsService.fetchAndStoreAllNews();
    console.log("Daily news update completed");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

// Initial fetch on server start
newsService.fetchAndStoreAllNews();

// Start Express server
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Create WebSocket server on the same server instance
const wss = new WebSocket.Server({ server });

// OpenRouter API configuration
const openrouterApiKey = process.env.OPENROUTER_API_KEY;
const openrouterUrl = "https://openrouter.ai/api/v1/chat/completions";

// Handle WebSocket connections
// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   ws.on("message", async (message) => {
//     const receivedMessage = message.toString();

//     // Check if the message is a file name (contains a file extension)
//     if (receivedMessage.includes(".")) {
//       console.log("File received:", receivedMessage);
//       ws.send(`Đã nhận file: ${receivedMessage}`);
//       ws.send(
//         "Hiện tại tôi chỉ có thể xác nhận thông tin file, chưa xử lý nội dung file."
//       );
//     } else {
//       // Handle as a text message
//       try {
//         // Call OpenRouter API
//         const response = await axios.post(
//           openrouterUrl,
//           {
//             model: "deepseek/deepseek-chat:free", // Hoặc "deepseek/deepseek-r1:free"
//             messages: [{ role: "user", content: receivedMessage }],
//             max_tokens: 150,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${openrouterApiKey}`,
//               "Content-Type": "application/json",
//               "HTTP-Referer": "YOUR_SITE_URL", // Thay bằng URL của bạn (tùy chọn)
//               "X-Title": "YOUR_SITE_NAME", // Thay bằng tên site (tùy chọn)
//             },
//           }
//         );

//         const botReply = response.data.choices[0].message.content;
//         ws.send(botReply);
//       } catch (error) {
//         console.error("Error calling OpenRouter API:", error.message);
//         let errorMessage = "Lỗi khi kết nối với AI. Vui lòng thử lại!";
//         if (error.response) {
//           errorMessage = `Lỗi từ OpenRouter: ${error.response.status} - ${error.response.data.error.message}`;
//         }
//         ws.send(errorMessage);
//       }
//     }
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });
wss.on("connection", (ws) => {
  console.log("Client connected");

  const userId = Math.random().toString(36).substr(2, 9);
  console.log(`Assigned userId: ${userId}`);
  ws.send(JSON.stringify({ type: "userId", userId }));

  ws.on("message", async (message) => {
    const receivedMessage = message.toString();

    //   if (receivedMessage === "newChat") {
    //   const newUserId = Math.random().toString(36).substr(2, 9);
    //   ws.send(JSON.stringify({ type: "userId", userId: newUserId }));
    //   return;
    // }

    if (receivedMessage.startsWith("getHistory:")) {
      const requestedUserId = receivedMessage.split(":")[1];
      const messages = await getHistory(requestedUserId);
      ws.send(JSON.stringify({ type: "history", messages }));
      return;
    }

    if (!receivedMessage.includes(".")) {
      await saveMessage(receivedMessage, "user", userId);
    }

    if (receivedMessage.includes(".")) {
      console.log("File received:", receivedMessage);
      await saveMessage(receivedMessage, "user", userId);
      ws.send(`Đã nhận file: ${receivedMessage}`);
      ws.send(
        "Hiện tại tôi chỉ có thể xác nhận thông tin file, chưa xử lý nội dung file."
      );
    } else {
      try {
        const response = await axios.post(
          openrouterUrl,
          {
            model: "deepseek/deepseek-chat:free",
            messages: [{ role: "user", content: receivedMessage }],
            max_tokens: 150,
          },
          {
            headers: {
              Authorization: `Bearer ${openrouterApiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "TechieBot",
            },
          }
        );

        const botReply = response.data.choices[0].message.content;
        await saveMessage(botReply, "bot", userId);
        ws.send(botReply);
      } catch (error) {
        console.error("Error calling OpenRouter API:", error.message);
        // Xử lý lỗi giới hạn (rate limit)
        if (error.response?.data?.error?.code === 429) {
          errorMessage =
            "Bạn đã dùng hết lượt chat miễn phí hôm nay. Vui lòng thử lại vào ngày mai hoặc nâng cấp tài khoản.";
        } else if (error.response?.data?.error?.message) {
          errorMessage = `Lỗi từ OpenRouter: ${error.response.status} - ${error.response.data.error.message}`;
        }
        await saveMessage(errorMessage, "bot", userId);
        ws.send(errorMessage);
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
