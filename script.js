/* ============================================================
   ANTARIKSH SAWARBANDHE PORTFOLIO — MAIN SCRIPT
   Three.js Hero | GSAP Scroll Animations | Cursor | Magnetic
   ============================================================ */

'use strict';

// ─── GSAP Plugin Registration ───────────────────────────────────
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ─── UTILITY ────────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

// ════════════════════════════════════════════════════════════════
//  1. CUSTOM CURSOR
// ════════════════════════════════════════════════════════════════
const cursorOuter = $('#cursorOuter');
const cursorDot   = $('#cursorDot');
let mouseX = 0, mouseY = 0;
let outerX = 0, outerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.08 });
});

function animateCursorOuter() {
  outerX = lerp(outerX, mouseX, 0.12);
  outerY = lerp(outerY, mouseY, 0.12);
  gsap.set(cursorOuter, { x: outerX, y: outerY });
  requestAnimationFrame(animateCursorOuter);
}
animateCursorOuter();

const hoverables = 'a, button, [data-magnetic], .portfolio-card, .service-card, .why-card, .tool-card, input, textarea';
document.addEventListener('mouseover', e => {
  if (e.target.closest(hoverables)) {
    cursorOuter.classList.add('hovering');
    cursorDot.classList.add('hovering');
  }
});
document.addEventListener('mouseout', e => {
  if (e.target.closest(hoverables)) {
    cursorOuter.classList.remove('hovering');
    cursorDot.classList.remove('hovering');
  }
});

