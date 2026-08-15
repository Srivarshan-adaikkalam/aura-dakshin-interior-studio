/* =============================================================
   AURA INTERIORS — main.js v3.0
   GSAP + Lenis + 3D Book Physics + Road Scrollytelling + Chrono
   ============================================================= */

'use strict';

/* ────────────────────────────────────────────────────────────
   GLOBAL STATE
──────────────────────────────────────────────────────────── */
const state = {
  mouseX: 0, mouseY: 0,
  currentYear: '2019',
  openBook: null,
  chronoDate: null,
  chronoTime: null,
  chronoViewYear: new Date().getFullYear(),
  chronoViewMonth: new Date().getMonth(),
};

/* ────────────────────────────────────────────────────────────
   WEB AUDIO ENGINE (subtle page-turn sounds)
──────────────────────────────────────────────────────────── */
let audioCtx = null;
function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playPageTurn() {
  if (!audioCtx) return;
  try {
    const dur = 0.25;
    const bufSize = audioCtx.sampleRate * dur;
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.12));
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const filt = audioCtx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 4000;
    filt.Q.value = 0.4;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.035;
    src.connect(filt); filt.connect(gain); gain.connect(audioCtx.destination);
    src.start();
  } catch(e) {}
}
function playClick() {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.08);
  } catch(e) {}
}

/* ────────────────────────────────────────────────────────────
   PRELOADER
──────────────────────────────────────────────────────────── */
function runPreloader() {
  const preloader = document.getElementById('preloader');
  const preBar = document.getElementById('pre-bar');
  let prog = 0;
  const interval = setInterval(() => {
    prog += Math.random() * 18 + 4;
    if (prog >= 100) {
      prog = 100;
      clearInterval(interval);
      preBar.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('gone');
        document.body.style.overflow = '';
        initHeroAnimations();
      }, 500);
    }
    preBar.style.width = prog + '%';
  }, 80);
}

/* ────────────────────────────────────────────────────────────
   LENIS SMOOTH SCROLL
──────────────────────────────────────────────────────────── */
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ────────────────────────────────────────────────────────────
   CUSTOM CURSOR
──────────────────────────────────────────────────────────── */
function initCursor() {
  const orbit = document.getElementById('c-orbit');
  const dot = document.getElementById('c-dot');
  let ox = 0, oy = 0;

  window.addEventListener('mousemove', (e) => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.05, ease: 'none' });
    gsap.to(orbit, { x: e.clientX, y: e.clientY, duration: 0.45, ease: 'power3.out' });
  });

  // Magnetic hover targets
  document.querySelectorAll('.mag').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });

  window.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  window.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
}

/* ────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
──────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-prog');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      bar.style.width = (self.progress * 100) + '%';
    }
  });
}

/* ────────────────────────────────────────────────────────────
   NAVBAR — scroll-based glass effect + active section
──────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 80,
    onEnter: () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
  });
  navLinks.querySelectorAll('.nl').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ────────────────────────────────────────────────────────────
   AMBIENT PARTICLE CANVAS
──────────────────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  const N = 80;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.5 + 0.1,
      gold: Math.random() > 0.7,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201,169,110,${p.alpha})`
        : `rgba(240,232,216,${p.alpha * 0.4})`;
      ctx.fill();

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw constellation lines to nearby particles
      for (let j = i + 1; j < N; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(201,169,110,${(1 - dist / 100) * 0.06})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ────────────────────────────────────────────────────────────
   HERO ENTRANCE ANIMATIONS
──────────────────────────────────────────────────────────── */
function initHeroAnimations() {
  // Stagger the h1 word lines
  gsap.fromTo('.h1l .h1w, .h1l .h1em', {
    y: '110%', opacity: 0,
  }, {
    y: '0%', opacity: 1,
    duration: 1.1, ease: 'power4.out',
    stagger: 0.12, delay: 0.1,
  });

  // Subtitle and CTAs
  gsap.fromTo('.hero-p, .hero-ctas', {
    opacity: 0, y: 24,
  }, {
    opacity: 1, y: 0,
    duration: 0.9, ease: 'power3.out',
    stagger: 0.15, delay: 0.5,
  });

  // Counter animations
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.to);
    gsap.fromTo(el, { innerText: 0 }, {
      innerText: target,
      duration: 2.5, delay: 0.8,
      ease: 'power2.out',
      snap: { innerText: 1 },
      onUpdate: function() {
        el.textContent = Math.round(parseFloat(el.textContent));
      }
    });
  });

  // Scroll-reveal for other cards
  initScrollReveal();
}

