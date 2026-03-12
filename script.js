/* ========================================
   SANDHAN VALLEY TREK - INTERACTIVE SCRIPTS
======================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  initScrollAnimations();
  initHeaderScroll();
  initSmoothScroll();
  initMobileMenu();
  initDynamicBooking();
  initTestimonialSlider();
  initDarkMode();
});

/* ========================================
   SCROLL ANIMATIONS
======================================== */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in classes
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  animatedElements.forEach(el => observer.observe(el));
}

/* ========================================
   HEADER SCROLL EFFECT
======================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/* ========================================
   SMOOTH SCROLL NAVIGATION
======================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileMenu = document.querySelector('.nav-links');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if (menuBtn) {
            menuBtn.classList.remove('active');
          }
        }
      }
    });
  });
}

/* ========================================
   MOBILE MENU TOGGLE
======================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuBtn.classList.toggle('active');
    });
  }
}

/* ========================================
   FAQ ACCORDION
======================================== */
function toggleFaq(button) {
  const faqItem = button.parentElement;
  const isActive = faqItem.classList.contains('active');

  // Close all other FAQs
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });

  // Toggle current FAQ
  if (!isActive) {
    faqItem.classList.add('active');
  }
}

/* ========================================
   COPY BOOKING TEXT
======================================== */
function copyBookingText() {
  const bookingText = document.getElementById('bookingText').textContent;
  const copyBtn = document.getElementById('copyBtn');
  const copyBtnText = document.getElementById('copyBtnText');

  // Try using the modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(bookingText).then(() => {
      showCopySuccess(copyBtn, copyBtnText);
    }).catch(() => {
      fallbackCopy(bookingText, copyBtn, copyBtnText);
    });
  } else {
    fallbackCopy(bookingText, copyBtn, copyBtnText);
  }
}

function fallbackCopy(text, copyBtn, copyBtnText) {
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    showCopySuccess(copyBtn, copyBtnText);
  } catch (err) {
    console.error('Failed to copy text:', err);
  }

  document.body.removeChild(textArea);
}

function showCopySuccess(copyBtn, copyBtnText) {
  copyBtn.classList.add('copied');
  copyBtnText.textContent = 'Copied!';

  setTimeout(() => {
    copyBtn.classList.remove('copied');
    copyBtnText.textContent = 'Copy';
  }, 2000);
}

/* ========================================
   OPTIONAL: PARALLAX EFFECT FOR HERO
======================================== */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');

  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
    });
  }
}

/* ========================================
   OPTIONAL: LOADING ANIMATION
======================================== */
window.addEventListener('load', function () {
  // Add a loaded class to body after everything is loaded
  document.body.classList.add('loaded');

  // Initialize parallax after load
  initParallax();
});

/* ========================================
   DYNAMIC BOOKING LOGIC
======================================== */
function initDynamicBooking() {
  const dateSelect = document.getElementById('batchDate');
  const waBtn = document.getElementById('waBookingBtn');

  if (dateSelect && waBtn) {
    // Base WhatsApp URL and Number
    const waNumber = '919653217634';
    const baseText = 'Hi! I want to book the Sandhan Valley Weekend Trek for ';

    // Function to update the link
    const updateLink = () => {
      const selectedDate = dateSelect.value;
      const fullText = encodeURIComponent(baseText + selectedDate + '. Please share the details.');
      waBtn.href = `https://wa.me/${waNumber}?text=${fullText}`;
    };

    // Initial setup
    updateLink();

    // Listen for changes
    dateSelect.addEventListener('change', updateLink);
  }
}

/* ========================================
   TESTIMONIAL AUTO-SLIDER
======================================== */
function initTestimonialSlider() {
  const slider = document.getElementById('testimonialSlider');
  if (!slider) return;

  let scrollPosition = 0;
  let isHovered = false;

  // Pause on hover
  slider.addEventListener('mouseenter', () => isHovered = true);
  slider.addEventListener('mouseleave', () => isHovered = false);

  setInterval(() => {
    if (isHovered) return;

    // Calculate width of one card + gap
    const cardWidth = slider.querySelector('.testimonial-card').offsetWidth;
    const gap = parseFloat(getComputedStyle(slider).gap) || 0;
    const step = cardWidth + gap;

    // Scroll right
    scrollPosition += step;

    // If we've reached the end, reset to start
    if (scrollPosition >= slider.scrollWidth - slider.clientWidth) {
      scrollPosition = 0;
    }

    slider.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }, 4000); // Change slides every 4 seconds
}

/* ========================================
   STARGAZING DARK MODE
======================================== */
function initDarkMode() {
  const themeToggle = document.getElementById('themeToggle');
  const iconSpan = themeToggle ? themeToggle.querySelector('.icon') : null;

  if (!themeToggle) return;

  // Check saved preference
  const isDarkMode = localStorage.getItem('stargazingMode') === 'enabled';

  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    if (iconSpan) iconSpan.textContent = '☀️'; // Show sun when in dark mode
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('stargazingMode', 'enabled');
      if (iconSpan) iconSpan.textContent = '☀️';
    } else {
      localStorage.setItem('stargazingMode', 'disabled');
      if (iconSpan) iconSpan.textContent = '🌙';
    }
  });
}

/* ========================================
   WHATSAPP TRACKING (Optional Analytics)
======================================== */
document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
  link.addEventListener('click', function () {
    // You can add analytics tracking here
    console.log('WhatsApp booking initiated');
  });
});

/* ========================================
   MOBILE STICKY CTA VISIBILITY
======================================== */
function initStickyCtaVisibility() {
  const stickyCta = document.querySelector('.sticky-cta');
  const hero = document.querySelector('.hero');

  if (stickyCta && hero) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyCta.style.transform = 'translateY(100%)';
        } else {
          stickyCta.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.3 });

    observer.observe(hero);
  }
}

// Initialize sticky CTA visibility on load
document.addEventListener('DOMContentLoaded', initStickyCtaVisibility);
