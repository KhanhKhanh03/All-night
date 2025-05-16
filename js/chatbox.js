// const ws = new WebSocket("ws://localhost:3000");
// const chatArea = document.getElementById("chat-area");
// const userInput = document.getElementById("user-input");
// const sendButton = document.getElementById("send-button");
// const fileInput = document.getElementById("file-input");

// let pendingFileName = null;

// ws.onopen = () => {
//   console.log("Connected to WebSocket server");
// };

// let loadingMessage = null;

// ws.onmessage = (event) => {
//   const message = event.data;
//   const messageDiv = document.createElement("div");
//   messageDiv.className = "message bot";
//   messageDiv.textContent = message;
//   chatArea.appendChild(messageDiv);

//   // Remove loading message if it exists
//   if (loadingMessage) {
//     chatArea.removeChild(loadingMessage);
//     loadingMessage = null;
//   }

//   chatArea.scrollTop = chatArea.scrollHeight;
// };

// ws.onclose = () => {
//   console.log("Disconnected from WebSocket server");
//   const messageDiv = document.createElement("div");
//   messageDiv.className = "message bot";
//   messageDiv.textContent = "Mất kết nối với server. Vui lòng thử lại!";
//   chatArea.appendChild(messageDiv);
//   chatArea.scrollTop = chatArea.scrollHeight;
// };

// ws.onerror = () => {
//   console.log("WebSocket error occurred");
//   const messageDiv = document.createElement("div");
//   messageDiv.className = "message bot";
//   messageDiv.textContent = "Lỗi kết nối WebSocket. Vui lòng kiểm tra lại!";
//   chatArea.appendChild(messageDiv);
//   chatArea.scrollTop = chatArea.scrollHeight;
// };

// // Handle file selection (display in input field but don't send yet)
// fileInput.addEventListener("change", (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     pendingFileName = file.name;
//     userInput.value = pendingFileName; // Display file name in input
//     fileInput.value = ""; // Reset file input
//   }
// });

// // Send message or file when the send button is clicked or Enter is pressed
// function sendMessage() {
//   const messageText = userInput.value.trim();

//   if (!messageText && !pendingFileName) return; // Don't send if both are empty

//   if (pendingFileName) {
//     // Send file name
//     const messageDiv = document.createElement("div");
//     messageDiv.className = "message user";
//     messageDiv.textContent = pendingFileName;
//     chatArea.appendChild(messageDiv);
//     chatArea.scrollTop = chatArea.scrollHeight;

//     ws.send(pendingFileName); // Send only the file name

//     pendingFileName = null; // Clear pending file
//     userInput.value = ""; // Clear input
//   } else if (messageText) {
//     // Send text message
//     const messageDiv = document.createElement("div");
//     messageDiv.className = "message user";
//     messageDiv.textContent = messageText;
//     chatArea.appendChild(messageDiv);
//     chatArea.scrollTop = chatArea.scrollHeight;

//     ws.send(messageText); // Send the raw message

//     // Display loading message
//     const loadingDiv = document.createElement("div");
//     loadingDiv.className = "message loading";
//     loadingDiv.textContent = "Đang xử lý...";
//     chatArea.appendChild(loadingDiv);
//     chatArea.scrollTop = chatArea.scrollHeight;
//     loadingMessage = loadingDiv;

//     userInput.value = ""; // Clear input
//   }
// }

// // Handle send button click
// sendButton.addEventListener("click", sendMessage);

// // Handle Enter key press
// userInput.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") {
//     sendMessage();
//   }
// });

// // Toggle sidebar
// document.getElementById("btn").addEventListener("click", function () {
//   // document.querySelector(".sidebar").classList.toggle("active");
//   const sidebar = document.querySelector(".sidebar");
//   const inputArea = document.querySelector(".input-area");

//   sidebar.classList.toggle("active");
// });

// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .getElementById("file-input")
//     .addEventListener("change", function (e) {
//       const file = e.target.files[0];
//       const previewContainer = document.getElementById(
//         "image-preview-container"
//       );
//       const previewImage = document.getElementById("image-preview");

//       if (file && file.type.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = function (event) {
//           previewImage.src = event.target.result;
//           previewContainer.style.display = "block";
//         };
//         reader.readAsDataURL(file);
//       } else {
//         previewContainer.style.display = "none";
//         previewImage.src = "";
//       }
//     });
// });

