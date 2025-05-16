// Initialize post data
let postData = JSON.parse(localStorage.getItem('postData')) || {
  '1': { likes: 12, comments: 5, shares: 3, liked: false, commentList: ['Nguyễn Anh Kiệt: Đáp án là A!'] },
  '2': { likes: 8, comments: 2, shares: 1, liked: false, commentList: ['Mai Cam Thảo: Có khó thật!'] },
  '3': { likes: 15, comments: 7, shares: 4, liked: false, commentList: ['Nguyễn Đăng Khôi: Chúc mừng!'] },
  '4': { likes: 10, comments: 3, shares: 2, liked: false, commentList: ['Jenifer Phạm: Tôi có thể giúp!'] }
};
localStorage.setItem('postData', JSON.stringify(postData));

// Simulated additional posts
const additionalPosts = {
  global: [
    { id: 5, avatar: 'images/avt6.jpg', author: 'Nguyễn Đăng Khôi', date: '2025-05-11', content: 'Hôm nay mình học được cách sử dụng HTML!', image: 'images/pic2.jpg', likes: 5, comments: 1, shares: 0, liked: false, commentList: ['Huỳnh Nguyên Khánh: Tuyệt vời!'] },
    { id: 6, avatar: 'images/avt8.jpg', author: 'Mai Cam Thảo', date: '2025-05-12', content: 'Ai biết cách làm bài tập này không?', image: 'images/de3.png', likes: 3, comments: 0, shares: 0, liked: false, commentList: [] },
    { id: 7, avatar: 'images/avt9.jpg', author: 'Kim Anh Nguyễn Cửu', date: '2025-05-13', content: 'Mình vừa học xong CSS!', image: 'images/pic3.jpg', likes: 7, comments: 2, shares: 1, liked: false, commentList: ['Nguyễn Quốc Duy: Đẹp lắm!'] },
    { id: 8, avatar: 'images/avt10.jpg', author: 'Jenifer Phạm', date: '2025-05-14', content: 'Python thật thú vị!', image: '', likes: 4, comments: 1, shares: 0, liked: false, commentList: ['Nguyễn Anh Kiệt: Đồng ý!'] }
  ],
  personal: [
    { id: 5, avatar: 'images/avt4.jpg', author: 'Nguyễn Quốc Duy', date: '2025-05-06', content: 'Học CSS thật thú vị!', image: 'images/pic3.jpg', likes: 9, comments: 2, shares: 1, liked: false, commentList: ['Mai Cam Thảo: Đẹp quá!'] },
    { id: 6, avatar: 'images/avt4.jpg', author: 'Nguyễn Quốc Duy', date: '2025-05-05', content: 'Mình đang tìm tài liệu học JavaScript!', image: '', likes: 6, comments: 1, shares: 0, liked: false, commentList: ['Nguyễn Đăng Khôi: Có thể thử W3Schools!'] },
    { id: 7, avatar: 'images/avt4.jpg', author: 'Nguyễn Quốc Duy', date: '2025-05-04', content: 'Hôm nay học React.js!', image: 'images/pic4.png', likes: 8, comments: 3, shares: 2, liked: false, commentList: ['Jenifer Phạm: Hay lắm!', 'Huỳnh Nguyên Khánh: Cố lên!'] },
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
    console.log('Creating post modal'); // Debug log
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
    try {
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
      console.log('Quill editor initialized'); // Debug log
    } catch (error) {
      console.error('Quill initialization failed:', error);
    }

    // Show modal with Bootstrap
    try {
      $(modal).modal('show');
      gsap.from(modal.querySelector('.modal-dialog'), { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out' });
      console.log('Modal shown'); // Debug log
    } catch (error) {
      console.error('Modal show failed:', error);
    }

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
      console.log('Modal hidden'); // Debug log
      modal.remove();
    });
  }

  // Bind create post modal to both buttons
  document.querySelectorAll('.create-post, #create-post-btn').forEach(btn => {
    console.log('Binding click event to button:', btn); // Debug log
    btn.addEventListener('click', () => {
      console.log('Button clicked:', btn); // Debug log
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
          <div class="comment-list mb-3" style="max-height: 200px; overflow-y: auto;">
            ${post.commentList.length > 0 ? post.commentList.map(comment => `<p>${comment}</p>`).join('') : '<p>Chưa có bình luận nào.</p>'}
          </div>
          <textarea class="form-control mb-3" rows="2" placeholder="Viết bình luận..."></textarea>
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
      const userName = 'Huỳnh Nguyên Khánh';
      const newComment = `<strong>${userName}:</strong> ${commentText}`;
      post.commentList.push(newComment);
      postData[postId] = post;
      localStorage.setItem('postData', JSON.stringify(postData));

      const commentSection = document.querySelector(`.comments[data-post-id="${postId}"]`);
      const newCommentElement = document.createElement('p');
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
  if (navigator.share) {
    navigator.share({
      title: 'Chia sẻ bài đăng từ TechiBot',
      text: 'Xem bài đăng này trên TechiBot!',
      url: shareUrl
    }).then(() => {
      post.shares++;
      this.querySelector('.share-count').textContent = post.shares;
      gsap.fromTo(this.querySelector('.share-count'), { scale: 1 }, { scale: 1.5, duration: 0.3, ease: 'power2.out', onComplete: () => gsap.to(this.querySelector('.share-count'), { scale: 1, duration: 0.3 }) });
      postData[postId] = post;
      localStorage.setItem('postData', JSON.stringify(postData));
      addNotification('Bạn đã chia sẻ một bài đăng!');
    }).catch(err => console.error('Error sharing:', err));
  } else {
    prompt('Chia sẻ bài đăng qua link:', shareUrl);
    post.shares++;
    this.querySelector('.share-count').textContent = post.shares;
    gsap.fromTo(this.querySelector('.share-count'), { scale: 1 }, { scale: 1.5, duration: 0.3, ease: 'power2.out', onComplete: () => gsap.to(this.querySelector('.share-count'), { scale: 1, duration: 0.3 }) });
    postData[postId] = post;
    localStorage.setItem('postData', JSON.stringify(postData));
    addNotification('Bạn đã chia sẻ một bài đăng!');
  }
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
    author: 'Huỳnh Nguyên Khánh',
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