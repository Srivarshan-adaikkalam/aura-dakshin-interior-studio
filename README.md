# Aura & Dakshin | Luxury Architectural & Interior Design Studio

A highly immersive, premium, and interactive web experience designed for a luxury interior design studio based in Tamil Nadu (serving Chennai, Coimbatore, Madurai, Chettinad). The digital platform fuses international architectural minimalism with rich regional vernacular heritage, bringing the studio's portfolio to life through 60FPS fluid physics and advanced scrollytelling.

## 🌟 Core Architecture & Tech Stack
This project is built as a pure Vanilla HTML/CSS/JS frontend to ensure ultra-low latency, complete control over the DOM, and maximum frame rates during heavy physics animations without the overhead of heavy SPA frameworks.

- **Structure**: Semantic HTML5 with modular CSS variables.
- **Styling**: Vanilla CSS, heavily utilizing CSS Grid/Flexbox, custom properties for themes, glassmorphism, and responsive media queries. 
- **Typography**: 
  - *Primary/Headings*: **Outfit** (Sleek, modern, geometric).
  - *Heritage Accents*: **Cormorant Garamond** (Serif, italic, used for elegant tags and polaroid captions).
- **Core Animation Engine**: **GSAP (GreenSock Animation Platform)**
  - `ScrollTrigger` for timeline-based scrollytelling.
- **Smooth Scrolling**: **Lenis** (Inertia-based smooth scrolling engine for buttery soft track scrubbing).
- **Icons**: FontAwesome 6 Pro.

## ✨ Signature Features & Interactions

### 1. 3D Book Physics Engine (`.cov-front`, `.cov-back`, `.polaroids`)
A bespoke, GPU-accelerated 3D object viewer mimicking a heavy architectural heritage volume.
- Uses `transform-style: preserve-3d` and `rotateY` properties to open the book cover on hover.
- Stacks individual polaroids with randomized rotation (`--r`) and translations (`--tx`, `--ty`).
- Fully responsive stack that adjusts dynamically to prevent overlapping with interactive UI elements (like the "Explore Book Spread" button).

### 2. Immersive Scrollytelling (`#jrny-scroll`, `#jrny-sticky`)
A 4-stage vertical scroll track mimicking an architectural vehicle journey.
- **GSAP ScrollTrigger**: Pins the stage while the user scrubs down a 360vh virtual track.
- **SVG Path Tracing**: A top-down vehicle SVG maps perfectly to an invisible curved SVG path (`#road-path`), updating its X/Y coordinates and Rotation dynamically based on the scroll progress using `getPointAtLength`.

### 3. Chrono Telemetry Book Navigation
A fixed right-side popover module (`#bookshelf-nav`) that controls the scrollytelling stage.
- Users can click on different architectural volumes (e.g., *2021 Karaikudi*, *2023 Coimbatore*).
- Clicking a volume calculates the exact pixel offset inside the pinned ScrollTrigger track and utilizes Lenis to smoothly scroll the viewport to that exact historical moment, triggering the 3D book cover exchange.

### 4. Interactive Studio Gallery (`#gallery`)
A fluid, filterable masonry-style grid for categorizing snapshots (Awards, Site Execution, Artisan Craft, Studio Life).
- Features instant-hide logic combined with GSAP scale/opacity animations for perfectly aligned grid reflows without CSS layout breaking.

### 5. Heritage & Luxury Curation
- **Color Palette**: Void (Deep dark #09080A), Cream/Canvas (#F5EFE4), and metallic Gold gradients (#C9A96E to #8B6A32).
- **Micro-Interactions**: Magnetic hover states on buttons, glowing borders on team cards, custom SVG noise layers (`#noise-filter`) for texture, and smooth counter animations (`0 to 200+`) that only trigger when scrolled into view.

## 🚀 Deployment
Deployed seamlessly via **Vercel** as a static site. The repository is directly connected to Vercel via GitHub, meaning any `git push origin main` automatically triggers a sub-10-second global CDN deployment.

## 🛠️ Development Setup
1. Clone the repository.
2. Open `index.html` in your browser, or run a local dev server (e.g. VS Code Live Server / Python HTTP Server) to ensure CORS policies allow Lenis and GSAP to run smoothly.
3. Edit `css/styles.css` for layout/theme variables and `js/main.js` for GSAP physics and timeline modifications.
