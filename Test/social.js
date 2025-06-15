// Initialize post data with simulated comments
let postData = JSON.parse(localStorage.getItem('postData')) || {
  '1': { likes: 12, comments: 5, shares: 3, liked: false, commentList: ['Nguyễn Anh Kiệt: Đáp án là A!', 'Mai Cam Thảo: Mình nghĩ là B, bạn thử kiểm tra lại xem!', 'Nguyễn Đăng Khôi: Có ai giải chi tiết không?', 'Kim Anh Nguyễn Cửu: Cảm ơn bạn đã đăng bài!', 'Hà My: Câu này khó thật!'] },
  '2': { likes: 8, comments: 2, shares: 1, liked: false, commentList: ['Mai Cam Thảo: Có khó thật!', 'Jenifer Phạm: Bạn inbox mình mình giải cho!'] },
  '3': { likes: 15, comments: 7, shares: 4, liked: false, commentList: ['Nguyễn Đăng Khôi: Chúc mừng!', 'Huỳnh Nguyên Khánh: Bài này hay lắm!', 'Đức Anh: Có tài liệu gì hay share mình với!', 'Vo Dinh Phu: Cảm ơn bạn!', 'Châu Linh: Mình cũng đang tìm hiểu!', 'Minh Duc Do: Tuyệt vời!', 'Đặng Tiểu Phương: Có ai biết thêm không?'] },
  '4': { likes: 10, comments: 3, shares: 2, liked: false, commentList: ['Jenifer Phạm: Tôi có thể giúp!', 'Nguyễn Quốc Duy: Cảm ơn bạn nhiều!', 'Huỳnh Nguyên Khánh: Bài này giải thế nào vậy?'] }
};
localStorage.setItem('postData', JSON.stringify(postData));

// Simulated additional posts
const additionalPosts = {
  global: [
    { id: 5, avatar: 'images/avt6.jpg', author: 'Nguyễn Đăng Khôi', date: '2025-05-11', content: 'Hôm nay mình học được cách sử dụng HTML!', image: 'images/pic2.jpg', likes: 5, comments: 1, shares: 0, liked: false, commentList: ['Huỳnh Nguyên Khánh: Tuyệt vời!', 'Mai Cam Thảo: Cố lên bạn!'] },
    { id: 6, avatar: 'images/avt8.jpg', author: 'Mai Cam Thảo', date: '2025-05-12', content: 'Ai biết cách làm bài tập này không?', image: 'images/de3.png', likes: 3, comments: 0, shares: 0, liked: false, commentList: [] },
    { id: 7, avatar: 'images/avt9.jpg', author: 'Kim Anh Nguyễn Cửu', date: '2025-05-13', content: 'Mình vừa học xong CSS!', image: 'images/pic3.jpg', likes: 7, comments: 2, shares: 1, liked: false, commentList: ['Nguyễn Quốc Duy: Đẹp lắm!', 'Hà My: Có ví dụ nào hay không?'] },
    { id: 8, avatar: 'images/avt10.jpg', author: 'Jenifer Phạm', date: '2025-05-14', content: 'Python thật thú vị!', image: '', likes: 4, comments: 1, shares: 0, liked: false, commentList: ['Nguyễn Anh Kiệt: Đồng ý!'] }
  ],
  personal: [
    { id: 5, avatar: 'images/avt4.jpg', author: 'Nguyễn Quốc Duy', date: '2025-05-06', content: 'Học CSS thật thú vị!', image: 'images/pic3.jpg', likes: 9, comments: 2, shares: 1, liked: false, commentList: ['Mai Cam Thảo: Đẹp quá!', 'Nguyễn Đăng Khôi: Bạn làm được gì hay ho chưa?'] },
    { id: 6, avatar: 'images/avt4.jpg', author: 'Nguyễn Quốc Duy', date: '2025-05-05', content: 'Mình đang tìm tài liệu học JavaScript!', image: '', likes: 6, comments: 1, shares: 0, liked: false, commentList: ['Nguyễn Đăng Khôi: Có thể thử W3Schools!'] },
    { id: 7, avatar: 'images/avt4.jpg', author: 'Nguyễn Quốc Duy', date: '2025-05-04', content: 'Hôm nay học React.js!', image: 'images/pic4.png', likes: 8, comments: 3, shares: 2, liked: false, commentList: ['Jenifer Phạm: Hay lắm!', 'Huỳnh Nguyên Khánh: Cố lên!', 'Đức Anh: Có khó không bạn?'] },
    { id: 8, avatar: 'images/avt4.jpg', author: 'Nguyễn Quốc Duy', date: '2025-05-03', content: 'Đang ôn thi Ngữ Văn 12!', image: 'images/pic5.png', likes: 5, comments: 1, shares: 1, liked: false, commentList: ['Nguyễn Anh Kiệt: Chúc may mắn!'] }
  ]
};

