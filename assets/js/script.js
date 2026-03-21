/* ============================================================
   SABORES DA DORI — JavaScript v2
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Custom Cursor ---------- */
  const cursor     = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  if (cursor && cursorRing) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorRing.style.opacity = '0.5';
    });
  }

  /* ---------- Nav Scroll State ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Active Nav Link ---------- */
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isHome = (href === 'index.html' || href === './') &&
                   (path.endsWith('/') || path.endsWith('index.html') || path === '/');
    const isMatch = href && !href.startsWith('#') && path.endsWith(href);
    if (isHome || isMatch) link.classList.add('active');
  });

  /* ---------- Mobile Menu ---------- */
  const hamburger  = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(l => {
      l.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-up');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -56px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ---------- Testimonials Drag Scroll ---------- */
  const slider = document.querySelector('.testimonials-wrap');
  if (slider) {
    let isDown = false, startX, scrollLeft;
    slider.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.userSelect = 'none';
    });
    ['mouseleave', 'mouseup'].forEach(ev => slider.addEventListener(ev, () => { isDown = false; }));
    slider.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      slider.scrollLeft = scrollLeft - (x - startX) * 1.8;
    });
    slider.addEventListener('mouseup', () => { slider.style.userSelect = ''; });
  }

  /* ---------- Contact Form (Web3Forms) ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn       = form.querySelector('[type="submit"]');
      const successEl = document.getElementById('formSuccess');
      const errorEl   = document.getElementById('formError');

      btn.disabled    = true;
      btn.textContent = 'Enviando...';
      if (successEl) successEl.classList.remove('show');
      if (errorEl)   errorEl.classList.remove('show');

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body:   new FormData(form),
        });
        const data = await res.json();

        if (data.success) {
          form.reset();
          if (successEl) {
            successEl.classList.add('show');
            setTimeout(() => successEl.classList.remove('show'), 7000);
          }
        } else {
          throw new Error(data.message || 'Falha no envio');
        }
      } catch (_err) {
        if (errorEl) {
          errorEl.classList.add('show');
          setTimeout(() => errorEl.classList.remove('show'), 7000);
        }
      } finally {
        btn.disabled    = false;
        btn.textContent = 'Enviar mensagem';
      }
    });
  }

  /* ---------- Smooth Anchor Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset - 16, behavior: 'smooth' });
    });
  });

  /* ---------- Lucide Icons ---------- */
  function initLucide() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  // Run after all scripts — the inline script at page bottom is the primary trigger,
  // but also guard here for pages that include script.js before Lucide loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLucide);
  } else {
    initLucide();
  }

  /* ---------- Parallax Hero Panel ---------- */
  const heroPanelImg = document.querySelector('.hero__panel-image');
  if (heroPanelImg && window.innerWidth > 1024) {
    const parallaxEl = heroPanelImg.querySelector('.hero__img-frame');
    if (parallaxEl) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        parallaxEl.style.transform = `translateY(${y * 0.08}px)`;
      }, { passive: true });
    }
  }

})();