/* ────────────────────────────────────────────────────────────
   SCROLL REVEAL (for sections below hero)
──────────────────────────────────────────────────────────── */
function initScrollReveal() {
  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        el.classList.add('revealed');
      },
      once: true,
    });
  });
}

/* ────────────────────────────────────────────────────────────
   PILL BUTTON RIPPLE EFFECT
──────────────────────────────────────────────────────────── */
function initRipples() {
  document.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const wave = btn.querySelector('.pill-wave');
      if (!wave) return;
      wave.style.left = (e.offsetX - 4) + 'px';
      wave.style.top = (e.offsetY - 4) + 'px';
      wave.classList.remove('animating');
      requestAnimationFrame(() => wave.classList.add('animating'));
    });
  });
}

/* ────────────────────────────────────────────────────────────
   ROAD SVG + CAR SCROLLYTELLING
──────────────────────────────────────────────────────────── */
let roadPath, roadPathLen;
const waypointProgress = {
  '2019': 0.18,
  '2021': 0.42,
  '2023': 0.67,
  '2024': 0.88,
};
const yearThresholds = [
  { yr: '2019', start: 0,    end: 0.28 },
  { yr: '2021', start: 0.28, end: 0.52 },
  { yr: '2023', start: 0.52, end: 0.78 },
  { yr: '2024', start: 0.78, end: 1.01 },
];

function initRoad() {
  roadPath = document.getElementById('road-path');
  if (!roadPath) return;
  roadPathLen = roadPath.getTotalLength();

  const car = document.getElementById('journey-car');
  const jrnyScroll = document.getElementById('jrny-scroll');
  const jrnySticky = document.getElementById('jrny-sticky');
  const activeYrText = document.getElementById('ayr-text');

  // Initially position car at start
  positionCar(0);

  ScrollTrigger.create({
    trigger: jrnyScroll,
    start: 'top top',
    end: 'bottom bottom',
    pin: jrnySticky,
    pinSpacing: false,
    onUpdate: (self) => {
      const prog = self.progress;
      positionCar(prog);
      updateActiveYear(prog);
    },
  });
}

function positionCar(progress) {
  const car = document.getElementById('journey-car');
  if (!car || !roadPath || !roadPathLen) return;

  const targetLen = progress * roadPathLen;
  const pt = roadPath.getPointAtLength(targetLen);
  // Tangent: use 2 points close together
  const ptA = roadPath.getPointAtLength(Math.max(0, targetLen - 3));
  const ptB = roadPath.getPointAtLength(Math.min(roadPathLen, targetLen + 3));
  const angle = Math.atan2(ptB.y - ptA.y, ptB.x - ptA.x) * 180 / Math.PI;

  gsap.set(car, {
    attr: { transform: `translate(${pt.x}, ${pt.y}) rotate(${angle})` },
  });

  // Glow waypoints near car
  Object.entries(waypointProgress).forEach(([yr, wp]) => {
    const dist = Math.abs(progress - wp);
    const opBase = Math.max(0, 1 - dist * 12);
    const wp2019 = document.getElementById(`wp-${yr}`);
    if (wp2019) {
      wp2019.style.opacity = 0.35 + opBase * 0.65;
      wp2019.style.filter = opBase > 0.3 ? 'url(#wpGlow)' : '';
      const r = 7 + opBase * 8;
      wp2019.setAttribute('r', r);
    }
  });
}

function updateActiveYear(progress) {
  let yr = '2019';
  for (const t of yearThresholds) {
    if (progress >= t.start && progress < t.end) {
      yr = t.yr; break;
    }
  }
  if (yr !== state.currentYear) {
    transitionToYear(yr);
    state.currentYear = yr;
  }
}

function transitionToYear(yr) {
  const oldWorld = document.getElementById(`bw-${state.currentYear}`);
  const newWorld = document.getElementById(`bw-${yr}`);
  const yrText = document.getElementById('ayr-text');

  // Auto-close old book if open
  if (state.openBook === state.currentYear) {
    closeBook(state.currentYear, false);
  }

  if (oldWorld) {
    gsap.to(oldWorld, {
      opacity: 0, y: 30,
      duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        oldWorld.classList.remove('active');
        if (newWorld) {
          newWorld.classList.add('active');
          gsap.fromTo(newWorld, { opacity: 0, y: -30 }, {
            opacity: 1, y: 0,
            duration: 0.55, ease: 'power3.out',
          });
        }
      },
    });
  }

  // Animate year number change
  if (yrText) {
    gsap.to(yrText, {
      y: -20, opacity: 0, duration: 0.25,
      onComplete: () => {
        yrText.textContent = yr;
        gsap.fromTo(yrText, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
      }
    });
  }
}

