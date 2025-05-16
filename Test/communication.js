// Initialize chat application
document.addEventListener('DOMContentLoaded', () => {
  // Select chat or group
  document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => {
      const user = item.getAttribute('data-user');
      const group = item.getAttribute('data-group');
      const title = group ? group : user;
      document.getElementById('chat-title').textContent = title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, ' ');
      document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      loadChatHistory(title);
      gsap.from('#chat-messages', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
    });
  });

  // Search friends and groups
  document.getElementById('search-friends').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.chat-item').forEach(item => {
      const text = item.querySelector('.chat-name').textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'flex' : 'none';
      gsap.from(item, { opacity: 0, duration: 0.3, ease: 'power2.in' });
    });
  });

  document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-friends').value.toLowerCase();
    alert(`Đang tìm kiếm: ${query}. Kết quả sẽ hiển thị khi hệ thống tích hợp thêm!`);
    gsap.fromTo('#search-btn', { scale: 1 }, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
  });

  // Create new group
  document.getElementById('create-group').addEventListener('click', () => {
    const groupName = prompt('Nhập tên nhóm mới:');
    if (groupName) {
      const groupItem = document.createElement('li');
      groupItem.className = 'list-group-item chat-item d-flex align-items-center p-3';
      groupItem.setAttribute('data-group', groupName.toLowerCase().replace(/ /g, '-'));
      groupItem.innerHTML = `
        <i class="fas fa-users rounded-circle me-2 p-2 bg-primary text-white"></i>
        <div class="flex-grow-1">
          <span class="chat-name">${groupName}</span>
          <p class="chat-preview mb-0 text-muted">Nhóm mới được tạo</p>
        </div>
      `;
      document.getElementById('chat-list').appendChild(groupItem);
      gsap.from(groupItem, { opacity: 0, y: -20, duration: 0.5, ease: 'back.out' });
      alert(`Nhóm "${groupName}" đã được tạo thành công!`);
    }
  });

  // Send message
  document.getElementById('send-message').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
      const chatTitle = document.getElementById('chat-title').textContent;
      const isGroup = document.querySelector('.chat-item.active').hasAttribute('data-group');
      const messageClass = isGroup ? 'group-message sent' : 'sent';
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage = document.createElement('div');
      newMessage.className = `message ${messageClass} animate__animated animate__fadeInRight`;
      newMessage.innerHTML = `
        <div class="message-content">
          <p class="mb-0">${message}</p>
          <span class="message-time">Huỳnh Nguyên Khánh • ${time}</span>
        </div>
      `;
      document.getElementById('chat-messages').appendChild(newMessage);
      updateChatPreview(chatTitle, message);
      input.value = '';
      scrollToBottom();
      gsap.from(newMessage, { opacity: 0, x: 20, duration: 0.3, ease: 'power2.out' });
    }
  });

  // Handle Enter key to send message
  document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('send-message').click();
    }
  });

  // Video call (simulated)
  document.getElementById('video-call').addEventListener('click', () => {
    alert('Bắt đầu cuộc gọi video với ' + document.getElementById('chat-title').textContent + '! (Chức năng giả lập)');
    gsap.fromTo('#video-call', { scale: 1 }, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
  });

  // Attach file
  document.getElementById('attach-file').addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
    fileInput.onchange = () => {
      const files = fileInput.files;
      if (files.length > 0) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        const newMessage = document.createElement('div');
        newMessage.className = 'message sent animate__animated animate__fadeInRight';
        newMessage.innerHTML = `
          <div class="message-content">
            <p class="mb-0">Đính kèm: ${fileNames}</p>
            <span class="message-time">Huỳnh Nguyên Khánh • ${time}</span>
          </div>
        `;
        document.getElementById('chat-messages').appendChild(newMessage);
        updateChatPreview(document.getElementById('chat-title').textContent, `Đính kèm: ${fileNames}`);
        scrollToBottom();
        gsap.from(newMessage, { opacity: 0, x: 20, duration: 0.3, ease: 'power2.out' });
        fileInput.value = ''; // Reset file input
      }
    };
  });

  // Emoji Picker
  document.getElementById('emoji-btn').addEventListener('click', () => {
    const emojiPicker = document.getElementById('emoji-picker');
    if (emojiPicker.style.display === 'none') {
      emojiPicker.style.display = 'block';
      emojiPicker.innerHTML = '';
      const picker = new EmojiButton({
        position: 'auto',
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light',
        autoClose: true,
        categories: ['smileys', 'people', 'animals', 'food', 'travel', 'activities', 'objects', 'symbols', 'flags'],
      });
      picker.on('emoji', (emoji) => {
        document.getElementById('message-input').value += emoji;
        emojiPicker.style.display = 'none';
      });
      picker.togglePicker(emojiPicker);
    } else {
      emojiPicker.style.display = 'none';
    }
  });

  // Toggle dark mode
  document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    gsap.fromTo('#dark-mode-toggle', { rotation: 0 }, { rotation: 360, duration: 0.5, ease: 'bounce.out' });
    const icon = document.getElementById('dark-mode-toggle').querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
  });

  // Update chat preview
  function updateChatPreview(chatTitle, message) {
    const chatItem = document.querySelector(`.chat-item.active`);
    if (chatItem) {
      chatItem.querySelector('.chat-preview').textContent = message;
    }
  }

  // Load chat history (simulated)
  function loadChatHistory(title) {
    document.getElementById('chat-messages').innerHTML = '';
    const messages = [
      { sender: 'Huỳnh Nguyên Khánh', time: '08:27 PM', text: 'Chào mọi người! Mình đang gặp khó với bài toán x² - 5x + 6 = 0. Ai giúp mình nhé? 😊' },
      { sender: 'Nguyễn Quốc Duy', time: '08:29 PM', text: 'Chào Khánh! Dùng delta: delta = 1, x1 = 2, x2 = 3. Thử đi! 📝' },
      { sender: 'Huỳnh Nguyên Khánh', time: '08:31 PM', text: 'Cảm ơn Duy! Có bài nào khó hơn không? 🤓' },
      { sender: 'Mai Cam Thảo', time: '08:33 PM', text: 'Có nè! Giải ∫(x² + 1)dx từ 0 đến 2 đi! 🧠' },
      { sender: 'Huỳnh Nguyên Khánh', time: '08:35 PM', text: 'Kết quả là 14/3. Thảo kiểm tra giúp mình! 🙏' },
      { sender: 'Nguyễn Anh Kiệt', time: '08:36 PM', text: 'Đúng rồi! Mình cần phân tích "Tây Tiến", ai hỗ trợ? 📚' },
    ];
    if (title === 'Nhóm Học Tập 1') {
      messages.push(
        { sender: 'Huỳnh Nguyên Khánh', time: '08:38 PM', text: '[Nhóm Học Tập 1] Mọi người, ta phân công ôn tập nhé. Mình làm toán, ai làm văn? 📅' },
        { sender: 'Nguyễn Quốc Duy', time: '08:40 PM', text: '[Nhóm Học Tập 1] Mình làm văn. Thảo làm lý được không? ✍️' },
        { sender: 'Mai Cam Thảo', time: '08:41 PM', text: '[Nhóm Học Tập 1] OK, mình làm lý. Kiệt làm hóa nhé! 🧪' }
      );
    }
    messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.sender === 'Huỳnh Nguyên Khánh' ? 'sent' : 'received'} ${title === 'Nhóm Học Tập 1' ? 'group-message' : ''} animate__animated animate__fadeIn${msg.sender === 'Huỳnh Nguyên Khánh' ? 'Right' : 'Left'}`;
      messageDiv.innerHTML = `
        <div class="message-content">
          <p class="mb-0">${msg.text}</p>
          <span class="message-time">${msg.sender} • ${msg.time}</span>
        </div>
      `;
      document.getElementById('chat-messages').appendChild(messageDiv);
    });
    scrollToBottom();
  }

  // Scroll to bottom of chat
  function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Initialize with default group
  document.querySelector('.chat-item[data-group="hoc-tap-nhom-1"]').click();
});