// Notification system
const notifications = [];

function addNotification(message) {
  notifications.push({ message, timestamp: new Date().toISOString() });
  updateNotificationUI();
}

function updateNotificationUI() {
  const notificationList = document.querySelector('.notification-list');
  const notificationCount = document.querySelector('.notification-count');
  notificationList.innerHTML = notifications.length > 0
    ? notifications.map(n => `<div class="notification-item">${n.message} <small>${new Date(n.timestamp).toLocaleTimeString()}</small></div>`).join('')
    : '<div class="notification-item">Chưa có thông báo mới.</div>';
  notificationCount.textContent = notifications.length;
}

// Tab switching
$('#postTabs a').on('click', function (e) {
  e.preventDefault();
  $(this).tab('show');
  gsap.from($(this).parent().siblings(), { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
});

// Scroll reveal and animations
document.addEventListener('DOMContentLoaded', function () {
  const revealElements = document.querySelectorAll('.reveal');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  const revealOnScroll = () => {
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight * 0.8) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });

    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // Scroll to top
  scrollTopBtn.addEventListener('click', () => {
    gsap.to(window, { scrollTo: { y: 0 }, duration: 1, ease: 'power2.inOut' });
  });

  // Dark mode toggle
  document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    addNotification('Đã chuyển đổi chế độ giao diện!');
  });

  // Notification toggle
  document.getElementById('notification-toggle').addEventListener('click', () => {
    const dropdown = document.getElementById('notification-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Function to create post modal
  function createPostModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'createPostModal';
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content bg-white">
          <div class="modal-header">
            <h5 class="modal-title text-primary">Tạo Bài Đăng Mới</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div id="post-editor" style="min-height: 150px;"></div>
            <input type="file" class="form-control mt-3" accept="image/*" id="post-image-upload">
            <img id="post-image-preview" class="post-image w-100" style="display: none;">
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button class="btn btn-primary post-submit">Đăng</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Initialize Quill editor
    const quill = new Quill('#post-editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          ['link'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['clean']
        ]
      },
      placeholder: 'Bạn đang nghĩ gì?'
    });

    // Show modal with animation
    $(modal).modal('show');
    gsap.from(modal.querySelector('.modal-dialog'), { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out' });

    // Image preview
    const fileInput = modal.querySelector('#post-image-upload');
    const preview = modal.querySelector('#post-image-preview');
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        gsap.from(preview, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
      }
    });

    // Post submission
    modal.querySelector('.post-submit').addEventListener('click', () => {
      const content = modal.querySelector('#post-editor .ql-editor').innerHTML;
      const imageFile = fileInput.files[0];
      let imageUrl = '';

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imageUrl = e.target.result;
          savePost(content, imageUrl);
          finalizePost(modal, content);
        };
        reader.readAsDataURL(imageFile);
      } else {
        savePost(content, imageUrl);
        finalizePost(modal, content);
      }
    });

    $(modal).on('hidden.bs.modal', () => {
      modal.remove();
    });
  }

  // Bind create post modal to both buttons
  document.querySelectorAll('.create-post, #create-post-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      createPostModal();
    });
  });

  // Bind action buttons
  bindActionButtons();
});

function finalizePost(modal, content) {
  if (content && content !== '<p><br></p>') {
    gsap.to(modal.querySelector('.modal-dialog'), {
      scale: 1.1,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        $(modal).modal('hide');
        alert('Bài đăng của bạn đã được tạo!');
        modal.remove();
        addNotification('Bạn đã đăng một bài viết mới!');
      }
    });
  } else {
    alert('Vui lòng nhập nội dung!');
  }
}

function bindActionButtons() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.removeEventListener('click', handleLike);
    btn.addEventListener('click', handleLike);
  });

  document.querySelectorAll('.comment-btn').forEach(btn => {
    btn.removeEventListener('click', handleComment);
    btn.addEventListener('click', handleComment);
  });

  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.removeEventListener('click', handleShare);
    btn.addEventListener('click', handleShare);
  });

  document.querySelectorAll('.edit-post').forEach(link => {
    link.removeEventListener('click', handleEditPost);
    link.addEventListener('click', handleEditPost);
  });

  document.querySelectorAll('.delete-post').forEach(link => {
    link.removeEventListener('click', handleDeletePost);
    link.addEventListener('click', handleDeletePost);
  });
}