/* ────────────────────────────────────────────────────────────
   3D BOOK PHYSICS
   Hover "View Projects" → cover slightly opens
   Click → cover fully opens (cover-open state)
   Close button → cover closes
──────────────────────────────────────────────────────────── */
function initBooks() {
  document.querySelectorAll('.book-world').forEach(world => {
    const yr = world.dataset.yr;
    const cover = document.getElementById(`cov-${yr}`);
    const book = document.getElementById(`book-${yr}`);
    const btn = world.querySelector('.view-btn');

    if (!cover || !book) return;

    // Trigger hover on book cover OR view button
    const hoverElements = [cover, btn].filter(Boolean);

    hoverElements.forEach(el => {
      // HOVER IN — cover gently lifts open (~28 degrees with elastic overshoot)
      el.addEventListener('mouseenter', () => {
        if (state.openBook === yr) return;
        gsap.killTweensOf(cover);
        playPageTurn();
        gsap.to(cover, {
          rotateY: -28,
          duration: 0.85,
          ease: 'elastic.out(1, 0.45)',
        });
        // Subtle 3D tilt
        gsap.to(book, {
          rotateX: -4, rotateZ: 1.5, scale: 1.03,
          duration: 0.6, ease: 'power2.out',
        });
      });

      // HOVER OUT — cover snaps back to closed resting state
      el.addEventListener('mouseleave', () => {
        if (state.openBook === yr) return;
        gsap.killTweensOf(cover);
        gsap.to(cover, {
          rotateY: 0,
          duration: 0.7,
          ease: 'power2.inOut',
        });
        gsap.to(book, {
          rotateX: 0, rotateZ: 0, scale: 1,
          duration: 0.5, ease: 'power2.out',
        });
      });
    });

    // CLICK — full open spread
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        initAudio(); playClick();
        openBook(yr);
      });
    }

    // Clicking front of cover also opens book
    cover.addEventListener('click', () => {
      if (state.openBook !== yr) {
        initAudio(); playClick();
        openBook(yr);
      }
    });
  });

  // Close buttons (inside open book)
  document.querySelectorAll('.book-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const yr = btn.dataset.yr;
      initAudio(); playClick();
      closeBook(yr, true);
    });
  });
}

function openBook(yr) {
  if (state.openBook === yr) return;
  state.openBook = yr;

  const cover = document.getElementById(`cov-${yr}`);
  const book = document.getElementById(`book-${yr}`);
  if (!cover || !book) return;

  book.classList.add('is-open');
  playPageTurn();

  // Phase 1: quick snap open to ~-90deg (hinge creak)
  gsap.to(cover, {
    rotateY: -90,
    duration: 0.45,
    ease: 'power3.in',
    onComplete: () => {
      // Phase 2: smooth sweep to -178deg (natural deceleration)
      gsap.to(cover, {
        rotateY: -178,
        duration: 0.85,
        ease: 'power2.out',
        onComplete: () => {
          book.classList.add('cover-open');
          book.classList.remove('is-open');
        },
      });
    },
  });

  // Scale up open book slightly for an expansive, immersive reading view
  gsap.to(book, {
    rotateX: 0, rotateZ: 0, rotateY: 2, scale: 1.1,
    duration: 1.2, ease: 'power3.out',
  });
}

function closeBook(yr, animate = true) {
  if (state.openBook !== yr && animate) return;
  state.openBook = null;

  const cover = document.getElementById(`cov-${yr}`);
  const book = document.getElementById(`book-${yr}`);
  if (!cover || !book) return;

  book.classList.remove('cover-open');
  playPageTurn();

  if (animate) {
    // Phase 1: swing back to ~-90 (fast)
    gsap.to(cover, {
      rotateY: -90,
      duration: 0.45,
      ease: 'power3.in',
      onComplete: () => {
        // Phase 2: snap closed with slight overshoot (spring)
        gsap.to(cover, {
          rotateY: 0,
          duration: 0.75,
          ease: 'elastic.out(1, 0.5)',
        });
      },
    });
    gsap.to(book, {
      rotateX: 0, rotateZ: 0, rotateY: 0,
      duration: 1.2, ease: 'power3.out',
    });
  } else {
    gsap.set(cover, { rotateY: 0 });
    gsap.set(book, { rotateX: 0, rotateZ: 0, rotateY: 0 });
  }
}

