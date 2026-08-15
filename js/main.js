/* ============================================================
   AURA & DAKSHIN INTERIORS — Main Engine v7.0
   Parallax Architecture Hero + Flying Bookshelf Engine + Crisp 3D Page Turn
   ============================================================ */

/* ── STATE MANAGEMENT ─────────────────────────────────────── */
const state = {
  currentYear: '2019',
  modalOpen: false,
  activeModalYear: '2019',
  audioCtx: null,
  audioInit: false,
};

/* Project Data Store for Full-Page Book Spread Modal */
const projectData = {
  '2019': {
    yrTag: '2019 MILESTONE CHAPTER',
    title: 'Boat Club Residence',
    loc: 'RA Puram, Chennai',
    quote: '"Aura & Dakshin preserved our family\'s heritage Tanjore bronzes while giving us an Italian marble open living space."',
    clientAv: 'SR',
    clientName: 'S. Ramaswamy',
    clientRole: 'Homeowner · Boat Club, Chennai',
    desc: 'A harmonious fusion of contemporary open-plan living with restored antique Chettinad joinery. Featuring hand-carved teakwood doorways, custom brass lighting fixtures, and seamless indoor-outdoor verandah flow.',
    specArea: '5,400 sq.ft',
    specStyle: 'Neo-Classical & Bronze',
    specMaterial: 'Teak, Marble, Tanjore Brass',
    specDuration: '14 months',
    img1: 'assets/hero_chettinad.jpg',
    tag1: 'Grand Foyer Entrance',
    img2: 'assets/hero.jpg',
    tag2: 'Italian Marble Living',
    img3: 'assets/hero_bedroom.jpg',
    tag3: 'Verandah Lounge',
    cbg: '#2C1F17',
    tagline: 'Chennai Heritage Reborn',
    nextYr: '2021',
    prevYr: '2024'
  },
  '2021': {
    yrTag: '2021 MILESTONE CHAPTER',
    title: 'Chettinad Courtyard Mansion',
    loc: 'Karaikudi, Sivaganga',
    quote: '"Hand-pressed Athangudi tiles underfoot and 100-year-old carved teak pillars illuminated by soft brass pendants — magical."',
    clientAv: 'CT',
    clientName: 'M. Chidambaram',
    clientRole: 'Heritage Homeowner · Karaikudi',
    desc: 'Complete restoration of a 1920s Chettinad ancestral mansion. Reclaiming carved teakwood columns, installing custom hand-pressed Athangudi geometric floor tiles, and engineering an open central Thinnai sky-courtyard.',
    specArea: '7,200 sq.ft',
    specStyle: 'Heritage Chettinad',
    specMaterial: 'Athangudi Tiles, Teakwood, Brass',
    specDuration: '20 months',
    img1: 'assets/hero_chettinad.jpg',
    tag1: 'Central Thinnai Courtyard',
    img2: 'assets/about.jpg',
    tag2: 'Artisan Wood Joinery',
    img3: 'assets/hero_lounge.jpg',
    tag3: 'Pillar Dining Hall',
    cbg: '#1A2B1F',
    tagline: 'Chettinad Craftsmanship',
    nextYr: '2023',
    prevYr: '2019'
  },
  '2023': {
    yrTag: '2023 MILESTONE CHAPTER',
    title: 'Kovai Biophilic Sanctuary',
    loc: 'Race Course, Coimbatore',
    quote: '"Natural breeze corridors, indoor waterfall features, and warm oak & Erode silk drapes. Complete tranquility."',
    clientAv: 'VK',
    clientName: 'V. Krishnakumar',
    clientRole: 'Industrialist · Coimbatore',
    desc: 'An eco-luxury biophilic sanctuary designed around natural airflow corridors, living plant walls, and an indoor slate waterfall feature. Softened with Erode handloom silk upholstery and Japanese white oak woodwork.',
    specArea: '6,800 sq.ft',
    specStyle: 'Japandi Biophilic',
    specMaterial: 'White Oak, Erode Silk, Slate',
    specDuration: '16 months',
    img1: 'assets/hero.jpg',
    tag1: 'Indoor Waterfall Foyer',
    img2: 'assets/hero_bedroom.jpg',
    tag2: 'Erode Silk Suite',
    img3: 'assets/about.jpg',
    tag3: 'Tea Garden Pavilion',
    cbg: '#1F1A2B',
    tagline: 'Biophilic Living',
    nextYr: '2024',
    prevYr: '2021'
  },
  '2024': {
    yrTag: '2024 MILESTONE CHAPTER',
    title: 'Promenade Coastal Villa',
    loc: 'White Town, Puducherry',
    quote: '"French colonial archways, terracotta tiles, and brass-fitted rattan joinery overlooking the Bay of Bengal."',
    clientAv: 'AD',
    clientName: 'Ananya & David Dupont',
    clientRole: 'Homeowners · Puducherry',
    desc: 'A sun-drenched French colonial coastal sanctuary overlooking the sea. Featuring high-arched terracotta doorways, rattan cabinetry, brass fixtures, and a private courtyard plunge pool.',
    specArea: '4,600 sq.ft',
    specStyle: 'French Colonial Coastal',
    specMaterial: 'Terracotta, Rattan, Marine Brass',
    specDuration: '11 months',
    img1: 'assets/hero_lounge.jpg',
    tag1: 'Ocean View Salon',
    img2: 'assets/hero_chettinad.jpg',
    tag2: 'Terracotta Courtyard',
    img3: 'assets/hero.jpg',
    tag3: 'Plunge Pool Deck',
    cbg: '#1B2320',
    tagline: 'Coastal Colonial Elegance',
    nextYr: '2019',
    prevYr: '2023'
  },
};

