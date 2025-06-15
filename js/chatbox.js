document.addEventListener("DOMContentLoaded", () => {
  const ws = new WebSocket("ws://localhost:3000");
  const chatArea = document.getElementById("chat-area");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const fileInput = document.getElementById("file-input");
  const sidebar = document.querySelector(".sidebar");
  const inputArea = document.querySelector(".input-area");
  const historyList = document.querySelector(".history-list");
  const logo = document.querySelector(".header .right-buttons .logo img");
  const roboContainer = document.getElementById("robo-container");
  const micButton = document.getElementById("mic-button");
  const speakerButton = document.getElementById("speaker-button");

  let pendingFileName = null;
  let userId = null;
  let loadingMessage = null;
  let isChatMode = true;
  let isListening = false; // Trạng thái nhận diện giọng nói
  let isMuted = false;
  const voiceHandler = new VoiceRecognitionHandler();

  // Tự động điều chỉnh chiều cao textarea
  function adjustTextareaHeight() {
    userInput.style.height = "auto";
    userInput.style.height = `${userInput.scrollHeight}px`;
    // Đảm bảo input-area luôn hiển thị đúng
    updateInputAreaPosition();
  }

  // Cập nhật vị trí input-area dựa trên trạng thái sidebar
  function updateInputAreaPosition() {
    const sidebarWidth = sidebar.classList.contains("active") ? 250 : 50;
    const windowWidth = window.innerWidth;
    const inputWidth = Math.min(600, windowWidth * 0.8 - (sidebarWidth - 50));
    inputArea.style.width = `${inputWidth}px`;
    inputArea.style.transform = `translateX(-50%) translateX(${
      sidebarWidth - 50
    }px)`;
  }

  // Gọi khi tải trang và khi sidebar thay đổi
  window.addEventListener("resize", updateInputAreaPosition);
  sidebar.addEventListener("transitionend", updateInputAreaPosition);

  userInput.addEventListener("input", adjustTextareaHeight);

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

  // View: Hiển thị tin nhắn trong khu vực trò chuyện
  function displayMessage(content, sender, timestamp) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = content;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    if (
      !isChatMode &&
      sender === "bot" &&
      !isMuted &&
      roboContainer.style.display !== "none"
    ) {
      window.speakText(content);
    }
  }

  function displayHistory(messages) {
    historyList.innerHTML = "";
    messages.forEach((msg) => {
      const historyItem = document.createElement("div");
      historyItem.className = `history-item ${msg.sender}`;
      const shortContent =
        msg.content.length > 50
          ? msg.content.substring(0, 47) + "..."
          : msg.content;
      historyItem.innerHTML = `<span>${shortContent}</span><span>${getRelativeTime(
        msg.timestamp
      )}</span>`;
      historyItem.dataset.timestamp = msg.timestamp;
      historyItem.addEventListener("click", () => {
        ws.send(`loadChat:${msg.timestamp}`);
      });
      historyList.appendChild(historyItem);
    });
  }

  // Controller: Trình xử lý WebSocket
  ws.onopen = () => {
    console.log("Connected to WebSocket server");
  };

  ws.onmessage = (event) => {
    const data = event.data;
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.type === "userId") {
        userId = parsedData.userId;
        console.log("Received userId:", userId);
      } else if (parsedData.type === "history") {
        displayHistory(parsedData.messages);
      } else if (parsedData.type === "loadChat") {
        chatArea.innerHTML = "";
        parsedData.messages.forEach((msg) =>
          displayMessage(msg.content, msg.sender, msg.timestamp)
        );
        chatArea.scrollTop = chatArea.scrollHeight;
      } else if (parsedData.type === "newChat") {
        chatArea.innerHTML =
          '<div class="message bot">Xin chào! Tôi là TechieBot, trợ lý học tập của bạn. Hôm nay tôi có thể giúp gì cho bạn?</div>';
        chatArea.scrollTop = chatArea.scrollHeight;
        ws.send(`getHistory:${userId}`);
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

  // Controller: Gửi tin nhắn hoặc tệp
  function sendMessage() {
    if (!userInput || !sendButton) {
      console.error("userInput or sendButton not found");
      return;
    }

    const messageText = userInput.value.trim();

    if (!messageText && !pendingFileName) {
      console.log("No message or file to send");
      return;
    }

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

  if (sendButton) {
    sendButton.addEventListener("click", () => {
      console.log("Send button clicked");
      sendMessage();
    });
  } else {
    console.error("sendButton not found");
  }

  if (userInput) {
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        console.log("Enter key pressed");
        sendMessage();
      }
    });
  } else {
    console.error("userInput not found");
  }

  // Controller: Nhập tệp
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        pendingFileName = file.name;
        userInput.value = pendingFileName;
        fileInput.value = "";
      }
    });
  } else {
    console.error("fileInput not found");
  }

  const btn = document.getElementById("btn");
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    adjustTextareaHeight(); // Đảm bảo textarea điều chỉnh sau khi sidebar thay đổi
  });

  // Controller: Nhấn vào lịch sử
  const historyItem = document.getElementById("history-item");
  if (historyItem) {
    historyItem.addEventListener("click", function () {
      const historyList = document.querySelector(".history-list");
      historyList.classList.toggle("active");
      if (historyList.classList.contains("active") && userId) {
        ws.send(`getHistory:${userId}`);
      } else {
        historyList.innerHTML = "";
      }
    });
  } else {
    console.error("history-item not found");
  }

  // Controller: Xem trước hình ảnh
  const fileInputForPreview = document.getElementById("file-input");
  if (fileInputForPreview) {
    fileInputForPreview.addEventListener("change", function (e) {
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
  } else {
    console.error("file-input for preview not found");
  }

  // Đoạn chat mới
  const newChatItem = document.querySelector(".nav-item");
  if (newChatItem) {
    newChatItem.addEventListener("click", () => {
      chatArea.innerHTML = "";
      ws.send("newChat");
    });
  }

  //   if (logo) {
  //     logo.addEventListener("click", () => {
  //       isChatMode = !isChatMode;
  //       if (isChatMode) {
  //         chatArea.style.display = "block";
  //         roboContainer.style.display = "none";
  //         inputArea.style.display = "flex";
  //         voiceHandler.stop(); // Dừng nhận diện giọng nói khi chuyển sang chat
  //         if (micButton) micButton.disabled = true; // Vô hiệu hóa mic khi ở chế độ chat
  //       } else {
  //         chatArea.style.display = "none";
  //         roboContainer.style.display = "block";
  //         inputArea.style.display = "none";
  //         voiceHandler.stop(); // Không tự động bật mic
  //         if (micButton) micButton.disabled = false; // Kích hoạt mic khi ở chế độ bot
  //       }
  //       console.log("Toggled mode, isChatMode:", isChatMode);
  //     });
  //   } else {
  //     console.error("Logo not found");
  //   }

  //   // Xử lý nút mic
  //   if (micButton) {
  //     micButton.addEventListener("click", () => {
  //       if (!isListening) {
  //         isListening = true;
  //         micButton.textContent = "⏹️"; // Thay bằng biểu tượng dừng
  //         micButton.title = "Nhấn để dừng";
  //         voiceHandler.start();
  //         voiceHandler.setOnResult((speechResult) => {
  //           const cleanedText = speechResult.replace(/\./g, "");
  //           const isFile = /\.[a-zA-Z0-9]+$/.test(speechResult);
  //           if (!isFile) {
  //             userInput.value = cleanedText;
  //             sendMessage();
  //           } else {
  //             displayMessage(
  //               `Đã nhận: ${speechResult} (xác nhận như file)`,
  //               "user"
  //             );
  //           }
  //         });
  //         voiceHandler.setOnError((error) => {
  //           displayMessage(
  //             `Lỗi khi nhận diện giọng nói: ${error}. Vui lòng thử lại!`,
  //             "bot"
  //           );
  //         });
  //         voiceHandler.setOnEnd(() => {
  //           if (isListening) voiceHandler.start();
  //         });
  //       } else {
  //         isListening = false;
  //         micButton.textContent = "🎙️"; // Quay lại biểu tượng mic
  //         micButton.title = "Nhấn để nói";
  //         voiceHandler.stop();
  //       }
  //     });
  //   } else {
  //     console.error("micButton not found");
  //   }

  //   // Xử lý nút loa
  //   if (speakerButton) {
  //     speakerButton.addEventListener("click", () => {
  //       isMuted = !isMuted;
  //       speakerButton.textContent = isMuted ? "🔇" : "🔊"; // Thay đổi biểu tượng
  //       speakerButton.title = isMuted ? "Bật âm thanh" : "Tắt âm thanh";
  //       if (window.speechSynthesis) {
  //         window.speechSynthesis.cancel(); // Dừng bất kỳ phát âm nào đang chạy
  //       }
  //     });
  //   } else {
  //     console.error("speakerButton not found");
  //   }
  // });
  if (logo) {
    logo.addEventListener("click", () => {
      isChatMode = !isChatMode;
      if (isChatMode) {
        chatArea.style.display = "block";
        roboContainer.style.display = "none";
        inputArea.style.display = "flex";
        window.voiceHandler.stop();
        if (micButton) micButton.disabled = true;
        if (window.stopRobotAnimation) window.stopRobotAnimation();
      } else {
        chatArea.style.display = "none";
        roboContainer.style.display = "block";
        inputArea.style.display = "none";
        window.voiceHandler.stop();
        if (micButton) micButton.disabled = false;
        if (window.playRobotGreeting) window.playRobotGreeting();
      }
      console.log("Toggled mode, isChatMode:", isChatMode);
    });
  }

  // Xử lý nút mic
  if (micButton) {
    micButton.addEventListener("click", () => {
      if (!isListening) {
        isListening = true;
        micButton.textContent = "⏹️";
        micButton.title = "Nhấn để dừng";
        voiceHandler.start();
        // Dừng animation khi bắt đầu nói
        if (window.stopRobotAnimation) window.stopRobotAnimation();
        voiceHandler.setOnResult((speechResult) => {
          const cleanedText = speechResult.replace(/\./g, "");
          const isFile = /\.[a-zA-Z0-9]+$/.test(speechResult);
          if (!isFile) {
            userInput.value = cleanedText;
            sendMessage();
          } else {
            displayMessage(
              `Đã nhận: ${speechResult} (xác nhận như file)`,
              "user"
            );
          }
        });
        voiceHandler.setOnError((error) => {
          displayMessage(
            `Lỗi khi nhận diện giọng nói: ${error}. Vui lòng thử lại!`,
            "bot"
          );
        });
        voiceHandler.setOnEnd(() => {
          if (isListening) voiceHandler.start();
        });
      } else {
        isListening = false;
        micButton.textContent = "🎙️";
        micButton.title = "Nhấn để nói";
        voiceHandler.stop();
        // Tiếp tục animation nếu ở chế độ box
        if (!isChatMode && window.playRobotAnimation)
          window.playRobotAnimation();
      }
    });
  }

  // Xử lý nút loa
  if (speakerButton) {
    speakerButton.addEventListener("click", () => {
      isMuted = !isMuted;
      speakerButton.textContent = isMuted ? "🔇" : "🔊";
      speakerButton.title = isMuted ? "Bật âm thanh" : "Tắt âm thanh";
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    });
  }
});
