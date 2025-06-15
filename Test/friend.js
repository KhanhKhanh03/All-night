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

// Recharge button animation and donation handling
document.getElementById('recharge-btn').addEventListener('click', function () {
  gsap.to(this, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });

  // Show donation input section
  const donateInput = document.getElementById('donate-input');
  donateInput.style.display = 'block';
  gsap.from(donateInput, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
});

// Confirm donation
document.getElementById('confirm-donate').addEventListener('click', function () {
  const donateAmount = parseInt(document.getElementById('donate-amount').value);
  const currentCoinsElement = document.getElementById('current-coins');
  let currentCoins = parseInt(currentCoinsElement.textContent);

  if (!donateAmount || donateAmount <= 0) {
    alert('Vui lòng nhập số xu hợp lệ!');
    return;
  }

  // Update coin count by adding the donated amount
  currentCoins += donateAmount;
  currentCoinsElement.textContent = currentCoins;

  // Hide donation input
  const donateInput = document.getElementById('donate-input');
  gsap.to(donateInput, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', onComplete: () => {
    donateInput.style.display = 'none';
    document.getElementById('donate-amount').value = ''; // Reset input
  }});

  // Show success message
  alert(`Bạn đã nhận thành công ${donateAmount} xu! Số xu hiện tại: ${currentCoins}`);
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