// ════════════════════════════════════════════════════════════════
//  2. NAVBAR
// ════════════════════════════════════════════════════════════════
const navbar   = $('#navbar');
const hamburger = $('#hamburger');
const mobileMenu = $('#mobileMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

$$('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ════════════════════════════════════════════════════════════════
//  3. THREE.JS HERO SCENE
// ════════════════════════════════════════════════════════════════
(function initHeroScene() {
  const canvas = $('#heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 12);

  // ── Lights ──
  const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.5);
  scene.add(ambientLight);
  const pointLight1 = new THREE.PointLight(0x7c3aed, 3, 30);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 30);
  pointLight2.position.set(-5, -3, 3);
  scene.add(pointLight2);
  const pointLight3 = new THREE.PointLight(0x4f46e5, 1.5, 20);
  pointLight3.position.set(0, -5, -5);
  scene.add(pointLight3);

  // ── Materials ──
  const matViolet = new THREE.MeshStandardMaterial({
    color: 0x7c3aed, wireframe: false, metalness: 0.3, roughness: 0.4,
    transparent: true, opacity: 0.85,
  });
  const matWireViolet = new THREE.MeshBasicMaterial({
    color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.4,
  });
  const matCyan = new THREE.MeshStandardMaterial({
    color: 0x06b6d4, metalness: 0.5, roughness: 0.3,
    transparent: true, opacity: 0.75,
  });
  const matWireCyan = new THREE.MeshBasicMaterial({
    color: 0x67e8f9, wireframe: true, transparent: true, opacity: 0.3,
  });
  const matIndigo = new THREE.MeshStandardMaterial({
    color: 0x4f46e5, metalness: 0.4, roughness: 0.5,
    transparent: true, opacity: 0.7,
  });
  const matGlass = new THREE.MeshStandardMaterial({
    color: 0x1a0a2e, transparent: true, opacity: 0.3,
    metalness: 0.9, roughness: 0.1,
  });

  // ── Geometry Objects ──
  const objects = [];

  function addObj(geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, scale = 1) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.setScalar(scale);
    scene.add(mesh);
    objects.push(mesh);
    return mesh;
  }

  // Torus (right)
  const torusGeo = new THREE.TorusGeometry(1.2, 0.35, 16, 60);
  addObj(torusGeo, matViolet, 5, 1, -2, 0.4, 0.8, 0);
  addObj(torusGeo, matWireViolet, 5, 1, -2, 0.4, 0.8, 0);

  // Icosahedron (left back)
  const icoGeo = new THREE.IcosahedronGeometry(1.5, 0);
  addObj(icoGeo, matCyan, -6, 2, -4, 0.3, 0.5, 0.2, 1);
  addObj(icoGeo, matWireCyan, -6, 2, -4, 0.3, 0.5, 0.2, 1);

  // Octahedron (top right)
  const octGeo = new THREE.OctahedronGeometry(0.9, 0);
  addObj(octGeo, matIndigo, 4, 4, -1, 0.5, 0.3, 0.8);

  // Dodecahedron (bottom left)
  const dodGeo = new THREE.DodecahedronGeometry(0.8, 0);
  addObj(dodGeo, matViolet, -4, -3, 0, 0.2, 0.6, 0.1, 0.9);

  // Sphere wireframe (center back)
  const sphereGeo = new THREE.SphereGeometry(2, 16, 16);
  addObj(sphereGeo, matWireViolet, 0, 0, -6, 0, 0, 0, 1);

  // Small glowing spheres (particles)
  const smallSphereGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const smallMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.8 });
  const positions = [
    [3, -2, 1], [-3, 3, 2], [2, 4, -1], [-2, -1, 3],
    [5, -1, 0], [-5, 0, -2], [0, 3, 2], [1, -4, 1],
    [-4, 1, 1], [3, 2, 2],
  ];
  positions.forEach(([x, y, z]) => {
    addObj(smallSphereGeo, smallMat, x, y, z);
  });

  // Torus knot
  const knotGeo = new THREE.TorusKnotGeometry(0.7, 0.2, 64, 8);
  addObj(knotGeo, matGlass, -5, -1, 1, 0, 0.5, 0.2, 1.2);

  // Particle system
  const particleCount = 300;
  const positions2 = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions2[i] = (Math.random() - 0.5) * 30;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x7c3aed, size: 0.06, transparent: true, opacity: 0.6,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Mouse parallax ──
  let targetMouseX = 0, targetMouseY = 0;
  let currentMouseX = 0, currentMouseY = 0;

  document.addEventListener('mousemove', e => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Animation loop ──
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.008;

    currentMouseX = lerp(currentMouseX, targetMouseX, 0.05);
    currentMouseY = lerp(currentMouseY, targetMouseY, 0.05);

    // Camera parallax
    camera.position.x = lerp(camera.position.x, currentMouseX * 1.5, 0.05);
    camera.position.y = lerp(camera.position.y, -currentMouseY * 0.8, 0.05);
    camera.lookAt(scene.position);

    // Animate objects
    objects.forEach((obj, i) => {
      if (i < 2) { // torus
        obj.rotation.x += 0.005;
        obj.rotation.y += 0.008;
      } else if (i < 4) { // icosahedron
        obj.rotation.x += 0.006;
        obj.rotation.z += 0.004;
      } else if (i < 5) { // octahedron
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.007;
        obj.position.y = 4 + Math.sin(time * 1.5) * 0.3;
      } else if (i < 6) { // dodecahedron
        obj.rotation.y += 0.008;
        obj.rotation.z += 0.005;
        obj.position.y = -3 + Math.sin(time * 1.2 + 1) * 0.4;
      } else if (i < 7) { // sphere wire
        obj.rotation.y += 0.003;
        obj.rotation.x += 0.002;
      } else if (i < objects.length - 1) { // small spheres
        obj.position.y += Math.sin(time + i * 0.7) * 0.005;
        obj.position.x += Math.cos(time * 0.5 + i * 0.9) * 0.003;
      } else { // torus knot
        obj.rotation.x += 0.012;
        obj.rotation.y += 0.008;
      }
    });

    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    pointLight1.position.x = 5 + Math.sin(time) * 2;
    pointLight1.position.y = 5 + Math.cos(time * 0.7) * 2;
    pointLight2.position.x = -5 + Math.cos(time * 0.9) * 2;

    renderer.render(scene, camera);
  }
  animate();

  // ── Resize ──
  window.addEventListener('resize', () => {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();

// ════════════════════════════════════════════════════════════════
//  4. HERO TEXT ANIMATIONS
// ════════════════════════════════════════════════════════════════
(function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.fromTo('#heroName .hero-name-line',
    { y: 80, opacity: 0, skewY: 4 },
    { y: 0, opacity: 1, skewY: 0, stagger: 0.15, duration: 1.1, ease: 'power4.out' }
  )
  .fromTo('.hero-badge',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.8'
  )
  .fromTo('#heroRoles',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4'
  )
  .fromTo('#heroIntro',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3'
  )
  .fromTo('#heroStats',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4'
  )
  .fromTo('#heroCta',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3'
  )
  .fromTo('.hero-float-card',
    { opacity: 0, scale: 0.8, y: 20 },
    { opacity: 1, scale: 1, y: 0, stagger: 0.2, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.3'
  )
  .fromTo('.hero-float-badge',
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, stagger: 0.2, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.5'
  );

  // Role text cycling
  const roles = [
    'Graphic Designer',
    'Visual Designer',
    'Video Editor',
    'Freelancer',
    'Brand Creator',
    'Content Creator',
  ];
  let roleIdx = 0;
  const roleEl = $('#roleText');
  if (roleEl) {
    setInterval(() => {
      gsap.to(roleEl, {
        opacity: 0, y: -10, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          roleIdx = (roleIdx + 1) % roles.length;
          roleEl.textContent = roles[roleIdx];
          gsap.fromTo(roleEl,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
          );
        }
      });
    }, 2200);
  }
})();

// ════════════════════════════════════════════════════════════════
//  5. SCROLL REVEAL (IntersectionObserver)
// ════════════════════════════════════════════════════════════════
(function initScrollReveal() {
  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          delay: delay / 1000,
          ease: 'power3.out',
        });
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

// ════════════════════════════════════════════════════════════════
//  6. COUNTER ANIMATION
// ════════════════════════════════════════════════════════════════
(function initCounters() {
  const counters = $$('[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = Date.now();

        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out quad
          const eased = 1 - (1 - progress) ** 3;
          const value = Math.round(eased * target);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        tick();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
})();

// ════════════════════════════════════════════════════════════════
//  7. MAGNETIC BUTTONS
// ════════════════════════════════════════════════════════════════
(function initMagnetic() {
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    });
  });
})();