const ws = new WebSocket("ws://localhost:3000");
const chatArea = document.getElementById("chat-area");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const fileInput = document.getElementById("file-input");

let pendingFileName = null;
let userId = null;

// Hàm tính thời gian tương đối
function getRelativeTime(timestamp) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  }
}

// View: Display message in chat-area
function displayMessage(content, sender, timestamp) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.innerHTML = content;
  chatArea.appendChild(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function displayHistory(messages) {
  const historyList = document.querySelector(".history-list");
  historyList.innerHTML = "";
  messages.forEach((msg) => {
    const historyItem = document.createElement("div");
    historyItem.className = `history-item ${msg.sender}`;

    // Cắt ngắn nội dung tin nhắn (tối đa 50 ký tự)
    const maxLength = 50;
    let shortContent = msg.content;
    if (shortContent.length > maxLength) {
      shortContent = shortContent.substring(0, maxLength - 3) + "...";
    }

    // Lấy thời gian tương đối
    const relativeTime = getRelativeTime(msg.timestamp);

    // Hiển thị thời gian tương đối và nội dung ngắn
    historyItem.innerHTML = `
      <span class="relative-time">${relativeTime}</span>
      <span class="short-content">${shortContent}</span>
    `;
    historyList.appendChild(historyItem);
  });
}

// Controller: WebSocket handlers
ws.onopen = () => {
  console.log("Connected to WebSocket server");
};

let loadingMessage = null;

ws.onmessage = (event) => {
  const data = event.data;
  try {
    const parsedData = JSON.parse(data);
    if (parsedData.type === "userId") {
      userId = parsedData.userId;
      console.log("Received userId:", userId);
    } else if (parsedData.type === "history") {
      displayHistory(parsedData.messages);
    }
  } catch (e) {
    const message = data;
    displayMessage(message, "bot");

    if (loadingMessage) {
      chatArea.removeChild(loadingMessage);
      loadingMessage = null;
    }
  }
};

ws.onclose = () => {
  console.log("Disconnected from WebSocket server");
  displayMessage("Mất kết nối với server. Vui lòng thử lại!", "bot");
};

ws.onerror = () => {
  console.log("WebSocket error occurred");
  displayMessage("Lỗi kết nối WebSocket. Vui lòng kiểm tra lại!", "bot");
};

// Controller: Send message or file
function sendMessage() {
  const messageText = userInput.value.trim();

  if (!messageText && !pendingFileName) return;

  const timestamp = new Date().toLocaleString("vi-VN");
  if (pendingFileName) {
    displayMessage(pendingFileName, "user");
    ws.send(pendingFileName);
    pendingFileName = null;
    userInput.value = "";
  } else if (messageText) {
    displayMessage(messageText, "user");
    ws.send(messageText);

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message loading";
    loadingDiv.textContent = "Đang xử lý...";
    chatArea.appendChild(loadingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    loadingMessage = loadingDiv;

    userInput.value = "";
  }
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Controller: File input
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    pendingFileName = file.name;
    userInput.value = pendingFileName;
    fileInput.value = "";
  }
});

// Controller: Toggle sidebar
document.getElementById("btn").addEventListener("click", function () {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");
});

// Controller: History click
document.getElementById("history-item").addEventListener("click", function () {
  const historyList = document.querySelector(".history-list");
  historyList.classList.toggle("active");
  if (historyList.classList.contains("active") && userId) {
    ws.send(`getHistory:${userId}`);
  } else {
    historyList.innerHTML = "";
  }
});

// Controller: Image preview
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("file-input")
    .addEventListener("change", function (e) {
      const file = e.target.files[0];
      const previewContainer = document.getElementById(
        "image-preview-container"
      );
      const previewImage = document.getElementById("image-preview");

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (event) {
          previewImage.src = event.target.result;
          previewContainer.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        previewContainer.style.display = "none";
        previewImage.src = "";
      }
    });
});

//Đoạn chat mới
document.querySelector(".nav-item").addEventListener("click", function () {
  const chatArea = document.getElementById("chat-area");
  // Xóa khu vực chat và thêm tin nhắn chào mừng
  chatArea.innerHTML = `
    <div class="message bot">
      Xin chào! Tôi là TechieBot, trợ lý học tập của bạn. Hôm nay tôi có thể giúp gì cho bạn?
    </div>
  `;
  chatArea.scrollTop = chatArea.scrollHeight;
  // Yêu cầu userId mới từ server
  ws.send("newChat");
});