function handleLike() {
  const postId = this.getAttribute('data-post-id');
  let post = postData[postId];
  if (!post.liked) {
    post.likes++;
    post.liked = true;
    this.classList.add('liked');
    gsap.fromTo(this.querySelector('.like-count'), { scale: 1 }, { scale: 1.5, duration: 0.3, ease: 'power2.out', onComplete: () => gsap.to(this.querySelector('.like-count'), { scale: 1, duration: 0.3 }) });
    addNotification('Bạn đã thích một bài đăng!');
  } else {
    post.likes--;
    post.liked = false;
    this.classList.remove('liked');
    gsap.fromTo(this.querySelector('.like-count'), { scale: 1 }, { scale: 0.8, duration: 0.3, ease: 'power2.out', onComplete: () => gsap.to(this.querySelector('.like-count'), { scale: 1, duration: 0.3 }) });
  }
  this.querySelector('.like-count').textContent = post.likes;
  postData[postId] = post;
  localStorage.setItem('postData', JSON.stringify(postData));
}

function handleComment() {
  const postId = this.getAttribute('data-post-id');
  const post = postData[postId];
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content bg-white">
        <div class="modal-header">
          <h5 class="modal-title text-primary">Bình Luận</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="comment-list mb-3" style="max-height: 300px; overflow-y: auto;">
            ${post.commentList.length > 0 ? post.commentList.map(comment => `<p class="comment-item">${comment}</p>`).join('') : '<p class="comment-item">Chưa có bình luận nào.</p>'}
          </div>
          <textarea class="form-control mb-3" rows="3" placeholder="Viết bình luận..."></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
          <button class="btn btn-primary comment-submit">Gửi</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  $(modal).modal('show');
  gsap.from(modal.querySelector('.modal-dialog'), { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out' });

  modal.querySelector('.comment-submit').addEventListener('click', () => {
    const commentText = modal.querySelector('textarea').value.trim();
    if (commentText) {
      post.comments++;
      const userName = 'Nguyễn Quốc Duy'; // Simulated logged-in user
      const newComment = `<strong>${userName}:</strong> ${commentText}`;
      post.commentList.push(newComment);
      postData[postId] = post;
      localStorage.setItem('postData', JSON.stringify(postData));

      const commentSection = document.querySelector(`.comments[data-post-id="${postId}"]`);
      const newCommentElement = document.createElement('p');
      newCommentElement.className = 'comment-item';
      newCommentElement.innerHTML = newComment;
      commentSection.appendChild(newCommentElement);
      gsap.from(newCommentElement, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });

      this.querySelector('.comment-count').textContent = post.comments;
      gsap.fromTo(this.querySelector('.comment-count'), { scale: 1 }, { scale: 1.5, duration: 0.3, ease: 'power2.out', onComplete: () => gsap.to(this.querySelector('.comment-count'), { scale: 1, duration: 0.3 }) });

      modal.querySelector('textarea').value = '';
      $(modal).modal('hide');
      addNotification('Bạn đã bình luận trên một bài đăng!');
    } else {
      alert('Vui lòng nhập nội dung bình luận!');
    }
  });

  $(modal).on('hidden.bs.modal', () => modal.remove());
}

function handleShare() {
  const postId = this.getAttribute('data-post-id');
  let post = postData[postId];
  const shareUrl = `https://techibot.com/post/${postId}`;
  
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content bg-white">
        <div class="modal-header">
          <h5 class="modal-title text-primary">Chia Sẻ Bài Đăng</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <p>Chia sẻ bài đăng này lên:</p>
          <div class="share-options d-flex flex-column gap-3">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" class="btn btn-primary share-option">Chia sẻ lên Facebook</a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Xem bài đăng này trên TechiBot!" target="_blank" class="btn btn-info share-option">Chia sẻ lên Twitter</a>
            <button class="btn btn-secondary share-option copy-link" data-url="${shareUrl}">Sao chép liên kết</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  $(modal).modal('show');
  gsap.from(modal.querySelector('.modal-dialog'), { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out' });

  modal.querySelector('.copy-link').addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Đã sao chép liên kết!');
      post.shares++;
      document.querySelector(`.share-btn[data-post-id="${postId}"] .share-count`).textContent = post.shares;
      postData[postId] = post;
      localStorage.setItem('postData', JSON.stringify(postData));
      addNotification('Bạn đã sao chép liên kết bài đăng!');
      $(modal).modal('hide');
    });
  });

  modal.querySelectorAll('.share-option:not(.copy-link)').forEach(link => {
    link.addEventListener('click', () => {
      post.shares++;
      document.querySelector(`.share-btn[data-post-id="${postId}"] .share-count`).textContent = post.shares;
      gsap.fromTo(document.querySelector(`.share-btn[data-post-id="${postId}"] .share-count`), { scale: 1 }, { scale: 1.5, duration: 0.3, ease: 'power2.out', onComplete: () => gsap.to(document.querySelector(`.share-btn[data-post-id="${postId}"] .share-count`), { scale: 1, duration: 0.3 }) });
      postData[postId] = post;
      localStorage.setItem('postData', JSON.stringify(postData));
      addNotification('Bạn đã chia sẻ một bài đăng!');
    });
  });

  $(modal).on('hidden.bs.modal', () => modal.remove());
}