// ════════════════════════════════════════════════════════════════
//  8. TILT CARDS
// ════════════════════════════════════════════════════════════════
(function initTilt() {
  $$('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * -10;
      const tiltY = ((x - cx) / cx) * 10;
      gsap.to(card, {
        rotateX: tiltX, rotateY: tiltY,
        transformPerspective: 800,
        duration: 0.3, ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 0.5, ease: 'elastic.out(1, 0.5)',
      });
    });
  });
})();

// ════════════════════════════════════════════════════════════════
//  9. PORTFOLIO GRID
// ════════════════════════════════════════════════════════════════
const portfolioData = [
  {
    id: 1, category: 'youtube', categoryLabel: 'YouTube Design',
    title: 'Best Laptop for Students — Thumbnail',
    image: 'images/project-thumbnail-laptop.jpg',
    tools: ['Adobe Photoshop'],
    objective: 'Design a high-CTR YouTube thumbnail for a tech review video targeting students looking for laptops under Rs 60,000.',
    process: 'Built a dark moody studio-desk atmosphere with the subject in a thoughtful pose. Applied bold grunge yellow typography for "STUDENTS" as the hero word. Added category tags (Performance, Gaming, Video Editing, College Use, Best Value) and a price hook bubble "Under Rs 60,000?" for strong visual storytelling.',
    result: 'A cinematic, attention-grabbing thumbnail with strong visual hierarchy — dominant subject word supported by price hook and quick-scan category tags.',
    color: '#f59e0b',
  },
  {
    id: 2, category: 'youtube', categoryLabel: 'YouTube Design',
    title: 'Best Laptop 2026 — Tech Review Thumbnail',
    image: 'images/thumb-best-laptop-2026.jpg',
    tools: ['Adobe Photoshop'],
    objective: 'Design a bold, scroll-stopping YouTube thumbnail for a 2026 laptop review targeting tech enthusiasts.',
    process: 'Built a dark cinematic setup shot with blue neon ambient lighting reflecting the tech mood. Layered bold white and cyan typography with a yellow-pill badge "Worth Buying?". Added icon badges (Performance, Battery, Editing, Gaming) at the bottom for immediate content clarity.',
    result: 'A high-impact thumbnail with strong contrast, clear value proposition and premium tech-review visual aesthetic.',
    color: '#06b6d4',
  },
  {
    id: 3, category: 'youtube', categoryLabel: 'YouTube Design',
    title: 'A Day in My College Life — Vlog Thumbnail',
    image: 'images/thumb-college-life.jpg',
    tools: ['Adobe Photoshop'],
    objective: 'Design a relatable, emotionally resonant YouTube thumbnail for a college life vlog targeting students in Nagpur.',
    process: 'Captured a moody night-study desk setup with warm rim lighting. Applied bold headline typography (white + yellow) with a checklist overlay showing real daily activities. Added SVPCET Nagpur location watermark and "Same Student, Different Dreams" handwritten annotation for personal authenticity.',
    result: 'A deeply relatable student vlog thumbnail communicating a real college routine with personal, aspirational energy.',
    color: '#f59e0b',
  },
  {
    id: 4, category: 'youtube', categoryLabel: 'YouTube Design',
    title: 'Street Food — Food Vlog Thumbnail',
    image: 'images/thumb-street-food.jpg',
    tools: ['Adobe Photoshop'],
    objective: 'Design a vibrant, appetite-triggering YouTube thumbnail for a street food vlog.',
    process: 'Used an extreme close-up food photo as the full-bleed hero. Applied bold grunge brush-stroke text — "STREET" in white, "FOOD" in yellow. Added chalkboard sign "Good Food Good Mood" and tagline "Spicy - Tasty - Must Try" for visual punch.',
    result: 'An energetic, visually rich thumbnail that makes viewers hungry and curious at first glance — strong colour, texture and type combination.',
    color: '#ef4444',
  },
  {
    id: 5, category: 'youtube', categoryLabel: 'YouTube Design',
    title: 'Suresh Bhau — Cinematic Marathi Thumbnail',
    image: 'images/thumb-suresh-bhau.jpg',
    tools: ['Adobe Photoshop'],
    objective: 'Design a cinematic, dramatic thumbnail for a Marathi-language YouTube video with a film/investigation narrative.',
    process: 'Composed a dark atmospheric background using a medieval fortress under moonlight with ember particles. Performed professional subject cutout and compositing. Designed custom Marathi shield typography with metallic texture. Added a dramatic red-cape motion element and fire particle effects.',
    result: 'A movie-poster quality Marathi thumbnail with professional subject compositing, custom type design and full cinematic atmosphere.',
    color: '#dc2626',
  },
  {
    id: 6, category: 'youtube', categoryLabel: 'YouTube Design',
    title: 'Goa Trip — Budget Travel Vlog Thumbnail',
    image: 'images/thumb-goa-trip.jpg',
    tools: ['Adobe Photoshop'],
    objective: 'Design a bright, inviting and energetic YouTube thumbnail for a Goa budget travel vlog.',
    process: 'Selected a vibrant outdoor travel photo with beach, palm trees and yellow scooter. Applied bold "GOA TRIP" display typography with handwritten "Budget Travel Vlog" subtitle in pink. Added directional signpost props and a personal handwritten element for character.',
    result: 'A colourful, high-energy travel thumbnail communicating destination, mood and budget-friendly vibe in a single glance.',
    color: '#10b981',
  },
  {
    id: 7, category: 'uiux', categoryLabel: 'UI/UX Design',
    title: 'Learno — Online Learning Platform UI',
    image: 'images/project-learno-uiux.jpg',
    tools: ['Figma'],
    objective: 'Design a clean, modern landing page for an online learning platform aimed at students and working professionals.',
    process: 'Designed a full landing page with hero, stats bar (50K+ Learners, 200+ Instructors, 4.8 stars), four feature cards, and a popular courses grid with ratings, instructor names and bookmark actions. Used blue as the primary CTA colour for trust.',
    result: 'A complete, production-ready UI design with responsive layout, course cards, navigation and strong social proof elements.',
    color: '#3b82f6',
  },
  {
    id: 8, category: 'uiux', categoryLabel: 'UI/UX Design',
    title: 'FilmCraft Studio — Creative Agency Website UI',
    image: 'images/project-filmcraft-uiux.jpg',
    tools: ['Figma'],
    objective: 'Design a premium dark-themed website for a creative video production studio targeting modern brands.',
    process: 'Used deep dark background with purple/violet accents and cinematic hero imagery of a creator at their editing setup. Designed service grid (Video Production, Graphic Design, Social Media Content, Editing and VFX), featured work cards with play overlays and strong typographic contrast.',
    result: 'A premium dark creative agency website UI — hero, services, featured work and contact — fully ready for developer handoff.',
    color: '#7c3aed',
  },
  {
    id: 9, category: 'uiux', categoryLabel: 'UI/UX Design',
    title: 'TechZone — E-Commerce Gadget Store UI',
    image: 'images/project-techzone-uiux.jpg',
    tools: ['Figma'],
    objective: 'Design a complete e-commerce website UI for a tech gadgets store with product discovery and promotional sections.',
    process: 'Designed hero with boAt headphone product showcase, category icon row (8 categories), flash sale and trending banners, and a best-selling products grid with pricing, discount badges, ratings and wishlist functionality.',
    result: 'A comprehensive e-commerce UI spanning 6+ page sections with a complete product browsing and purchasing experience.',
    color: '#8b5cf6',
  },
  {
    id: 10, category: 'uiux', categoryLabel: 'UI/UX Design',
    title: 'Brewly — Premium Coffee Brand Website UI',
    image: 'images/project-brewly-uiux.jpg',
    tools: ['Figma'],
    objective: 'Design a warm, premium website for a specialty coffee brand focused on storytelling and product showcase.',
    process: 'Used warm earthy tones (cream, dark brown, forest green) to evoke artisan quality. Hero with lifestyle photography, trust-bar strip, bestsellers product grid (Classic Roast, Vanilla Bliss, Dark Horizon, Hazelnut Dream) and a brand story section.',
    result: 'A visually rich premium coffee brand website with strong artisan lifestyle identity across hero, products and brand story.',
    color: '#92400e',
  },
  {
    id: 11, category: 'branding', categoryLabel: 'Branding',
    title: 'INVENTOMANIA — Event Branding & Creative Design',
    image: 'images/inventomania-campus-experia.jpg',
    image2: 'images/inventomania-matlab-mavericks.jpg',
    tools: ['Adobe Photoshop', 'Canva', 'Illustrator'],
    objective: 'Create complete promotional event creatives for INVENTOMANIA-11, a college technical fest at St. Vincent Pallotti College of Engineering & Technology, Nagpur.',
    process: 'Designed individual event posters for each sub-event with a consistent nautical/adventure visual theme — dark stormy sea, tall ships and dramatic lighting. Each poster carries the INVENTOMANIA-11 branding, event-specific identity, registration info, QR code and coordinator details.',
    result: 'A full set of branded event creatives used across physical and digital promotion — Campus Experia (GD round) and MATLAB Mavericks (technical event) posters delivered with complete event information.',
    color: '#7c3aed',
  },
  {
    id: 12, category: 'video', categoryLabel: 'Video Editing',
    title: 'Cute Little Girl Birthday Video Editing',
    image: 'https://img.youtube.com/vi/6DfVc12iWgY/hqdefault.jpg',
    youtubeId: '6DfVc12iWgY',
    videoUrl: 'https://youtu.be/6DfVc12iWgY?si=kP_zfap-7N_Zmwtj',
    tools: ['CapCut', 'Adobe Premiere Pro', 'After Effects'],
    objective: 'Create a vibrant, high-energy birthday video edit with smooth light leak transitions, custom typography and upbeat soundtrack sync.',
    process: 'Selected high-quality clips, synchronized cuts to beat drops, applied soft skin color grading, light particle overlays and animated birthday typography graphics.',
    result: 'A high-engagement birthday video edit with smooth rhythmic pacing and vibrant emotional appeal.',
    color: '#ef4444',
  },
  {
    id: 13, category: 'video', categoryLabel: 'Video Editing',
    title: 'Happy Birthday Video Motion Background',
    image: 'https://img.youtube.com/vi/2dcN39ZYAxo/hqdefault.jpg',
    youtubeId: '2dcN39ZYAxo',
    videoUrl: 'https://youtu.be/2dcN39ZYAxo?si=Zaitr7BwISs-kN6J',
    tools: ['After Effects', 'Premiere Pro'],
    objective: 'Design a festive motion graphics video background template for video editors and event videographers.',
    process: 'Built 3D camera pan with glowing golden sparkle emitters, floating festive ribbons, bokeh lighting and glowing 3D text animations in After Effects.',
    result: 'A seamless, premium motion background loop ready for high-resolution video production and event screens.',
    color: '#a855f7',
  },
  {
    id: 14, category: 'video', categoryLabel: 'Video Editing',
    title: 'Gose Dam Bhandara Pauni Water Sight — Travel & Cinematic Reel',
    image: 'https://img.youtube.com/vi/JLtaOS0UBQw/hqdefault.jpg',
    youtubeId: 'JLtaOS0UBQw',
    videoUrl: 'https://youtu.be/JLtaOS0UBQw?si=Bz-upBL6DO6E5O1h',
    tools: ['Premiere Pro', 'CapCut', 'DaVinci Resolve'],
    objective: 'Edit an atmospheric, cinematic travel reel showcasing the serene beauty of Gose Dam, Bhandara and Pauni water sight.',
    process: 'Color graded water shots with rich teal & amber tones, added smooth speed ramping on river waves, and mixed atmospheric nature sound effects.',
    result: 'A breathtaking cinematic travel reel that captivates viewers with aesthetic visuals and immersive sound design.',
    color: '#06b6d4',
  },
];
(function initPortfolio() {
  const grid = $('#portfolioGrid');
  const filters = $$('.pf-btn');
  const modal = $('#portfolioModal');
  const modalBody = $('#modalBody');
  const modalClose = $('#modalClose');
  const modalBackdrop = $('#modalBackdrop');

  function createCard(item) {
    const card = document.createElement('div');
    card.className = 'portfolio-card tilt-card';
    card.dataset.category = item.category;

    const imageHTML = item.image
      ? `<img src="${item.image}" alt="${item.title}" class="pc-real-img" loading="lazy" />`
      : `<div class="placeholder-img">
          <div class="placeholder-inner">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="8" stroke="${item.color}" stroke-width="2"/>
              <path d="M4 32l12-12 8 8 6-6 14 14" stroke="${item.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="16" cy="16" r="4" stroke="#06b6d4" stroke-width="2"/>
            </svg>
            <span>${item.categoryLabel}</span>
            <span class="upload-note">Upload your work</span>
          </div>
        </div>`;

    card.innerHTML = `
      <div class="pc-3d-glare"></div>
      <div class="pc-image">
        ${imageHTML}
        <div class="pc-overlay">
          <div class="pc-overlay-text">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View 3D Project
          </div>
        </div>
      </div>
      <div class="pc-info">
        <div class="pc-category">${item.categoryLabel}</div>
        <div class="pc-title">${item.title}</div>
        <div class="pc-tools">
          ${item.tools.map(t => `<span class="pc-tool">${t}</span>`).join('')}
        </div>
      </div>
    `;
    card.addEventListener('click', () => openModal(item));
    return card;
  }

  function openModal(item) {
    let mediaHTML = '';
    if (item.youtubeId) {
      mediaHTML = `<div class="modal-video-wrap">
        <iframe src="https://www.youtube.com/embed/${item.youtubeId}?autoplay=1" title="${item.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>`;
    } else {
      const img1HTML = item.image
        ? `<div class="modal-real-img-wrap"><img src="${item.image}" alt="${item.title}" class="modal-real-img" /></div>`
        : '';
      const img2HTML = item.image2
        ? `<div class="modal-real-img-wrap" style="margin-top: 16px;"><img src="${item.image2}" alt="${item.title} - Poster 2" class="modal-real-img" /></div>`
        : '';
      mediaHTML = img1HTML + img2HTML;
    }

    const videoCtaHTML = item.videoUrl
      ? `<div style="margin-top: 24px;">
          <a href="${item.videoUrl}" target="_blank" class="btn-primary magnetic" data-magnetic style="display: inline-flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <span>Watch Full Video on YouTube</span>
          </a>
        </div>`
      : '';

    modalBody.innerHTML = `
      ${mediaHTML}
      <div class="modal-cat">${item.categoryLabel}</div>
      <div class="modal-title">${item.title}</div>
      <div class="modal-section-title">Design Objective</div>
      <p class="modal-text">${item.objective}</p>
      <div class="modal-section-title">Creative Process</div>
      <p class="modal-text">${item.process}</p>
      <div class="modal-section-title">Final Result</div>
      <p class="modal-text">${item.result}</p>
      <div class="modal-section-title">Tools Used</div>
      <div class="modal-tools">
        ${item.tools.map(t => `<span class="modal-tool">${t}</span>`).join('')}
      </div>
      ${videoCtaHTML}
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Render all
  portfolioData.forEach(item => {
    const card = createCard(item);
    grid.appendChild(card);
  });

  // Re-init advanced 3D tilt for cards
  $$('.portfolio-card').forEach(card => {
    const glare = card.querySelector('.pc-3d-glare');
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * -14;
      const tiltY = ((x - cx) / cx) * 14;
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;

      gsap.to(card, {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
        scale: 1.03,
        duration: 0.3,
        ease: 'power2.out'
      });

      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.28) 0%, rgba(167,139,250,0.15) 35%, transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
      if (glare) {
        glare.style.opacity = '0';
      }
    });
  });

  // 3D Filter
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const cards = $$('.portfolio-card', grid);
      cards.forEach((card, i) => {
        const show = filter === 'all' || card.dataset.category === filter;
        if (show) {
          card.style.display = 'block';
          gsap.fromTo(card,
            { opacity: 0, scale: 0.8, rotateX: -20, rotateY: 15, z: -100 },
            { opacity: 1, scale: 1, rotateX: 0, rotateY: 0, z: 0, duration: 0.5, delay: i * 0.05, ease: 'back.out(1.4)' }
          );
          card.style.pointerEvents = '';
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.8,
            rotateX: 20,
            rotateY: -15,
            duration: 0.3,
            onComplete: () => { card.style.display = 'none'; }
          });
          card.style.pointerEvents = 'none';
        }
      });
    });
  });

  // Animate cards in with 3D perspective
  gsap.fromTo($$('.portfolio-card'),
    { opacity: 0, y: 50, rotateX: -25, transformPerspective: 1000 },
    { opacity: 1, y: 0, rotateX: 0, stagger: 0.07, duration: 0.8, ease: 'back.out(1.2)', delay: 0.3 }
  );
})();

// ════════════════════════════════════════════════════════════════
//  10. FEATURED PROJECT — DRAG SCROLL GALLERY
// ════════════════════════════════════════════════════════════════
(function initFeaturedGallery() {
  const track = $('#featuredTrack');
  if (!track) return;

  let isDown = false;
  let startX, scrollLeft;

  track.addEventListener('mousedown', e => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  // Auto-scroll animation
  gsap.to(track, {
    scrollLeft: track.scrollWidth - track.clientWidth,
    duration: 20, ease: 'none', repeat: -1, yoyo: true,
    paused: false,
  });
  track.addEventListener('mouseenter', () => gsap.globalTimeline.pause());
  track.addEventListener('mouseleave', () => gsap.globalTimeline.resume());
})();

// ════════════════════════════════════════════════════════════════
//  11. NAVBAR SMOOTH SCROLL
// ════════════════════════════════════════════════════════════════
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = $(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ════════════════════════════════════════════════════════════════
//  12. CONTACT FORM
// ════════════════════════════════════════════════════════════════
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = $('#submitBtn');
  const text = $('#submitText');
  const success = $('#formSuccess');

  gsap.to(btn, { scale: 0.97, duration: 0.1 });
  text.textContent = 'Sending...';

  setTimeout(() => {
    gsap.to(btn, { scale: 1, duration: 0.2 });
    text.textContent = 'Send Message';
    success.classList.add('show');
    gsap.fromTo(success, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
    e.target.reset();
    setTimeout(() => {
      gsap.to(success, {
        opacity: 0, duration: 0.4,
        onComplete: () => success.classList.remove('show')
      });
    }, 4000);
  }, 1200);
}

// ════════════════════════════════════════════════════════════════
//  13. GSAP SCROLL-TRIGGERED PARALLAX (Process + Hero)
// ════════════════════════════════════════════════════════════════
(function initScrollEffects() {
  // Process steps stagger
  gsap.fromTo('.process-step',
    { opacity: 0, x: -30 },
    {
      opacity: 1, x: 0, stagger: 0.15, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.process-timeline', start: 'top 75%', end: 'bottom 25%' }
    }
  );

  // Hero scroll fade
  gsap.to('.hero-content', {
    y: -80, opacity: 0.3,
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top',
      scrub: true,
    }
  });

  // Freelance section bg text parallax
  gsap.to('.freelance-bg-text', {
    y: -100,
    scrollTrigger: {
      trigger: '.freelance-section', start: 'top bottom', end: 'bottom top',
      scrub: true,
    }
  });

  // Featured section text parallax
  gsap.to('.featured-section::before', {
    y: -50,
    scrollTrigger: {
      trigger: '.featured-section', start: 'top bottom', end: 'bottom top',
      scrub: true,
    }
  });
})();

// ════════════════════════════════════════════════════════════════
//  14. HERO PARTICLES (CSS canvas sparkles)
// ════════════════════════════════════════════════════════════════
(function initHeroParticles() {
  const container = $('#heroParticles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      background: ${Math.random() > 0.5 ? 'rgba(124,58,237,0.6)' : 'rgba(6,182,212,0.5)'};
      pointer-events: none;
    `;
    container.appendChild(dot);

    gsap.to(dot, {
      y: (Math.random() - 0.5) * 100,
      x: (Math.random() - 0.5) * 60,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 5 + 4,
      ease: 'sine.inOut',
      repeat: -1, yoyo: true,
      delay: Math.random() * 4,
    });
  }
})();