/* ────────────────────────────────────────────────────────────
   ORGANIC WEB AUDIO SYNTHESIZER
──────────────────────────────────────────────────────────── */
function initAudio() {
  if (state.audioInit) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      state.audioCtx = new AudioCtx();
      state.audioInit = true;
    }
  } catch (e) {}
}

function playPageTurn() {
  if (!state.audioCtx) return;
  try {
    const ctx = state.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const bufLen = ctx.sampleRate * 0.22;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2.2);
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.22);
    filter.Q.value = 1.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (e) {}
}

function playBookFly() {
  if (!state.audioCtx) return;
  try {
    const ctx = state.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

function playClick() {
  if (!state.audioCtx) return;
  try {
    const ctx = state.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
}

/* ────────────────────────────────────────────────────────────
   PRELOADER
──────────────────────────────────────────────────────────── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('pre-bar');
  if (!preloader || !bar) return;

  let p = 0;
  const iv = setInterval(() => {
    p += Math.floor(Math.random() * 15) + 8;
    if (p > 100) p = 100;
    bar.style.width = p + '%';

    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        preloader.classList.add('gone');
        document.body.style.overflow = '';
        triggerHeroAnimations();
      }, 400);
    }
  }, 40);
}

/* ────────────────────────────────────────────────────────────
   AMBIENT PARTICLES
──────────────────────────────────────────────────────────── */
function initParticles() {
  const cvs = document.getElementById('ambient-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let w = cvs.width = window.innerWidth;
  let h = cvs.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = cvs.width = window.innerWidth;
    h = cvs.height = window.innerHeight;
  });

  const parts = Array.from({ length: 28 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8 + 0.6,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.35 + 0.1,
  }));

  function anim() {
    ctx.clearRect(0, 0, w, h);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(anim);
  }
  anim();
}

/* ────────────────────────────────────────────────────────────
   LENIS SMOOTH SCROLLING
──────────────────────────────────────────────────────────── */
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

/* ────────────────────────────────────────────────────────────
   CINEMATIC HERO ANIMATIONS & PARALLAX BACKDROP
──────────────────────────────────────────────────────────── */
function triggerHeroAnimations() {
  const tl = gsap.timeline();

  tl.to('.hero-sec [data-reveal]', {
    opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
  });

  tl.from('.cinematic-glow', { scale: 0.5, opacity: 0, duration: 1.5, ease: 'power2.out' }, 0.2);

  // Parallax Scroll for Card A background image
  gsap.to('#hero-bg-parallax', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.to, 10) || 0;
    gsap.to(el, { innerText: target, duration: 2.2, ease: 'power2.out', snap: { innerText: 1 } });
  });
}

/* ────────────────────────────────────────────────────────────
   HERO SHOWCASE TAB SWITCHER
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

      gsap.to(imgEl, {
        opacity: 0.3, duration: 0.25, ease: 'power2.in',
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
   ROAD SVG + TRANSPORTER + RIGHT BOOKSHELF EXCHANGE ENGINE
──────────────────────────────────────────────────────────── */
let roadPath, roadPathLen;
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

  const jrnyScroll = document.getElementById('jrny-scroll');
  const jrnySticky = document.getElementById('jrny-sticky');

  positionCar(0);
  mountActiveBookOnStage('2019');

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
  const pt2 = roadPath.getPointAtLength(Math.min(targetLen + 2, roadPathLen));
  const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);

  gsap.set(car, { x: pt.x, y: pt.y, rotation: angle, transformOrigin: 'center center' });
}

