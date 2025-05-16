// Recharge button animation and transaction handling
document.getElementById('recharge-btn').addEventListener('click', function () {
  gsap.to(this, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
  
  // Show payment details
  const paymentDetails = document.getElementById('payment-details');
  paymentDetails.style.display = 'block';
  gsap.from(paymentDetails, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
});

// Subscribe button animation and transaction handling
const subscribeButtons = document.querySelectorAll('.subscribe-btn');
subscribeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    gsap.fromTo(btn, { scale: 1, rotate: 0 }, { scale: 1.1, rotate: 360, duration: 0.5, ease: 'bounce.out' });
    const plan = btn.getAttribute('data-plan');
    const price = btn.getAttribute('data-price');
    let qrSrc;
    switch (plan) {
      case 'weekly':
        qrSrc = 'images/QR2.png';
        break;
      case 'monthly':
        qrSrc = 'images/QR3.png';
        break;
      case 'yearly':
        qrSrc = 'images/QR4.png';
        break;
    }

    // Show payment details and QR code for the selected plan
    const paymentDetails = document.getElementById('upgrade-payment-details');
    const qrCode = document.getElementById('upgrade-qr-code');
    const upgradeAmount = document.getElementById('upgrade-amount');
    qrCode.src = qrSrc;
    upgradeAmount.textContent = `Số Tiền Gửi: ${price}`;
    paymentDetails.style.display = 'block';
    gsap.from(paymentDetails, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
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
  revealOnScroll();

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
});