/* ────────────────────────────────────────────────────────────
   SERVICES SECTION — bento card hover tilt
──────────────────────────────────────────────────────────── */
function initServiceTilts() {
  document.querySelectorAll('.srv-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * -4;
      const ry = ((e.clientX - cx) / (r.width / 2)) * 4;
      gsap.to(card, {
        rotateX: rx, rotateY: ry,
        transformPerspective: 1200,
        duration: 0.4, ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 0.6, ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

/* ────────────────────────────────────────────────────────────
   HERO BENTO CARD TILT
──────────────────────────────────────────────────────────── */
function initBentoTilts() {
  document.querySelectorAll('.bc').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
      gsap.to(card, {
        rotateX: rx, rotateY: ry,
        transformPerspective: 1800,
        duration: 0.35, ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 0.7, ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

/* ────────────────────────────────────────────────────────────
   CARD B — HERO SHOWCASE SWITCHER TABS
──────────────────────────────────────────────────────────── */
function initHeroShowcase() {
  const tabs = document.querySelectorAll('.sc-tab');
  const imgEl = document.getElementById('hero-showcase-img');
  const titleEl = document.getElementById('sc-cap-title');
  const subEl = document.getElementById('sc-cap-sub');

  if (!tabs.length || !imgEl) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      initAudio(); playClick();

      const newImg = tab.dataset.img;
      const newTitle = tab.dataset.title;
      const newStyle = tab.dataset.style;

      // Crossfade background image
      gsap.to(imgEl, {
        opacity: 0.3,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          imgEl.style.backgroundImage = `url('${newImg}')`;
          if (titleEl) titleEl.textContent = newTitle;
          if (subEl) subEl.textContent = newStyle;
          gsap.to(imgEl, { opacity: 1, duration: 0.45, ease: 'power2.out' });
        }
      });
    });
  });
}

/* ────────────────────────────────────────────────────────────
   CHIP SELECTOR (consultation form)
──────────────────────────────────────────────────────────── */
function initChips() {
  document.querySelectorAll('.chip-group').forEach(group => {
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        initAudio(); playClick();
      });
    });
  });
}

/* ────────────────────────────────────────────────────────────
   CHRONO TELEMETRY DATE PICKER
──────────────────────────────────────────────────────────── */
function initChrono() {
  const trig = document.getElementById('chrono-trig');
  const pop  = document.getElementById('chrono-pop');
  const prev = document.getElementById('chrono-prev');
  const next = document.getElementById('chrono-next');
  const grid = document.getElementById('chrono-grid');
  const myEl = document.getElementById('chrono-my');
  const disp = document.getElementById('chrono-disp');
  const confirm = document.getElementById('chrono-confirm');

  if (!trig || !pop) return;

  function renderCalendar() {
    const yr = state.chronoViewYear;
    const mo = state.chronoViewMonth;
    const now = new Date();

    const monthNames = ['January','February','March','April','May','June',
      'July','August','September','October','November','December'];
    myEl.textContent = `${monthNames[mo]} ${yr}`;

    // Clear and add day names
    grid.innerHTML = '';
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
      const dn = document.createElement('div');
      dn.className = 'chrono-dn'; dn.textContent = d;
      grid.appendChild(dn);
    });

    const firstDay = new Date(yr, mo, 1).getDay();
    const daysInMonth = new Date(yr, mo + 1, 0).getDate();

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const em = document.createElement('div');
      em.className = 'chrono-day empty';
      grid.appendChild(em);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'chrono-day';
      dayEl.textContent = d;

      const thisDate = new Date(yr, mo, d);
      const isPast = thisDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const isToday = d === now.getDate() && mo === now.getMonth() && yr === now.getFullYear();

      if (isPast) dayEl.classList.add('disabled');
      if (isToday) dayEl.classList.add('today');
      if (state.chronoDate &&
          d === state.chronoDate.getDate() &&
          mo === state.chronoDate.getMonth() &&
          yr === state.chronoDate.getFullYear()) {
        dayEl.classList.add('selected');
      }

      if (!isPast) {
        dayEl.addEventListener('click', () => {
          state.chronoDate = new Date(yr, mo, d);
          renderCalendar();
          updateChronoDisplay();
          playClick();
        });
      }
      grid.appendChild(dayEl);
    }
  }

  function updateChronoDisplay() {
    if (state.chronoDate && state.chronoTime) {
      const opts = { weekday:'short', month:'short', day:'numeric', year:'numeric' };
      disp.textContent = `${state.chronoDate.toLocaleDateString('en-IN', opts)} · ${formatTime(state.chronoTime)}`;
    } else if (state.chronoDate) {
      disp.textContent = state.chronoDate.toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
    } else {
      disp.textContent = 'Select a date & time';
    }
  }

  function formatTime(t) {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hh = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    return `${hh}:${m.toString().padStart(2,'0')} ${period}`;
  }

  // Toggle popover
  trig.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    const isOpen = pop.classList.contains('open');
    if (isOpen) {
      closeChrono();
    } else {
      openChrono();
    }
  });

  function openChrono() {
    renderCalendar();
    pop.classList.add('open');
    pop.setAttribute('aria-hidden', 'false');
    trig.classList.add('active');
    trig.setAttribute('aria-expanded', 'true');
  }

  function closeChrono() {
    pop.classList.remove('open');
    pop.setAttribute('aria-hidden', 'true');
    trig.classList.remove('active');
    trig.setAttribute('aria-expanded', 'false');
  }

  prev.addEventListener('click', () => {
    state.chronoViewMonth--;
    if (state.chronoViewMonth < 0) { state.chronoViewMonth = 11; state.chronoViewYear--; }
    renderCalendar();
  });

  next.addEventListener('click', () => {
    state.chronoViewMonth++;
    if (state.chronoViewMonth > 11) { state.chronoViewMonth = 0; state.chronoViewYear++; }
    renderCalendar();
  });

  // Time slot selection
  document.querySelectorAll('.ts').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.ts').forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      state.chronoTime = slot.dataset.t;
      updateChronoDisplay();
      playClick();
    });
  });

  // Confirm
  confirm.addEventListener('click', () => {
    updateChronoDisplay();
    closeChrono();
    playClick();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!pop.contains(e.target) && e.target !== trig) {
      closeChrono();
    }
  });
}