function updateActiveYear(progress) {
  let matched = yearThresholds[0].yr;
  for (const t of yearThresholds) {
    if (progress >= t.start && progress < t.end) {
      matched = t.yr; break;
    }
  }

  if (matched !== state.currentYear) {
    executeRightBookshelfExchange(matched);
  }
}

/* Right-Side Bookshelf Flying Exchange Mechanism */
function executeRightBookshelfExchange(targetYr) {
  const oldYr = state.currentYear;
  state.currentYear = targetYr;

  initAudio(); playBookFly();

  document.querySelectorAll('.rack-shelf-item').forEach(item => {
    if (item.dataset.yr === targetYr) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  const yrText = document.getElementById('ayr-text');
  if (yrText) {
    gsap.to(yrText, { y: -20, opacity: 0, duration: 0.2, onComplete: () => {
      yrText.textContent = targetYr;
      gsap.fromTo(yrText, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
    }});
  }

  const stageWrapper = document.getElementById('active-book-wrapper');
  if (!stageWrapper) return;

  const currentBook = stageWrapper.firstElementChild;
  if (currentBook) {
    gsap.to(currentBook, {
      x: 320, y: -40, scale: 0.5, rotateY: 45, opacity: 0, duration: 0.5, ease: 'power2.in',
      onComplete: () => {
        mountActiveBookOnStage(targetYr);
      }
    });
  } else {
    mountActiveBookOnStage(targetYr);
  }
}

function mountActiveBookOnStage(yr) {
  const stageWrapper = document.getElementById('active-book-wrapper');
  const data = projectData[yr];
  if (!stageWrapper || !data) return;

  stageWrapper.innerHTML = `
    <div class="book-scene" id="bs-${yr}">
      <div class="book" id="book-${yr}">
        <div class="book-spine"></div>
        <div class="book-cover" id="cov-${yr}">
          <div class="cov-face cov-front" style="--cbg:${data.cbg}">
            <div class="cov-texture"></div>
            <div class="cov-top">
              <span class="cov-studio">AURA &amp; DAKSHIN</span>
              <span class="cov-div">·</span>
              <span class="cov-yr">${yr}</span>
            </div>
            <div class="polaroids">
              <div class="pol" style="--r:-8deg;--tx:12%;--ty:16%">
                <div class="pol-img" style="background-image:url('${data.img1}')"></div>
                <div class="pol-cap" style="font-family:'Reenie Beanie',cursive">${data.tag1}</div>
              </div>
              <div class="pol" style="--r:7deg;--tx:54%;--ty:8%">
                <div class="pol-img" style="background-image:url('${data.img2}')"></div>
                <div class="pol-cap" style="font-family:'Reenie Beanie',cursive">${data.tag2}</div>
              </div>
              <div class="pol" style="--r:-3deg;--tx:32%;--ty:50%">
                <div class="pol-img" style="background-image:url('${data.img3}')"></div>
                <div class="pol-cap" style="font-family:'Reenie Beanie',cursive">${data.tag3}</div>
              </div>
            </div>
            <div class="cov-foot">
              <span class="cov-tagline" style="font-family:'Reenie Beanie',cursive;font-size:16px">${data.tagline}</span>
            </div>
            <button class="view-btn open-modal-btn" data-yr="${yr}">
              <span>Explore Book Spread</span>
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
          <div class="cov-face cov-back">
            <div class="cov-inner-pat"></div>
            <div class="cov-inner-logo">A</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const newBookScene = stageWrapper.firstElementChild;
  const cover = document.getElementById(`cov-${yr}`);
  const book = document.getElementById(`book-${yr}`);
  const btn = stageWrapper.querySelector('.open-modal-btn');

  gsap.fromTo(newBookScene, 
    { x: 320, y: -40, scale: 0.5, rotateY: 45, opacity: 0 },
    { x: 0, y: 0, scale: 1, rotateY: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }
  );

  if (cover && book) {
    [cover, btn].filter(Boolean).forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (state.modalOpen) return;
        playPageTurn();
        gsap.to(cover, { rotateY: -28, duration: 0.85, ease: 'elastic.out(1, 0.45)' });
        gsap.to(book, { rotateX: -4, rotateZ: 1.5, scale: 1.08, duration: 0.6, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        if (state.modalOpen) return;
        gsap.to(cover, { rotateY: 0, duration: 0.7, ease: 'power2.inOut' });
        gsap.to(book, { rotateX: 0, rotateZ: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
      });
    });

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); initAudio(); playClick(); openBookModal(yr);
      });
    }
    cover.addEventListener('click', () => {
      initAudio(); playClick(); openBookModal(yr);
    });
  }
}

/* ────────────────────────────────────────────────────────────
   REALISTIC 3D PAGE TURN & FULL-PAGE MODAL ENGINE
──────────────────────────────────────────────────────────── */
function initBookModalEvents() {
  const closeBtn = document.getElementById('bm-close-btn');
  const backdrop = document.getElementById('bm-backdrop');
  const nextBtn = document.getElementById('bm-next-btn');
  const prevBtn = document.getElementById('bm-prev-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeBookModal);
  if (backdrop) backdrop.addEventListener('click', closeBookModal);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const data = projectData[state.activeModalYear];
      if (data && data.nextYr) animateRealisticPageFlip(data.nextYr, true);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const data = projectData[state.activeModalYear];
      if (data && data.prevYr) animateRealisticPageFlip(data.prevYr, false);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.modalOpen) closeBookModal();
  });
}

/* Realistic 3D Paper Page Turn Engine */
function animateRealisticPageFlip(targetYr, isForward) {
  const mesh = document.getElementById('turning-page-mesh');
  if (!mesh) {
    openBookModal(targetYr); return;
  }

  playPageTurn();

  gsap.killTweensOf(mesh);
  gsap.fromTo(mesh,
    { opacity: 1, rotateY: isForward ? 0 : -180 },
    {
      rotateY: isForward ? -180 : 0,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        openBookModal(targetYr);
        gsap.set(mesh, { opacity: 0, rotateY: 0 });
      }
    }
  );
}

function openBookModal(yr) {
  const data = projectData[yr];
  if (!data) return;

  state.modalOpen = true;
  state.activeModalYear = yr;

  document.getElementById('bm-yr-tag').textContent = data.yrTag;
  document.getElementById('bm-title').textContent = data.title;
  document.getElementById('bm-loc').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.loc}`;
  document.getElementById('bm-quote').textContent = data.quote;
  document.getElementById('bm-av').textContent = data.clientAv;
  document.getElementById('bm-cn').textContent = data.clientName;
  document.getElementById('bm-cr').textContent = data.clientRole;
  document.getElementById('bm-desc').textContent = data.desc;
  document.getElementById('bm-spec-area').textContent = data.specArea;
  document.getElementById('bm-spec-style').textContent = data.specStyle;
  document.getElementById('bm-spec-material').textContent = data.specMaterial;
  document.getElementById('bm-spec-duration').textContent = data.specDuration;

  document.getElementById('bm-img-1').style.backgroundImage = `url('${data.img1}')`;
  document.getElementById('bm-tag-1').textContent = data.tag1;
  document.getElementById('bm-img-2').style.backgroundImage = `url('${data.img2}')`;
  document.getElementById('bm-tag-2').textContent = data.tag2;
  document.getElementById('bm-img-3').style.backgroundImage = `url('${data.img3}')`;
  document.getElementById('bm-tag-3').textContent = data.tag3;

  const modal = document.getElementById('book-modal-overlay');
  if (!modal) return;

  modal.classList.add('open');
  playPageTurn();

  if (lenis) lenis.stop();
}

function closeBookModal() {
  const modal = document.getElementById('book-modal-overlay');
  if (!modal) return;

  modal.classList.remove('open');
  state.modalOpen = false;
  playPageTurn();

  if (lenis) lenis.start();
}

/* ────────────────────────────────────────────────────────────
   DEDICATED TEAM SHOWCASE CARDS
──────────────────────────────────────────────────────────── */
function initTeamCards() {
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.team-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      initAudio(); playClick();
    });
  });
}