// ════════════════════════════════════════════════════════════════
//  15. ACTIVE NAV HIGHLIGHT ON SCROLL
// ════════════════════════════════════════════════════════════════
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = navLinks.find(l => l.getAttribute('href') === `#${entry.target.id}`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ════════════════════════════════════════════════════════════════
//  16. GSAP-POWERED WHY SECTION ENTRY
// ════════════════════════════════════════════════════════════════
gsap.fromTo('.why-card',
  { opacity: 0, y: 40 },
  {
    opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out',
    scrollTrigger: { trigger: '.why-grid', start: 'top 80%' }
  }
);

// ════════════════════════════════════════════════════════════════
//  17. TOOLS SECTION — STAGGERED ENTRY
// ════════════════════════════════════════════════════════════════
gsap.fromTo('.tool-card',
  { opacity: 0, scale: 0.85, y: 30 },
  {
    opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.tools-grid', start: 'top 80%' }
  }
);

// ════════════════════════════════════════════════════════════════
//  18. SERVICE CARDS ENTRY
// ════════════════════════════════════════════════════════════════
gsap.fromTo('.service-card',
  { opacity: 0, y: 50 },
  {
    opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.services-grid', start: 'top 80%' }
  }
);

// ════════════════════════════════════════════════════════════════
//  19. VIDEO PLAYER — PULSE ON ENTER
// ════════════════════════════════════════════════════════════════
gsap.fromTo('#videoPlayerCard',
  { opacity: 0, scale: 0.95 },
  {
    opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '#videoPlayerCard', start: 'top 80%' }
  }
);

