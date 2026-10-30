/**
 * KINETIC ACT INTERACTION MANAGER
 * Orchestrates Act I to Act V interactive physics:
 * - Act I: Hero shatter physics & force application
 * - Act II: Rotational Scale Dial & wireframe morphs
 * - Act III: Elastic Friction vs. Flow Split-Stream & Case Study Deep-Dives
 * - Act IV: Three Kinetic Engines (Compass Gyro, Forge Physics Blocks, Thruster Accelerator)
 * - Act V: Natural-language sentence builder & Brushed Brass Ignition Lever
 */

class KineticActManager {
  constructor() {
    this.audio = window.kineticAudio;
    this.scene = null; // Bound when Three scene is ready
    this.currentDialStage = 0;
    this.dialData = [
      {
        tag: 'STAGE 01 // BREAKING INERTIA',
        target: 'Local Founders & Quiet Ideas',
        headline: 'Taking the first step is the hardest part. We build your initial traction.',
        subhead: 'Strategy that scales to local budgets. Transforming an overlooked street corner or quiet craft into a beloved neighborhood institution.',
        mass: '120 kg',
        friction: 'High Static',
        velocity: '1.2 Mach',
        trajectory: 'Local Foothold'
      },
      {
        tag: 'STAGE 02 // BUILDING MASS',
        target: 'Growing Businesses & Creators',
        headline: 'Consistency creates gravity. We make people stick around.',
        subhead: 'Turning sporadic sales into an engaged ecosystem. Floating audiences magnetically lock onto your core story and become loyal advocates.',
        mass: '1,450 kg',
        friction: 'Moderate Dynamic',
        velocity: '4.8 Mach',
        trajectory: 'Audience Gravity'
      },
      {
        tag: 'STAGE 03 // ESCAPE VELOCITY',
        target: 'Scaling Startups & Category Challengers',
        headline: "Scale isn't luck; it's calculated trajectory.",
        subhead: 'Cutting through saturated category noise with unstoppable speed. Outmaneuvering legacy incumbents with superior creative physics.',
        mass: '18,200 kg',
        friction: 'Near Zero',
        velocity: '11.4 Mach',
        trajectory: 'Market Dominance'
      },
      {
        tag: 'STAGE 04 // PLANETARY ORBIT',
        target: 'Industry Pillars & Cultural Icons',
        headline: 'Unstoppable cultural momentum across global nodes.',
        subhead: 'Architecting multi-city presence, global brand narratives, and enduring emotional recall that defines the cultural zeitgeist.',
        mass: '240,000 kg',
        friction: 'Vacuum Flow',
        velocity: '28.0 Mach',
        trajectory: 'Planetary Orbit'
      }
    ];

    this.caseStudies = [
      {
        id: 'maison-rustique',
        title: 'Maison Rustique',
        category: 'Artisanal Bakery & Heritage Pantry',
        frictionLabel: 'QUIET WEEKENDS & 0 DIGITAL FOOTPRINT',
        flowLabel: '4-WEEK BREAD WAITLIST & CULT PHENOMENON',
        metrics: [
          { label: 'Weekend Foot Traffic', value: '+340%', num: 340, unit: '%' },
          { label: 'Weekly Waitlist', value: '4 Weeks', num: 4, unit: ' Wks' },
          { label: 'Social Engagement', value: '8.4x', num: 8.4, unit: 'x' }
        ],
        frictionDesc: 'Master bakers baking world-class sourdough on a sleepy residential street, completely overshadowed by commercial supermarket franchises.',
        flowDesc: 'Engineered an authentic documentary sensory campaign: warm sourdough crackle ASMR, morning queue hype, and an editorial physical packaging system.',
        clientQuote: '"Antigravity didn’t just design our branding—they created a physical gravity well that pulled half the city to our doorstep."'
      },
      {
        id: 'kroma-os',
        title: 'Kroma OS',
        category: 'Next-Gen Spatial Computing SaaS',
        frictionLabel: 'STEALTH LAB ZERO & COMPLEX TECH JARGON',
        flowLabel: '$4.2M PIPELINE & 82K WAITLIST SIGNUPS',
        metrics: [
          { label: 'Qualified Pipeline', value: '$4.2M', num: 4.2, unit: 'M' },
          { label: 'Waitlist Signups', value: '82,400', num: 82400, unit: '' },
          { label: 'Demo Conversion', value: '41.2%', num: 41.2, unit: '%' }
        ],
        frictionDesc: 'Deep-tech spatial compute engineers unable to explain their revolutionary OS without 40-page whitepapers and sterile dev diagrams.',
        flowDesc: 'Stripped away corporate bloat into a visceral kinetic web demo with live physics simulations, interactive spatial prisms, and high-octane 3D reels.',
        clientQuote: '"Our seed round closed 3 weeks early because investors could immediately touch the future on our website."'
      },
      {
        id: 'solaris-mobility',
        title: 'Solaris Mobility',
        category: 'Clean Electric Urban Cargo',
        frictionLabel: 'UNKNOWN PROTOTYPE IN CROWDED HARDWARE SECTOR',
        flowLabel: '14 EUROPEAN METROS & +420% B2B FLEET DEALS',
        metrics: [
          { label: 'B2B Pre-Orders', value: '+420%', num: 420, unit: '%' },
          { label: 'Active Cities', value: '14 Metros', num: 14, unit: ' Cities' },
          { label: 'Cost / Acquisition', value: '-68%', num: 68, unit: '% Down' }
        ],
        frictionDesc: 'Innovative solar-assisted cargo bikes competing against diesel logistics giants with zero market credibility.',
        flowDesc: 'Positioned them as the silent revolution of clean cities through raw street cinematics, carbon offset meters, and rapid municipal B2B roadshows.',
        clientQuote: '"They turned a piece of industrial hardware into an urgent cultural movement for cleaner cities."'
      },
      {
        id: 'aura-audio',
        title: 'Aura Audio',
        category: 'High-Fidelity Analog Studio Monitors',
        frictionLabel: 'HIDDEN AUDIOPHILE NICHE WITH ZERO HYPE',
        flowLabel: 'SOLD OUT IN 6 MINUTES & 1.8M REEL REACH',
        metrics: [
          { label: 'First Batch Sellout', value: '6 Mins', num: 6, unit: ' Mins' },
          { label: 'Creator Reach', value: '1.8M', num: 1.8, unit: 'M' },
          { label: 'Gross Margin Growth', value: '+52%', num: 52, unit: '%' }
        ],
        frictionDesc: 'Handcrafted walnut acoustics loved by five local mastering engineers, entirely invisible to modern electronic music producers.',
        flowDesc: 'Curated intimate blind-test sessions with Grammy-nominated producers and deployed tactile tactile unboxing sequences that set audio TikTok ablaze.',
        clientQuote: '"We were prepared to sell 50 units this year. We sold 500 units in the first ten minutes."'
      }
    ];

    this.init();
  }