/* ────────────────────────────────────────────────────────────
   CHIP SELECTOR
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
   FIXED CHRONO POPOVER DIALOG
──────────────────────────────────────────────────────────── */
function initChrono() {
  const trig = document.getElementById('chrono-trig');
  const overlay = document.getElementById('chrono-modal-overlay');
  const disp = document.getElementById('chrono-disp');
  const grid = document.getElementById('chrono-grid');
  const monthYr = document.getElementById('chrono-my');
  const prevBtn = document.getElementById('chrono-prev');
  const nextBtn = document.getElementById('chrono-next');
  const confirmBtn = document.getElementById('chrono-confirm');
  const slots = document.querySelectorAll('.ts');

  if (!trig || !overlay || !grid) return;

  let curDate = new Date();
  let selDay = null;
  let selSlot = '10:00 AM';

  function renderCalendar() {
    const yr = curDate.getFullYear();
    const mo = curDate.getMonth();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    if (monthYr) monthYr.textContent = `${months[mo]} ${yr}`;

    const firstDay = new Date(yr, mo, 1).getDay();
    const daysInMo = new Date(yr, mo + 1, 0).getDate();
    const today = new Date();

    grid.innerHTML = '';

    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
      const el = document.createElement('div');
      el.className = 'chrono-dn'; el.textContent = d;
      grid.appendChild(el);
    });

    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'chrono-day empty';
      grid.appendChild(el);
    }

    for (let d = 1; d <= daysInMo; d++) {
      const el = document.createElement('div');
      el.className = 'chrono-day';
      el.textContent = d;

      const thisDate = new Date(yr, mo, d);
      if (thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        el.classList.add('disabled');
      }
      if (d === today.getDate() && mo === today.getMonth() && yr === today.getFullYear()) {
        el.classList.add('today');
      }
      if (selDay === d) {
        el.classList.add('selected');
      }

      el.addEventListener('click', () => {
        if (el.classList.contains('disabled')) return;
        grid.querySelectorAll('.chrono-day').forEach(cd => cd.classList.remove('selected'));
        el.classList.add('selected');
        selDay = d;
        initAudio(); playClick();
      });

      grid.appendChild(el);
    }
  }

  trig.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio(); playClick();
    overlay.classList.add('open');
    renderCalendar();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      curDate.setMonth(curDate.getMonth() - 1);
      renderCalendar(); initAudio(); playClick();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      curDate.setMonth(curDate.getMonth() + 1);
      renderCalendar(); initAudio(); playClick();
    });
  }

  slots.forEach(slot => {
    slot.addEventListener('click', (e) => {
      e.stopPropagation();
      slots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      selSlot = slot.textContent;
      initAudio(); playClick();
    });
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (selDay) {
        const moName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][curDate.getMonth()];
        disp.textContent = `${moName} ${selDay}, ${curDate.getFullYear()} at ${selSlot}`;
      } else {
        disp.textContent = `Selected slot: ${selSlot}`;
      }
      overlay.classList.remove('open');
      initAudio(); playClick();
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
}