// ════════════════════════════════════════════════════════════════
//  20. FOOTER REVEAL
// ════════════════════════════════════════════════════════════════
gsap.fromTo('.footer-brand, .footer-links-col',
  { opacity: 0, y: 30 },
  {
    opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
    scrollTrigger: { trigger: '.footer', start: 'top 90%' }
  }
);

console.log(
  '%cANTARIKSH SAWARBANDHE PORTFOLIO',
  'color: #a78bfa; font-size: 14px; font-weight: bold; letter-spacing: 2px;'
);
console.log(
  '%cGraphic Designer • Visual Designer • Video Editor • Freelancer',
  'color: #06b6d4; font-size: 11px;'
);

// ════════════════════════════════════════════════════════════════
//  21. INTERACTIVE YOUTUBE VIDEO SECTION
// ════════════════════════════════════════════════════════════════
(function initVideoSection() {
  const mainVideoFrameWrap = document.getElementById('mainVideoFrameWrap');
  const mainVideoPlayBtn = document.getElementById('mainVideoPlayBtn');
  const videoCards = document.querySelectorAll('.video-item-card');

  if (!mainVideoFrameWrap) return;

  function loadYouTubeVideo(videoId, title) {
    mainVideoFrameWrap.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="${title || 'YouTube Video'}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>
    `;
  }

  if (mainVideoPlayBtn) {
    mainVideoPlayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoId = mainVideoPlayBtn.dataset.videoId || '6DfVc12iWgY';
      loadYouTubeVideo(videoId, 'Featured Video Editing Work');
    });
  }

  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      videoCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const videoId = card.dataset.videoId;
      const title = card.dataset.title;
      loadYouTubeVideo(videoId, title);
    });
  });
})();
