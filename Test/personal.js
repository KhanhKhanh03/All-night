// Edit profile button
document.getElementById('edit-profile').addEventListener('click', function () {
  document.getElementById('personal-info').style.display = 'none';
  document.getElementById('edit-form').style.display = 'block';
  document.getElementById('edit-profile').style.display = 'none';
  document.getElementById('edit-buttons').style.display = 'block';
});

// Cancel edit
document.getElementById('cancel-edit').addEventListener('click', function () {
  document.getElementById('edit-form').style.display = 'none';
  document.getElementById('personal-info').style.display = 'block';
  document.getElementById('edit-profile').style.display = 'block';
  document.getElementById('edit-buttons').style.display = 'none';
});

// Save edit (placeholder)
document.getElementById('save-edit').addEventListener('click', function () {
  const name = document.getElementById('edit-name').value;
  const bio = document.getElementById('edit-bio').value;
  const dob = document.getElementById('edit-dob').value;
  const status = document.getElementById('edit-status').value;
  const hobbies = document.getElementById('edit-hobbies').value;
  const address = document.getElementById('edit-address').value;
  alert(`Đã lưu:\nHọ Tên: ${name}\nTiểu Sử: ${bio}\nNgày Sinh: ${dob}\nTrạng Thái: ${status}\nSở Thích: ${hobbies}\nĐịa Chỉ: ${address}\n(Chức năng lưu sẽ được triển khai sau)`);
  document.getElementById('edit-form').style.display = 'none';
  document.getElementById('personal-info').style.display = 'block';
  document.getElementById('edit-profile').style.display = 'block';
  document.getElementById('edit-buttons').style.display = 'none';
});

// Carousel navigation for friends
let friendIndex = 0;
const friendItems = document.querySelectorAll('#friend-carousel .carousel-item');
document.getElementById('prev-friend').addEventListener('click', function () {
  gsap.to(friendItems[friendIndex], { x: 100, opacity: 0, duration: 0.5, ease: 'power2.out' });
  friendItems[friendIndex].classList.remove('active');
  friendIndex = (friendIndex > 0) ? friendIndex - 1 : friendItems.length - 1;
  friendItems[friendIndex].classList.add('active');
  gsap.fromTo(friendItems[friendIndex], { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
});
document.getElementById('next-friend').addEventListener('click', function () {
  gsap.to(friendItems[friendIndex], { x: -100, opacity: 0, duration: 0.5, ease: 'power2.out' });
  friendItems[friendIndex].classList.remove('active');
  friendIndex = (friendIndex < friendItems.length - 1) ? friendIndex + 1 : 0;
  friendItems[friendIndex].classList.add('active');
  gsap.fromTo(friendItems[friendIndex], { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
});

// Carousel navigation for courses
document.getElementById('next-course').addEventListener('click', function () {
  const courseItems = document.querySelectorAll('#course-carousel .course-item');
  document.getElementById('course-carousel').appendChild(courseItems[0]);
});
document.getElementById('prev-course').addEventListener('click', function () {
  const courseItems = document.querySelectorAll('#course-carousel .course-item');
  document.getElementById('course-carousel').prepend(courseItems[courseItems.length - 1]);
});

// Post redirection
document.querySelectorAll('.post').forEach(post => {
  post.addEventListener('click', function () {
    const url = this.getAttribute('data-url');
    if (url) {
      window.location.href = url;
    }
  });
});

// Dark mode toggle
document.getElementById('dark-mode-toggle').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
});

// Scroll-to-top button with animation
document.getElementById('scroll-top-btn').addEventListener('click', function () {
  gsap.fromTo(window, { scrollTo: { y: window.scrollY }, duration: 1, ease: 'power2.inOut' }, { scrollTo: { y: 0 }, duration: 1, ease: 'power2.inOut' });
});

// Scroll reveal and text animation
document.addEventListener('DOMContentLoaded', function () {
  const revealElements = document.querySelectorAll('.reveal');
  const animateTexts = document.querySelectorAll('.animate-text');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  // Initialize GSAP animations for text
  animateTexts.forEach((text, index) => {
    gsap.set(text, { opacity: 0, x: -50 });
    gsap.to(text, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: text.closest('.reveal'),
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Scroll reveal for sections
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

    // Show/hide scroll-to-top button
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check

  // Upgrade card hover animation
  const upgradeCards = document.querySelectorAll('.upgrade-card');
  upgradeCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.05, boxShadow: '0 8px 16px rgba(212, 175, 23, 0.5)', duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)', duration: 0.3, ease: 'power2.out' });
    });
  });

  // Subscribe button animation
  const subscribeButtons = document.querySelectorAll('.subscribe-btn');
  subscribeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      gsap.fromTo(btn, { scale: 1, rotate: 0 }, { scale: 1.1, rotate: 360, duration: 0.5, ease: 'bounce.out' });
    });
  });
});