function handleEditPost(e) {
  e.preventDefault();
  const postId = this.getAttribute('data-post-id');
  const postElement = document.querySelector(`.post-card[data-post-id="${postId}"]`);
  const currentContent = postElement.querySelector('.post-content').innerHTML;

  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content bg-white">
        <div class="modal-header">
          <h5 class="modal-title text-primary">Chỉnh Sửa Bài Đăng</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div id="edit-post-editor" style="min-height: 150px;"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
          <button class="btn btn-primary edit-submit">Lưu</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const quill = new Quill('#edit-post-editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        ['link'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
      ]
    },
    placeholder: 'Chỉnh sửa bài đăng của bạn...'
  });
  quill.root.innerHTML = currentContent;

  $(modal).modal('show');
  gsap.from(modal.querySelector('.modal-dialog'), { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out' });

  modal.querySelector('.edit-submit').addEventListener('click', () => {
    const newContent = quill.root.innerHTML;
    if (newContent && newContent !== '<p><br></p>') {
      postElement.querySelector('.post-content').innerHTML = newContent;
      gsap.from(postElement.querySelector('.post-content'), { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
      $(modal).modal('hide');
      modal.remove();
      addNotification('Bạn đã chỉnh sửa một bài đăng!');
    } else {
      alert('Vui lòng nhập nội dung!');
    }
  });

  $(modal).on('hidden.bs.modal', () => modal.remove());
}

function handleDeletePost(e) {
  e.preventDefault();
  const postId = this.getAttribute('data-post-id');
  const postElement = document.querySelector(`.post-card[data-post-id="${postId}"]`);
  if (confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) {
    gsap.to(postElement, { opacity: 0, height: 0, margin: 0, padding: 0, duration: 0.5, ease: 'power2.out', onComplete: () => {
      postElement.remove();
      delete postData[postId];
      localStorage.setItem('postData', JSON.stringify(postData));
      addNotification('Bạn đã xóa một bài đăng!');
    }});
  }
}

function savePost(content, imageUrl) {
  const newPostId = Date.now().toString();
  const newPost = {
    id: newPostId,
    avatar: 'images/avt4.jpg',
    author: 'Nguyễn Quốc Duy',
    date: new Date().toISOString().slice(0, 10),
    content,
    image: imageUrl,
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false,
    commentList: []
  };
  postData[newPostId] = {
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false,
    commentList: []
  };
  localStorage.setItem('postData', JSON.stringify(postData));

  const container = document.getElementById('personal-posts-container');
  const postElement = document.createElement('div');
  postElement.className = 'post-card mb-4 reveal';
  postElement.setAttribute('data-post-id', newPostId);
  postElement.innerHTML = `
    <div class="post-header d-flex align-items-center">
      <div class="dropdown ml-2">
        <button class="btn btn-link text-muted p-0" data-bs-toggle="dropdown">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item edit-post" href="#" data-post-id="${newPostId}">Chỉnh Sửa</a>
          <a class="dropdown-item delete-post" href="#" data-post-id="${newPostId}">Xóa</a>
        </div>
      </div>
      <img src="${newPost.avatar}" alt="Avatar" class="post-avatar ml-3">
      <div class="ml-3 flex-grow-1">
        <h5 class="mb-0 text-primary">${newPost.author}</h5>
        <small class="text-muted">${newPost.date}</small>
      </div>
    </div>
    <div class="post-content mt-2">${newPost.content}</div>
    ${newPost.image ? `<img src="${newPost.image}" alt="Post Image" class="post-image w-100 mb-3">` : ''}
    <div class="post-actions d-flex justify-content-between">
      <button class="btn btn-outline-primary btn-sm like-btn" data-post-id="${newPostId}">Thích <span class="like-count">0</span></button>
      <button class="btn btn-outline-primary btn-sm comment-btn" data-post-id="${newPostId}">Bình Luận <span class="comment-count">0</span></button>
      <button class="btn btn-outline-primary btn-sm share-btn" data-post-id="${newPostId}">Chia Sẻ <span class="share-count">0</span></button>
    </div>
    <div class="comments mt-3" data-post-id="${newPostId}"></div>
  `;
  container.insertBefore(postElement, container.firstChild);
  gsap.from(postElement, { opacity: 0, y: 50, duration: 0.6, ease: 'power2.out' });
  bindActionButtons();
}