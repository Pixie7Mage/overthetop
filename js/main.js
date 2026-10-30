/**
 * MAIN KINETIC ORCHESTRATOR
 * Bootstraps smooth scrolling (Lenis), GSAP ScrollTrigger timelines,
 * Three.js WebGL scene, physics cursor, and audio engine.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Custom Physics Cursor
  const cursor = new window.KineticCursor();

  // 2. Initialize Three.js WebGL Scene
  const scene = new window.KineticScene('kinetic-webgl-canvas');

  // 3. Initialize Act Interaction Manager
  const actManager = new window.KineticActManager();
  actManager.setScene(scene);

  // 4. Initialize Lenis Inertial Smooth Scrolling
  let lenis = null;
  if (typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger if present
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    }
  }

  // 5. Scroll Progress Conduit Tracker (Glowing rail tracker)
  const railProgressLine = document.getElementById('rail-progress-line');
  const actNavItems = document.querySelectorAll('.nav-act-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

    if (railProgressLine) {
      railProgressLine.style.height = `${progress * 100}%`;
    }

    // Highlight active act in navigation
    const sections = [
      { id: 'act-1-hero', act: 1 },
      { id: 'act-2-manifesto', act: 2 },
      { id: 'act-3-portfolio', act: 3 },
      { id: 'act-4-engines', act: 4 },
      { id: 'act-5-ignition', act: 5 }
    ];

    let currentAct = 1;
    sections.forEach(({ id, act }) => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
          currentAct = act;
        }
      }
    });

    actNavItems.forEach((navItem) => {
      const targetAct = parseInt(navItem.getAttribute('data-act'), 10);
      navItem.classList.toggle('active', targetAct === currentAct);
    });
  }, { passive: true });

  // 6. Smooth Scroll on Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (window.kineticAudio) window.kineticAudio.playClick(1.2);
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -30 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 7. Kinetic Counter Rolling Animation on scroll
  const initCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseFloat(el.getAttribute('data-counter'));
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const isDecimal = targetNum % 1 !== 0;

          let start = 0;
          const duration = 1400;
          const startTime = performance.now();

          const animateNum = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = start + (targetNum - start) * ease;
            el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(animateNum);
            }
          };

          requestAnimationFrame(animateNum);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.25 });

    counters.forEach((c) => observer.observe(c));
  };

  initCounters();

  // Print warm industrial greeting in devtools console
  console.log(
    '%c [ ANTIGRAV // KINETIC AGENCY ENGINE v2.0 ] \n' +
    '  Visual Aesthetic: Warm Industrial (#141416 / #F4EFEA / #FF552E / #FFB020)\n' +
    '  Physics Core: WebGL GLSL + Inertia + Procedural Web Audio Engine\n' +
    '  Act I: Hero Shatter  |  Act II: Scale Dial  |  Act III: Split Stream\n' +
    '  Act IV: Engines       |  Act V: Ignition Desk\n',
    'background: #141416; color: #FF552E; font-size: 12px; font-weight: bold; padding: 10px; border-left: 3px solid #FFB020;'
  );
});