/* ────────────────────────────────────────────────────────────
   STUDIO ENVELOPE SEAL SUBMISSION
──────────────────────────────────────────────────────────── */
function initFlightForm() {
  const form = document.getElementById('consult-form');
  const submitBtn = document.getElementById('form-submit');
  const btnText = document.getElementById('submit-btn-text');
  const sweep = document.getElementById('submit-progress-sweep');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    initAudio(); playClick();

    const name = document.getElementById('cf-name').value;
    if (!name) { alert('Please enter your name'); return; }

    btnText.textContent = 'Sealing Consultation Envelope...';

    gsap.to(sweep, {
      left: '100%', duration: 1.2, ease: 'power2.inOut',
      onComplete: () => {
        btnText.textContent = '✓ Consultation Enquiry Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #3A5C40, #7A8C74)';
        submitBtn.style.color = '#fff';
        form.reset();
        gsap.set(sweep, { left: '-100%' });
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────
   SCROLL REVEAL & PARALLAX
──────────────────────────────────────────────────────────── */
function initScrollReveal() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 85%',
      onEnter: () => el.classList.add('revealed'), once: true,
    });
  });
}

function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { nav.classList.add('scrolled'); }
    else { nav.classList.remove('scrolled'); }
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-prog');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const prog = (window.scrollY / total) * 100;
    if (bar) bar.style.width = Math.min(100, Math.max(0, prog)) + '%';
  });
}

/* ────────────────────────────────────────────────────────────
   MAIN INIT
──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  document.body.style.overflow = 'hidden';

  initPreloader();
  initParticles();
  initChips();
  initChrono();
  initFlightForm();
  initHeroShowcase();
  initTeamCards();
  initBookModalEvents();
  initNavbar();
  initScrollProgress();
  initLenis();
  initRoad();
  initScrollReveal();
});
