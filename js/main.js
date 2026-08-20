// ---------- mobile nav ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.textContent = '☰';
    });
  });
}

// ---------- hero slider (home page) ----------
(function heroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const progress = document.querySelector('.hero-progress');
  if (!slides.length) return;

  let current = 0;
  let timer = null;
  const DURATION = 6000;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(index) {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    if (progress) progress.textContent = `0${index + 1} — 0${slides.length}`;
    current = index;
  }

  function next() {
    show((current + 1) % slides.length);
  }

  function startAuto() {
    if (prefersReduced) return;
    stopAuto();
    timer = setInterval(next, DURATION);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      startAuto();
    });
  });

  show(0);
  startAuto();
})();

// ---------- work page filter ----------
(function workFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();

// ---------- contact form (opens WhatsApp with prefilled message) ----------
(function contactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

   form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const projectType = form['project-type'].value.trim();
    const timeline = form.timeline.value.trim();
    const budget = form.budget.value.trim();
    const message = form.message.value.trim();

    let text = `New project inquiry from *${name}*\n\nEmail: ${email}\nProject type: ${projectType}`;
    if (timeline) text += `\nTimeline: ${timeline}`;
    if (budget) text += `\nBudget: ${budget}`;
    text += `\n\n${message}`;

    const whatsappUrl = `https://wa.me/923102264983?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, '_blank');
  });
})();

// ---------- scroll motion (elements continuously track scroll position — move + fade as you scroll, like the reference video) ----------
(function scrollMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

 const selectors = [
    '.section-head', '.lede', '.stat-row', '.preview-card',
    '.cta-banner h2', '.cta-banner p',
    '.about-portrait', '.about-lede', '.about-body p', '.skill-tags span',
    '.timeline-item', '.mini-list li',
    '.filter-bar', '.work-card', '.note-card',
    '.contact-list li', '.form-field'
  ];

  const els = document.querySelectorAll(selectors.join(','));
  if (!els.length) return;

  if (prefersReduced) {
    els.forEach(el => { el.style.opacity = 1; });
    return;
  }

  // build a stable per-element amplitude + direction so motion feels varied, not robotic
  const items = Array.from(els).map((el, i) => ({
    el,
    amp: 56 + (i % 5) * 14,
    sideways: el.classList.contains('about-portrait') ? -1 : 0
  }));

  let ticking = false;

  function update() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    items.forEach(({ el, amp, sideways }) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) { return; } // skip far-offscreen for perf
      const center = r.top + r.height / 2;
      const progress = (center - vh / 2) / (vh * 0.7); // -1 = above center, +1 = below center
      const clamped = Math.max(-1, Math.min(1, progress));
      const translateY = clamped * amp;
      const translateX = sideways ? clamped * amp * 0.6 : 0;
      const opacity = 1 - Math.min(1, Math.abs(clamped) * 0.95);
      const scale = 1 - Math.min(1, Math.abs(clamped)) * 0.05;
      el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      el.style.opacity = Math.max(0, opacity);
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// ---------- work image lightbox (click to view, prev/next to browse, X to close) ----------
(function workLightbox() {
  const grid = document.querySelector('.work-grid');
  if (!grid) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML =
    '<button class="lightbox-close" aria-label="Close">✕</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous image">‹</button>' +
    '<img class="lightbox-img" src="" alt="">' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next image">›</button>';
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentList = [];
  let currentIndex = 0;

  function visibleImages() {
    // only images from cards that aren't hidden by the current filter
    return Array.from(grid.querySelectorAll('.work-card')).filter(card => card.style.display !== 'none').map(card => card.querySelector('.work-thumb img')).filter(Boolean);
  }

  function showAt(index) {
    if (!currentList.length) return;
    currentIndex = (index + currentList.length) % currentList.length;
    const img = currentList[currentIndex];
    lightboxImg.src = img.getAttribute('src');
    lightboxImg.alt = img.getAttribute('alt') || '';
  }

  function openLightbox(img) {
    currentList = visibleImages();
    const startIndex = currentList.indexOf(img);
    showAt(startIndex === -1 ? 0 : startIndex);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  grid.addEventListener('click', (e) => {
    const img = e.target.closest('.work-thumb img');
    if (!img) return;
    openLightbox(img);
  });

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showAt(currentIndex - 1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showAt(currentIndex + 1); });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showAt(currentIndex + 1);
    if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
  });
})();
// ---------- apply work filter from URL (?filter=logos etc.) ----------
(function applyFilterFromURL() {
  const params = new URLSearchParams(window.location.search);
  const filter = params.get('filter');
  if (!filter) return;
  const btn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
  if (btn) btn.click();
})();