  init() {
    this.setupActI();
    this.setupActII();
    this.setupActIII();
    this.setupActIV();
    this.setupActV();
    this.setupModal();
    this.setupDiagnosticHUD();
  }

  setScene(scene) {
    this.scene = scene;
  }

  // ==========================================
  // ACT I: Hero Rest State to Full Velocity
  // ==========================================
  setupActI() {
    const shatterBtn = document.getElementById('hero-shatter-trigger');
    const heroSection = document.getElementById('act-1-hero');

    const handleShatter = () => {
      if (this.scene) {
        this.scene.triggerShatter();
      }
      if (heroSection) {
        heroSection.classList.add('shattered');
      }
      const railStatus = document.getElementById('hud-rail-status');
      if (railStatus) {
        railStatus.textContent = 'ONLINE // ACTIVE';
        railStatus.classList.add('active');
      }
    };

    if (shatterBtn) {
      shatterBtn.addEventListener('click', () => {
        if (this.audio) this.audio.playClick(1.2);
        handleShatter();
      });
    }

    // First scroll down past 150px also shatters the prism
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
      if (!scrollTriggered && window.scrollY > 120) {
        scrollTriggered = true;
        handleShatter();
      }
    }, { passive: true });
  }

  // ==========================================
  // ACT II: The Scale Dial (Universal Manifesto)
  // ==========================================
  setupActII() {
    const dialHandle = document.getElementById('dial-rotator');
    const stagePills = document.querySelectorAll('.dial-stage-pill');

    const updateStage = (stageIdx) => {
      this.currentDialStage = stageIdx;
      if (this.scene) this.scene.setScaleStage(stageIdx);
      if (this.audio) this.audio.playDetent(stageIdx);

      // Update pill active classes
      stagePills.forEach((p, idx) => {
        p.classList.toggle('active', idx === stageIdx);
      });

      // Rotate dial rotator visually
      if (dialHandle) {
        const degrees = stageIdx * 90;
        dialHandle.style.transform = `rotate(${degrees}deg)`;
      }

      // Update text data
      const data = this.dialData[stageIdx];
      const tagEl = document.getElementById('dial-tag');
      const targetEl = document.getElementById('dial-target');
      const headEl = document.getElementById('dial-headline');
      const subEl = document.getElementById('dial-subhead');
      const massEl = document.getElementById('spec-mass');
      const frictionEl = document.getElementById('spec-friction');
      const veloEl = document.getElementById('spec-velocity');
      const trajEl = document.getElementById('spec-trajectory');

      if (tagEl) tagEl.textContent = data.tag;
      if (targetEl) targetEl.textContent = data.target;
      if (headEl) headEl.textContent = data.headline;
      if (subEl) subEl.textContent = data.subhead;
      if (massEl) massEl.textContent = data.mass;
      if (frictionEl) frictionEl.textContent = data.friction;
      if (veloEl) veloEl.textContent = data.velocity;
      if (trajEl) trajEl.textContent = data.trajectory;

      // Update 3D Hologram wireframe view
      if (this.hologramStages) {
        this.hologramStages.forEach((grp, idx) => {
          grp.visible = (idx === stageIdx);
          if (idx === stageIdx) {
            grp.scale.set(0.65, 0.65, 0.65);
            if (window.gsap) {
              window.gsap.to(grp.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(1.5)' });
            }
          }
        });
        const badgeEl = document.getElementById('hologram-stage-badge');
        const labels = [
          '01 // STOREFRONT CANOPY (LOCAL CRAFT)',
          '02 // ISOMETRIC APP INTERFACE (CREATOR)',
          '03 // SUPERSONIC ARROW (SCALING STARTUP)',
          '04 // PLANETARY ORBIT (INDUSTRY PILLAR)'
        ];
        if (badgeEl) badgeEl.textContent = labels[stageIdx];
      }
    };

    // Initialize 3D Hologram Canvas
    this.setupHologram3DCanvas();

    // Stage pills click
    stagePills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const stage = parseInt(pill.getAttribute('data-stage'), 10);
        updateStage(stage);
      });
    });

    // Rotational Drag Interaction on the Dial Wheel
    if (dialHandle) {
      let isDragging = false;
      let startAngle = 0;
      let currentRotation = 0;

      const getAngle = (e) => {
        const rect = dialHandle.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
      };

      const onStart = (e) => {
        isDragging = true;
        startAngle = getAngle(e) - currentRotation;
        if (this.audio) this.audio.playClick(0.9);
      };

      const onMove = (e) => {
        if (!isDragging) return;
        const angle = getAngle(e) - startAngle;
        currentRotation = angle;
        dialHandle.style.transform = `rotate(${angle}deg)`;

        // Calculate nearest stage quadrant (0, 90, 180, 270)
        let normalized = (angle % 360 + 360) % 360;
        let stage = Math.round(normalized / 90) % 4;
        if (stage !== this.currentDialStage) {
          updateStage(stage);
        }
      };

      const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        // Snap to clean 90-degree quadrant with spring
        const snapDeg = this.currentDialStage * 90;
        currentRotation = snapDeg;
        dialHandle.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        dialHandle.style.transform = `rotate(${snapDeg}deg)`;
        setTimeout(() => {
          dialHandle.style.transition = '';
        }, 400);
      };

      dialHandle.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);

      dialHandle.addEventListener('touchstart', onStart, { passive: true });
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    }
  }

  // Mini Hologram 3D Canvas Renderer for the Scale Dial
  setupHologram3DCanvas() {
    const canvas = document.getElementById('dial-wireframe-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const width = 280;
    const height = 180;

    const hScene = new THREE.Scene();
    const hCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    hCamera.position.set(0, 0, 6.8);

    const hRenderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    hRenderer.setSize(width, height);
    hRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Stage 0: Storefront Canopy / Artisan Workshop
    const stage0Group = new THREE.Group();
    const canopyGeo = new THREE.ConeGeometry(1.6, 1.0, 6, 2, true);
    const canopyMat = new THREE.MeshBasicMaterial({ color: 0xFFB020, wireframe: true });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = 0.4;
    stage0Group.add(canopy);

    const baseGeo = new THREE.BoxGeometry(1.8, 1.1, 1.2, 3, 2, 2);
    const baseMat = new THREE.MeshBasicMaterial({ color: 0xFF552E, wireframe: true, transparent: true, opacity: 0.6 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.7;
    stage0Group.add(baseMesh);

    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xF4EFEA }));
    lantern.position.y = -0.3;
    stage0Group.add(lantern);
    hScene.add(stage0Group);

    // Stage 1: Digital Creator App / Isometric Cards & Nodes
    const stage1Group = new THREE.Group();
    stage1Group.visible = false;
    const card1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 0.15, 3, 2, 1), new THREE.MeshBasicMaterial({ color: 0xFF552E, wireframe: true }));
    stage1Group.add(card1);
    const nodeGeo = new THREE.SphereGeometry(0.1, 6, 6);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xFFB020 });
    for (let i = 0; i < 4; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set((i % 2 - 0.5) * 1.4, (Math.floor(i / 2) - 0.5) * 0.9, 0.2);
      stage1Group.add(node);
    }
    hScene.add(stage1Group);

    // Stage 2: Scaling Startup / Aerodynamic Supersonic Arrow Wedge
    const stage2Group = new THREE.Group();
    stage2Group.visible = false;
    const wedgeGeo = new THREE.CylinderGeometry(0.05, 1.2, 2.4, 4, 3);
    wedgeGeo.rotateX(Math.PI / 2);
    const wedgeMat = new THREE.MeshBasicMaterial({ color: 0xF4EFEA, wireframe: true });
    const wedge = new THREE.Mesh(wedgeGeo, wedgeMat);
    stage2Group.add(wedge);
    const ringGeo = new THREE.TorusGeometry(1.1, 0.03, 6, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xFF552E, wireframe: true });
    const trailRing = new THREE.Mesh(ringGeo, ringMat);
    trailRing.position.z = -1.0;
    stage2Group.add(trailRing);
    hScene.add(stage2Group);

    // Stage 3: Industry Pillar / Multi-Ring Orbital Constellation
    const stage3Group = new THREE.Group();
    stage3Group.visible = false;
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 12), new THREE.MeshBasicMaterial({ color: 0xFFB020, wireframe: true }));
    stage3Group.add(globe);
    const orbit1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.025, 6, 36), new THREE.MeshBasicMaterial({ color: 0xFF552E }));
    orbit1.rotation.x = Math.PI / 3;
    stage3Group.add(orbit1);
    const orbit2 = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.025, 6, 36), new THREE.MeshBasicMaterial({ color: 0xF4EFEA }));
    orbit2.rotation.y = Math.PI / 4;
    stage3Group.add(orbit2);
    hScene.add(stage3Group);

    this.hologramStages = [stage0Group, stage1Group, stage2Group, stage3Group];

    const animateHologram = () => {
      requestAnimationFrame(animateHologram);
      this.hologramStages.forEach((grp) => {
        if (grp.visible) {
          grp.rotation.y += 0.015;
          grp.rotation.x = 0.2 + Math.sin(Date.now() * 0.002) * 0.08;
        }
      });
      hRenderer.render(hScene, hCamera);
    };
    animateHologram();
  }

  // ==========================================
  // ACT III: The Collision Chamber (Portfolio)
  // ==========================================
  setupActIII() {
    const capsules = document.querySelectorAll('.case-capsule');

    capsules.forEach((capsule) => {
      const slider = capsule.querySelector('.capsule-slider');
      const divider = capsule.querySelector('.slider-divider');
      const frictionSide = capsule.querySelector('.capsule-friction');
      const flowSide = capsule.querySelector('.capsule-flow');
      let isDragging = false;

      // Magnetic 3D tilt on mousemove
      capsule.addEventListener('mousemove', (e) => {
        const rect = capsule.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        capsule.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.015, 1.015, 1.015)`;
      });

      capsule.addEventListener('mouseleave', () => {
        capsule.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
      });

      // Elastic Split-Slider Dragging
      if (slider && divider) {
        const setSplitPercent = (pct) => {
          pct = Math.max(10, Math.min(90, pct));
          divider.style.left = `${pct}%`;
          if (frictionSide) frictionSide.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
          if (flowSide) flowSide.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
        };

        const handleMove = (e) => {
          if (!isDragging) return;
          const rect = slider.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const pct = ((clientX - rect.left) / rect.width) * 100;
          setSplitPercent(pct);
        };

        const startDrag = (e) => {
          isDragging = true;
          if (this.audio) this.audio.playDetent(1);
        };

        const endDrag = () => {
          if (isDragging) {
            isDragging = false;
            if (this.audio) this.audio.playSpring();
          }
        };

        divider.addEventListener('mousedown', startDrag);
        divider.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: true });
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
      }

      // Open Modal on Card Click (when not dragging divider)
      const openTrigger = capsule.querySelector('.capsule-open-btn');
      if (openTrigger) {
        openTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const caseId = capsule.getAttribute('data-case-id');
          this.openCaseModal(caseId);
        });
      }
    });
  }

  // ==========================================
  // ACT IV: The Three Kinetic Engines
  // ==========================================
  setupActIV() {
    const tabs = document.querySelectorAll('.engine-tab-btn');
    const panels = document.querySelectorAll('.engine-panel');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.getAttribute('data-engine-idx'), 10);
        tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
        panels.forEach((p, i) => p.classList.toggle('active', i === idx));

        if (this.scene) this.scene.setEngineMode(idx);
        if (this.audio) this.audio.playClick(1 + idx * 0.2);
      });
    });

    // Engine 01 (Compass): Resonance Frequency Slider
    const freqSlider = document.getElementById('compass-freq-slider');
    const freqVal = document.getElementById('compass-freq-val');
    const resonanceStatus = document.getElementById('compass-resonance-status');

    if (freqSlider && freqVal) {
      freqSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        freqVal.textContent = `${val.toFixed(1)} Hz`;
        if (Math.abs(val - 432.0) < 5.0) {
          if (resonanceStatus) {
            resonanceStatus.textContent = 'TRUE RESONANCE LOCKED // 100% SIGNAL';
            resonanceStatus.classList.add('locked');
          }
          if (this.audio) this.audio.playThud(120, 0.2);
        } else {
          if (resonanceStatus) {
            resonanceStatus.textContent = 'SEARCHING FOR CARRIER FREQUENCY...';
            resonanceStatus.classList.remove('locked');
          }
        }
      });
    }

    // Engine 02 (The Forge): Interactive Physics Blocks Sandbox
    this.setupForgeSandbox();

    // Engine 03 (The Thruster): Throttle Acceleration Lever
    const throttleSlider = document.getElementById('thruster-throttle-slider');
    const throttleReadout = document.getElementById('thruster-speed-val');
    const conversionMeter = document.getElementById('thruster-conversion-val');

    if (throttleSlider) {
      throttleSlider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        if (throttleReadout) throttleReadout.textContent = `${pct}% THRUST`;
        if (conversionMeter) conversionMeter.textContent = `+${Math.round(pct * 3.8)}% CONVERSION`;
        if (this.audio && pct % 10 === 0) this.audio.playDetent(pct / 10);
      });
    }
  }

  // Interactive Forge Sandbox: Dropping & Flinging Physics Brand Blocks
  setupForgeSandbox() {
    const sandbox = document.getElementById('forge-physics-canvas');
    if (!sandbox) return;

    const blockLabels = [
      'VISUAL GRAVITY', 'TYPE ARCHITECTURE', '4K MOTION REELS',
      'CULTURAL HOOKS', 'UNAPOLOGETIC RAW', 'TACTILE EDITORIAL',
      'CONVERSION PSYCHOLOGY', 'SOUND ID'
    ];

    let blocks = [];
    const gravity = 0.42;

    const spawnBlock = (x, y, text) => {
      const el = document.createElement('div');
      el.className = 'forge-physics-block';
      el.textContent = text || blockLabels[Math.floor(Math.random() * blockLabels.length)];
      sandbox.appendChild(el);

      const blockObj = {
        el,
        x: x || sandbox.clientWidth / 2 + (Math.random() - 0.5) * 160,
        y: y || 20,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * -4,
        rot: (Math.random() - 0.5) * 30,
        vRot: (Math.random() - 0.5) * 3,
        width: 130,
        height: 38
      };
      blocks.push(blockObj);
      if (this.audio) this.audio.playClick(1.4);
    };

    // Spawn 5 initial blocks
    for (let i = 0; i < 5; i++) {
      spawnBlock(80 + i * 80, 20 + i * 25);
    }

    // Spawn on click inside sandbox
    sandbox.addEventListener('click', (e) => {
      const rect = sandbox.getBoundingClientRect();
      spawnBlock(e.clientX - rect.left - 65, e.clientY - rect.top - 20);
    });

    // Physics Loop for blocks
    const updateForgePhysics = () => {
      requestAnimationFrame(updateForgePhysics);
      const floorY = sandbox.clientHeight - 42;
      const wallW = sandbox.clientWidth;

      blocks.forEach((b) => {
        b.vy += gravity;
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.vRot;

        // Floor collision with elastic dampening
        if (b.y > floorY) {
          b.y = floorY;
          b.vy = -b.vy * 0.55; // bounce
          b.vx *= 0.85; // friction
          b.vRot *= 0.8;
        }

        // Wall collisions
        if (b.x < 10) {
          b.x = 10;
          b.vx = -b.vx * 0.6;
        } else if (b.x > wallW - b.width - 10) {
          b.x = wallW - b.width - 10;
          b.vx = -b.vx * 0.6;
        }

        b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.rot}deg)`;
      });
    };

    updateForgePhysics();
  }

  // ==========================================
  // ACT V: The Ignition Desk (Contact & CTA)
  // ==========================================
  setupActV() {
    // Conversational Sentence Builder Chips
    const identitySelect = document.getElementById('sentence-identity');
    const objectiveSelect = document.getElementById('sentence-objective');
    const timelineSelect = document.getElementById('sentence-timeline');

    [identitySelect, objectiveSelect, timelineSelect].forEach((select) => {
      if (select) {
        select.addEventListener('change', () => {
          if (this.audio) this.audio.playClick(1.1);
        });
      }
    });

    // Heavy Industrial Brushed-Brass Toggle Lever
    const leverHandle = document.getElementById('ignition-lever-handle');
    const leverTrack = document.getElementById('ignition-lever-track');
    const statusLight = document.getElementById('ignition-status-light');
    const receiptBox = document.getElementById('ignition-docket-output');
    const resetBtn = document.getElementById('ignition-reset-btn');
    let isFlipped = false;

    const fireIgnition = () => {
      if (isFlipped) return;
      isFlipped = true;

      // Lock lever visually down
      if (leverHandle) {
        leverHandle.classList.add('locked-down');
      }
      if (statusLight) {
        statusLight.classList.add('armed');
      }

      // Three.js launch particles
      if (this.scene) {
        this.scene.triggerIgnition();
      }

      // Audio launch surge
      if (this.audio) {
        this.audio.playIgnite();
      }

      // Generate Trajectory Docket receipt
      setTimeout(() => {
        const brand = (document.getElementById('brand-input')?.value || 'Your Venture').toUpperCase();
        const contact = document.getElementById('contact-input')?.value || 'signal@domain.com';
        const identity = identitySelect?.value || 'Fast-growing Startup';
        const objective = objectiveSelect?.value || 'Scale Sales & Cultural Gravity';
        const timeline = timelineSelect?.value || 'Immediate 30-Day Sprint';

        const docketHtml = `
          <div class="docket-header">
            <span class="docket-stamp">TRAJECTORY LOCKED // 9,800 N FORCE</span>
            <span class="docket-id">FLIGHT-${Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div class="docket-grid">
            <div><label>VENTURE:</label> <strong>${brand}</strong></div>
            <div><label>SIGNAL ADDR:</label> <strong>${contact}</strong></div>
            <div><label>PROFILE:</label> <span>${identity}</span></div>
            <div><label>OBJECTIVE:</label> <span>${objective}</span></div>
            <div><label>TIMELINE:</label> <span>${timeline}</span></div>
            <div><label>ESCAPE VELOCITY:</label> <span class="accent-text">14.2x REACH MULTIPLIER</span></div>
          </div>
          <p class="docket-promise">
            ✓ Trajectory vector computed. Our lead creative directors will examine your signal and deliver a custom blueprint within 24 hours.
          </p>
        `;

        if (receiptBox) {
          receiptBox.innerHTML = docketHtml;
          receiptBox.classList.add('visible');
        }

        if (resetBtn) {
          resetBtn.style.display = 'inline-flex';
        }
      }, 700);
    };

    if (leverHandle && leverTrack) {
      let isDraggingLever = false;
      let startY = 0;

      const onLeverStart = (e) => {
        if (isFlipped) return;
        isDraggingLever = true;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        leverHandle.style.transition = 'none';
        if (this.audio) this.audio.playClick(0.9);
      };

      const onLeverMove = (e) => {
        if (!isDraggingLever || isFlipped) return;
        const currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const delta = Math.max(0, Math.min(140, currentY - startY));
        leverHandle.style.top = `${14 + delta}px`;

        if (delta >= 110) {
          isDraggingLever = false;
          fireIgnition();
        }
      };

      const onLeverEnd = () => {
        if (!isDraggingLever) return;
        isDraggingLever = false;
        if (!isFlipped) {
          leverHandle.style.transition = 'top 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          leverHandle.style.top = '14px';
          if (this.audio) this.audio.playSpring();
        }
      };

      leverHandle.addEventListener('mousedown', onLeverStart);
      window.addEventListener('mousemove', onLeverMove);
      window.addEventListener('mouseup', onLeverEnd);

      leverHandle.addEventListener('touchstart', onLeverStart, { passive: true });
      window.addEventListener('touchmove', onLeverMove, { passive: true });
      window.addEventListener('touchend', onLeverEnd);

      leverHandle.addEventListener('click', () => {
        if (!isFlipped) fireIgnition();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        isFlipped = false;
        if (leverHandle) {
          leverHandle.style.transition = 'top 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          leverHandle.style.top = '14px';
          leverHandle.classList.remove('locked-down');
        }
        if (statusLight) statusLight.classList.remove('armed');
        if (receiptBox) receiptBox.classList.remove('visible');
        resetBtn.style.display = 'none';
        if (this.audio) this.audio.playClick(0.8);
      });
    }
  }

  // ==========================================
  // Case Study Deep Dive Modal
  // ==========================================
  setupModal() {
    const modal = document.getElementById('case-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
        if (this.audio) this.audio.playClick(0.9);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('visible');
          if (this.audio) this.audio.playClick(0.9);
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('visible')) {
        modal.classList.remove('visible');
        if (this.audio) this.audio.playClick(0.9);
      }
    });
  }

  openCaseModal(caseId) {
    const data = this.caseStudies.find((c) => c.id === caseId) || this.caseStudies[0];
    const modal = document.getElementById('case-modal');
    if (!modal) return;

    const titleEl = document.getElementById('modal-case-title');
    const catEl = document.getElementById('modal-case-category');
    const frictionDescEl = document.getElementById('modal-case-friction-desc');
    const flowDescEl = document.getElementById('modal-case-flow-desc');
    const quoteEl = document.getElementById('modal-case-quote');
    const metricsContainer = document.getElementById('modal-case-metrics');

    if (titleEl) titleEl.textContent = data.title;
    if (catEl) catEl.textContent = data.category;
    if (frictionDescEl) frictionDescEl.textContent = data.frictionDesc;
    if (flowDescEl) flowDescEl.textContent = data.flowDesc;
    if (quoteEl) quoteEl.textContent = data.clientQuote;

    if (metricsContainer) {
      metricsContainer.innerHTML = data.metrics.map((m) => `
        <div class="modal-metric-card">
          <div class="metric-big-num">${m.value}</div>
          <div class="metric-caption">${m.label}</div>
        </div>
      `).join('');
    }

    modal.classList.add('visible');
    if (this.audio) this.audio.playThud(140, 0.35);
  }

  // ==========================================
  // Diagnostic HUD & Sound Dock
  // ==========================================
  setupDiagnosticHUD() {
    const soundToggle = document.getElementById('sound-toggle-btn');
    const motionToggle = document.getElementById('motion-toggle-btn');

    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        if (this.audio) {
          const isMuted = this.audio.toggleMute();
          soundToggle.classList.toggle('muted', isMuted);
          const label = soundToggle.querySelector('.toggle-label');
          if (label) label.textContent = isMuted ? 'AUDIO // OFF' : 'AUDIO // ON';
        }
      });
    }

    if (motionToggle) {
      motionToggle.addEventListener('click', () => {
        const isReduced = document.body.classList.toggle('reduced-motion');
        const label = motionToggle.querySelector('.toggle-label');
        if (label) label.textContent = isReduced ? 'MOTION // REDUCED' : 'MOTION // FLUID';
        if (this.audio) this.audio.playClick(1.0);
      });
    }

    // Telemetry velocity update on scroll
    let lastY = window.scrollY;
    const veloReadout = document.getElementById('hud-velocity-readout');
    window.addEventListener('scroll', () => {
      const delta = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      if (veloReadout) {
        const simulatedSpeed = (delta * 0.18 + 0.1).toFixed(1);
        veloReadout.textContent = `${simulatedSpeed} m/s`;
      }
    }, { passive: true });
  }
}

window.KineticActManager = KineticActManager;