/* ────────────────────────────────────────────────────────────
   FORM SUBMISSION (with validation)
──────────────────────────────────────────────────────────── */
function initForm() {
  const form = document.getElementById('consult-form');
  const submitBtn = document.getElementById('form-submit');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    initAudio(); playClick();

    // Simple validation
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    if (!name || !email) {
      gsap.to(submitBtn, {
        x: [0, -8, 8, -6, 6, -4, 4, 0],
        duration: 0.5, ease: 'none',
      });
      return;
    }

    // Simulate submission
    const span = submitBtn.querySelector('span');
    const icon = submitBtn.querySelector('i');
    gsap.to(submitBtn, { scale: 0.95, duration: 0.1 });
    setTimeout(() => {
      span.textContent = 'Sending...';
      gsap.to(submitBtn, { scale: 1, duration: 0.2 });
      setTimeout(() => {
        span.textContent = 'Enquiry Sent ✓';
        if (icon) { icon.className = 'fa-solid fa-check'; }
        submitBtn.style.background = 'linear-gradient(135deg, #2A5A3A, #4A9A64)';
      }, 1200);
    }, 100);
  });
}

/* ────────────────────────────────────────────────────────────
   ACTIVE NAV LINK (scroll-based)
──────────────────────────────────────────────────────────── */
function initActiveNav() {
  const sections = ['hero', 'journey', 'services', 'about', 'consultation'];
  const links = document.querySelectorAll('.nl');

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      end: 'bottom 40%',
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach(l => l.classList.remove('active'));
          const activeLink = document.querySelector(`.nl[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      },
    });
  });
}

/* ────────────────────────────────────────────────────────────
   SERVICES SECTION TEXT SCROLL ANIMATIONS
──────────────────────────────────────────────────────────── */
function initServiceAnimations() {
  gsap.utils.toArray('.srv-card').forEach((card, i) => {
    gsap.fromTo(card, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0,
      duration: 0.8,
      delay: i * 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true,
      },
    });
  });
}

/* ────────────────────────────────────────────────────────────
   ABOUT SECTION PARALLAX
──────────────────────────────────────────────────────────── */
function initAboutParallax() {
  const aboutImg = document.querySelector('.about-img');
  if (!aboutImg) return;
  gsap.to(aboutImg, {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about-sec',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
  });
}

/* ────────────────────────────────────────────────────────────
   MAIN INIT
──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Prevent flash of unstyled content
  document.body.style.overflow = 'hidden';

  // Boot sequence
  initParticles();
  initCursor();
  initRipples();
  initChips();
  initChrono();
  initForm();
  initHeroShowcase();
  initServiceTilts();
  initBentoTilts();
  initBooks();
  initNavbar();
  initScrollProgress();
  initActiveNav();

  // Lenis smooth scroll (must come before ScrollTrigger usage in animations)
  initLenis();

  // Road scrollytelling
  initRoad();

  // Service section animations
  initServiceAnimations();
  initAboutParallax();

  // Start preloader
  runPreloader();
});
