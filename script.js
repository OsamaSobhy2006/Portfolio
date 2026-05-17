(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const ROLES = [
    'Software Engineer',
    'MEAN Stack Developer',
    'Full-Stack Developer',
    'Angular Developer',
    'Problem Solver'
  ];

  /* ===== Loader ===== */
  function initLoader() {
    document.body.classList.add('loading');
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loader = $('#loader');
        if (loader) loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 2000);
    });
  }

  /* ===== Theme ===== */
  function initTheme() {
    const toggle = $('#themeToggle');
    const saved = localStorage.getItem('portfolio-theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = saved || (prefersLight ? 'light' : 'dark');
    setTheme(theme);

    toggle?.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      setTheme(next);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    const icon = $('#themeToggle i');
    if (icon) {
      icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  /* ===== Mobile Nav ===== */
  function initNav() {
    const toggle = $('#navToggle');
    const menu = $('#navMenu');
    const links = $$('.nav__link', menu);

    toggle?.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle?.classList.remove('active');
        toggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ===== Header scroll ===== */
  function initHeader() {
    const header = $('#header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== Active nav links ===== */
  function initActiveNav() {
    const sections = $$('section[id]');
    const links = $$('.nav__link');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            links.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ===== Smooth scroll ===== */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ===== Typing effect ===== */
  function initTyping() {
    const el = $('#typingText');
    if (!el) return;

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = ROLES[roleIndex];
      if (!deleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 2000);
          return;
        }
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % ROLES.length;
        }
      }
      setTimeout(tick, deleting ? 40 : 80);
    }

    tick();
  }

  /* ===== Scroll reveal ===== */
  function initReveal() {
    const reveals = $$('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  /* ===== Counter stats ===== */
  function initCounters() {
    const counters = $$('.stat-card__number');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  /* ===== Skill circles & bars ===== */
  function initSkills() {
    const items = $$('.skill-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target;
          const percent = parseInt(item.dataset.percent, 10) || 0;
          item.style.setProperty('--percent', percent);
          item.classList.add('animated');
          observer.unobserve(item);
        });
      },
      { threshold: 0.3 }
    );
    items.forEach((item) => observer.observe(item));
  }

  /* ===== Project filter ===== */
  function initProjectFilter() {
    const buttons = $$('.filter-btn');
    const cards = $$('.project-card');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        cards.forEach((card) => {
          const cats = (card.dataset.category || '').split(' ');
          const show = filter === 'all' || cats.includes(filter);
          card.classList.toggle('hidden', !show);
          if (show) {
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = '';
          }
        });
      });
    });
  }

  /* ===== Contact form ===== */
  function initForm() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const btn = $('.btn--submit', form);
      btn?.classList.add('loading');

      setTimeout(() => {
        btn?.classList.remove('loading');
        const success = $('#formSuccess');
        if (success) {
          success.hidden = false;
          setTimeout(() => { success.hidden = true; }, 5000);
        }
        form.reset();
      }, 1500);
    });

    $$('#contactForm input, #contactForm textarea').forEach((field) => {
      field.addEventListener('input', () => clearFieldError(field));
    });
  }

  function validateForm() {
    let valid = true;
    const name = $('#name');
    const email = $('#email');
    const message = $('#message');

    if (!name?.value.trim()) {
      setFieldError(name, 'nameError', 'Name is required');
      valid = false;
    }
    if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setFieldError(email, 'emailError', 'Valid email is required');
      valid = false;
    }
    if (!message?.value.trim() || message.value.trim().length < 10) {
      setFieldError(message, 'messageError', 'Message must be at least 10 characters');
      valid = false;
    }
    return valid;
  }

  function setFieldError(field, errorId, msg) {
    field?.classList.add('error');
    const err = $(`#${errorId}`);
    if (err) err.textContent = msg;
  }

  function clearFieldError(field) {
    field.classList.remove('error');
    const id = field.id;
    const err = $(`#${id}Error`);
    if (err) err.textContent = '';
  }

  /* ===== Back to top ===== */
  function initBackToTop() {
    const btn = $('#backToTop');
    window.addEventListener('scroll', () => {
      btn?.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Particles ===== */
  function initParticles() {
    const container = $('#particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 15}s`;
      p.style.animationDuration = `${12 + Math.random() * 10}s`;
      container.appendChild(p);
    }
  }

  /* ===== Custom cursor ===== */
  function initCursor() {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cursor = $('#cursor');
    const follower = $('#cursorFollower');
    if (!cursor || !follower) return;

    document.body.classList.add('custom-cursor');
    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
    });

    function animateFollower() {
      fx += (mx - fx) * 0.15;
      fy += (my - fy) * 0.15;
      follower.style.left = `${fx}px`;
      follower.style.top = `${fy}px`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    $$('a, button, .project-card, .service-card').forEach((el) => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
  }

  /* ===== Footer year ===== */
  function initYear() {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ===== Init ===== */
  function init() {
    initLoader();
    initTheme();
    initNav();
    initHeader();
    initActiveNav();
    initSmoothScroll();
    initTyping();
    initReveal();
    initCounters();
    initSkills();
    initProjectFilter();
    initForm();
    initBackToTop();
    initParticles();
    initCursor();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
