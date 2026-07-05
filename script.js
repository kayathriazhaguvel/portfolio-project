'use strict';

/* ===== DOM Elements ===== */
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');
const yearEl = document.getElementById('year');
const skillBars = document.querySelectorAll('.skill-bar__fill');

/* ===== Set Current Year ===== */
yearEl.textContent = new Date().getFullYear();

/* ===== Mobile Navigation Toggle ===== */
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  const isOpen = navMenu.classList.contains('active');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ===== Header Scroll Effect ===== */
function handleHeaderScroll() {
  if (window.scrollY > 50) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll);
handleHeaderScroll();

/* ===== Active Nav Link on Scroll ===== */
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightNavLink);

/* ===== Scroll to Top Button ===== */
function toggleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', toggleScrollTop);

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== Scroll Reveal Animation ===== */
const revealElements = document.querySelectorAll(
  '.section__header, .about__grid, .skill-card, .skill-bar, .project-card, .contact__grid'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

/* ===== Skill Bar Animation ===== */
const skillBarObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.setProperty('--fill-width', `${width}%`);
        fill.classList.add('animated');
        skillBarObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.5 }
);

skillBars.forEach(bar => skillBarObserver.observe(bar));

/* ===== Contact Form Validation ===== */
const formFields = {
  name: {
    el: document.getElementById('name'),
    error: document.getElementById('name-error'),
    validate: value => value.trim().length >= 2 || 'Name must be at least 2 characters'
  },
  email: {
    el: document.getElementById('email'),
    error: document.getElementById('email-error'),
    validate: value => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value.trim()) || 'Please enter a valid email address';
    }
  },
  subject: {
    el: document.getElementById('subject'),
    error: document.getElementById('subject-error'),
    validate: value => value.trim().length >= 3 || 'Subject must be at least 3 characters'
  },
  message: {
    el: document.getElementById('message'),
    error: document.getElementById('message-error'),
    validate: value => value.trim().length >= 10 || 'Message must be at least 10 characters'
  }
};

function validateField(field) {
  const result = field.validate(field.el.value);
  const isValid = result === true;

  field.el.classList.toggle('error', !isValid);
  field.error.textContent = isValid ? '' : result;

  return isValid;
}

Object.values(formFields).forEach(field => {
  field.el.addEventListener('blur', () => validateField(field));
  field.el.addEventListener('input', () => {
    if (field.el.classList.contains('error')) {
      validateField(field);
    }
  });
});

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const formSuccess = document.getElementById('form-success');
  formSuccess.hidden = true;

  const allValid = Object.values(formFields).every(field => validateField(field));

  if (allValid) {
    formSuccess.hidden = false;
    contactForm.reset();
    Object.values(formFields).forEach(field => {
      field.el.classList.remove('error');
      field.error.textContent = '';
    });

    setTimeout(() => {
      formSuccess.hidden = true;
    }, 5000);
  }
});

/* ===== Smooth Scroll for Anchor Links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
