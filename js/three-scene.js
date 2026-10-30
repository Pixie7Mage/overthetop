/**
 * KINETIC THREE.JS ENGINE
 * High-performance WebGL Canvas with custom shaders, glass refraction,
 * particle shockwaves, morphing wireframes, dynamic gyroscopes, and ignition rocket trails.
 */

class KineticScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Mouse & Inertia state
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0 };
    this.scrollProgress = 0;
    this.scrollVelocity = 0;
    this.lastScrollY = window.scrollY;

    // Act states
    this.act = 1; // 1 to 5
    this.isShattered = false;
    this.shatterProgress = 0;
    this.scaleDialStage = 0; // 0: Street, 1: Creator, 2: Scaling, 3: Pillar
    this.currentEngine = 0; // 0: Compass, 1: Forge, 2: Thruster
    this.isIgnited = false;
    this.igniteProgress = 0;
    this.reducedMotion = false;

    // 3D Objects
    this.prismGroup = null;
    this.emberMesh = null;
    this.emberLight = null;
    this.glassPrism = null;
    this.shatteredRibbons = null;
    this.railParticles = null;
    this.dialMorphGroup = null;
    this.wireframeMeshes = [];
    this.gyroGroup = null;
    this.thrusterParticles = null;
    this.ignitionVortex = null;

    this.init();
  }

  init() {
    // 1. Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x121113, 0.035);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 10);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    // 2. Lighting
    this.setupLighting();

    // 3. Act I: The Resting Ember & Glass Prism
    this.setupHeroPrism();

    // 4. Kinetic Rail Conduit (Runs vertically across the whole voyage)
    this.setupRailSystem();

    // 5. Act II: Morphing Wireframes (Scale Dial)
    this.setupDialMorphs();

    // 6. Act IV: The Engine Room 3D Gizmos (Gyroscope & Thruster)
    this.setupEngineVisualizers();

    // 7. Act V: Ignition Vortex
    this.setupIgnitionVortex();

    // Event listeners
    this.setupEvents();

    // Start loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x242022, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xF4EFEA, 1.5);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    const rimLight = new THREE.PointLight(0xFF552E, 3, 20);
    rimLight.position.set(-6, -3, -4);
    this.scene.add(rimLight);
  }

  setupHeroPrism() {
    this.prismGroup = new THREE.Group();
    
    // Responsive positioning: right side on desktop, center on mobile
    const isMobile = window.innerWidth <= 900;
    this.prismGroup.position.set(isMobile ? 0 : 2.5, isMobile ? -0.5 : 0, isMobile ? -1 : 1.2);

    // Frosted Glass Outer Sphere / Octahedral Crystal Prism
    const glassGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xF4EFEA,
      metalness: 0.05,
      roughness: 0.18,
      transmission: 0.88,
      thickness: 1.5,
      ior: 1.52,
      reflectivity: 0.6,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.92,
      wireframe: false
    });
    this.glassPrism = new THREE.Mesh(glassGeo, glassMat);
    this.prismGroup.add(this.glassPrism);

    // Inner Faceted Core Wireframe for tactile industrial feel
    const innerWireGeo = new THREE.OctahedronGeometry(1.4, 1);
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0xFFB020,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.innerWire = new THREE.Mesh(innerWireGeo, innerWireMat);
    this.prismGroup.add(this.innerWire);

    // Organic Breathing Ember Core
    const emberGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const emberMat = new THREE.MeshBasicMaterial({
      color: 0xFF4D2E
    });
    this.emberMesh = new THREE.Mesh(emberGeo, emberMat);
    this.prismGroup.add(this.emberMesh);

    // Warm organic point light
    this.emberLight = new THREE.PointLight(0xFF552E, 4.5, 8);
    this.prismGroup.add(this.emberLight);

    // Ground shadow / pedestal disk
    const diskGeo = new THREE.RingGeometry(0.1, 2.5, 32);
    const diskMat = new THREE.MeshBasicMaterial({
      color: 0x141416,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = -Math.PI / 2;
    disk.position.y = -2;
    this.prismGroup.add(disk);

    this.scene.add(this.prismGroup);

    // Shattered Light Ribbons (Instanced/Buffer geometry ready to burst)
    const ribbonCount = 280;
    const ribbonGeo = new THREE.BufferGeometry();
    const ribbonPos = new Float32Array(ribbonCount * 3);
    const ribbonVelo = new Float32Array(ribbonCount * 3);
    const ribbonColors = new Float32Array(ribbonCount * 3);

    const c1 = new THREE.Color(0xFF552E); // molten coral
    const c2 = new THREE.Color(0xFFB020); // electric amber
    const c3 = new THREE.Color(0xF4EFEA); // stone white

    for (let i = 0; i < ribbonCount; i++) {
      ribbonPos[i * 3] = (Math.random() - 0.5) * 0.4;
      ribbonPos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      ribbonPos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(Math.random() * 2 - 1);
      const speed = 2.5 + Math.random() * 5.5;

      ribbonVelo[i * 3] = Math.sin(theta) * Math.cos(phi) * speed;
      ribbonVelo[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * speed;
      ribbonVelo[i * 3 + 2] = Math.cos(theta) * speed;

      const pickC = Math.random() > 0.6 ? c1 : Math.random() > 0.3 ? c2 : c3;
      ribbonColors[i * 3] = pickC.r;
      ribbonColors[i * 3 + 1] = pickC.g;
      ribbonColors[i * 3 + 2] = pickC.b;
    }

    ribbonGeo.setAttribute('position', new THREE.BufferAttribute(ribbonPos, 3));
    ribbonGeo.setAttribute('color', new THREE.BufferAttribute(ribbonColors, 3));
    this.ribbonVelocities = ribbonVelo;

    const ribbonMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    this.shatteredRibbons = new THREE.Points(ribbonGeo, ribbonMat);
    this.shatteredRibbons.position.copy(this.prismGroup.position);
    this.scene.add(this.shatteredRibbons);
  }

  setupRailSystem() {
    // A vertical rail conduit carrying 450 glowing particles along the voyage
    const pCount = 450;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pScale = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      // Cylindrical conduit along vertical column with slight radial spread
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.8 + Math.random() * 2.8;
      pPos[i * 3] = Math.cos(angle) * radius;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 45; // spans down the height
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 3 - 2;
      pScale[i] = Math.random() * 0.08 + 0.02;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xFFB020,
      size: 0.065,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending
    });

    this.railParticles = new THREE.Points(pGeo, pMat);
    this.railParticles.position.y = -10;
    this.scene.add(this.railParticles);
  }

  setupDialMorphs() {
    this.dialMorphGroup = new THREE.Group();
    this.dialMorphGroup.position.set(2.8, -14, 0); // Positioned for Act II section

    // Stage 0: Storefront Canopy / Artisan Workshop Wireframe
    const storeGeo = new THREE.ConeGeometry(1.6, 1.2, 5, 2, true);
    const storeMat = new THREE.MeshStandardMaterial({
      color: 0xFFB020,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const storeMesh = new THREE.Mesh(storeGeo, storeMat);
    storeMesh.name = 'stage-0';
    this.dialMorphGroup.add(storeMesh);

    // Stage 1: Digital Creator App / Floating Isometric Card Grid
    const appGeo = new THREE.BoxGeometry(1.8, 1.3, 0.4, 4, 3, 2);
    const appMat = new THREE.MeshStandardMaterial({
      color: 0xFF552E,
      wireframe: true,
      transparent: true,
      opacity: 0
    });
    const appMesh = new THREE.Mesh(appGeo, appMat);
    appMesh.name = 'stage-1';
    appMesh.visible = false;
    this.dialMorphGroup.add(appMesh);

    // Stage 2: Scaling Startup / High-velocity Aerodynamic Prismatic Arrow
    const scaleGeo = new THREE.CylinderGeometry(0.1, 1.4, 2.2, 6, 4, false);
    const scaleMat = new THREE.MeshStandardMaterial({
      color: 0xF4EFEA,
      wireframe: true,
      transparent: true,
      opacity: 0
    });
    const scaleMesh = new THREE.Mesh(scaleGeo, scaleMat);
    scaleMesh.name = 'stage-2';
    scaleMesh.visible = false;
    this.dialMorphGroup.add(scaleMesh);

    // Stage 3: Industry Pillar / Multi-Ring Orbital Constellation
    const pillarGeo = new THREE.TorusGeometry(1.5, 0.2, 12, 48);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0xFFB020,
      wireframe: true,
      transparent: true,
      opacity: 0
    });
    const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
    pillarMesh.name = 'stage-3';
    pillarMesh.visible = false;
    this.dialMorphGroup.add(pillarMesh);

    this.wireframeMeshes = [storeMesh, appMesh, scaleMesh, pillarMesh];
    this.scene.add(this.dialMorphGroup);
  }

  setupEngineVisualizers() {
    // Gyroscope Gimbal for Act IV Engine 01 (The Compass)
    this.gyroGroup = new THREE.Group();
    this.gyroGroup.position.set(0, -32, 0);

    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0xFFB020, wireframe: true, metalness: 0.8 });
    const ringMat2 = new THREE.MeshStandardMaterial({ color: 0xFF552E, wireframe: true, metalness: 0.8 });
    const ringMat3 = new THREE.MeshStandardMaterial({ color: 0xF4EFEA, wireframe: true, metalness: 0.8 });

    this.gyroRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.04, 16, 64), ringMat1);
    this.gyroRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.04, 16, 64), ringMat2);
    this.gyroRing3 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 16, 64), ringMat3);

    // Central magnetic pointer needle
    const needleGeo = new THREE.ConeGeometry(0.18, 1.4, 8);
    needleGeo.rotateX(Math.PI / 2);
    const needleMat = new THREE.MeshBasicMaterial({ color: 0xFF4D2E });
    this.needleMesh = new THREE.Mesh(needleGeo, needleMat);

    this.gyroGroup.add(this.gyroRing1);
    this.gyroGroup.add(this.gyroRing2);
    this.gyroGroup.add(this.gyroRing3);
    this.gyroGroup.add(this.needleMesh);
    this.scene.add(this.gyroGroup);

    // Particle Thruster Tunnel for Act IV Engine 03 (The Thruster)
    const tCount = 600;
    const tGeo = new THREE.BufferGeometry();
    const tPos = new Float32Array(tCount * 3);
    for (let i = 0; i < tCount; i++) {
      tPos[i * 3] = (Math.random() - 0.5) * 4;
      tPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      tPos[i * 3 + 2] = -Math.random() * 20;
    }
    tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
    this.thrusterParticles = new THREE.Points(tGeo, new THREE.PointsMaterial({
      color: 0xFF552E,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    }));
    this.thrusterParticles.position.set(0, -32, 0);
    this.thrusterParticles.visible = false;
    this.scene.add(this.thrusterParticles);
  }

  setupIgnitionVortex() {
    // Act V Ignition Rocket / Upward Particle Vortex
    const vCount = 800;
    const vGeo = new THREE.BufferGeometry();
    const vPos = new Float32Array(vCount * 3);
    const vVel = new Float32Array(vCount * 3);

    for (let i = 0; i < vCount; i++) {
      vPos[i * 3] = (Math.random() - 0.5) * 2;
      vPos[i * 3 + 1] = -48 + (Math.random() - 0.5) * 2;
      vPos[i * 3 + 2] = (Math.random() - 0.5) * 2;

      vVel[i * 3] = (Math.random() - 0.5) * 1.5;
      vVel[i * 3 + 1] = 6 + Math.random() * 14; // rapid upward blast
      vVel[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }

    vGeo.setAttribute('position', new THREE.BufferAttribute(vPos, 3));
    this.vortexVelocities = vVel;

    this.ignitionVortex = new THREE.Points(vGeo, new THREE.PointsMaterial({
      color: 0xFF552E,
      size: 0.15,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    }));
    this.scene.add(this.ignitionVortex);
  }

  setupEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.targetX = nx;
      this.mouse.targetY = ny;
    }, { passive: true });

    // Touch support for mobile inertia
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const nx = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        this.mouse.targetX = nx;
        this.mouse.targetY = ny;
      }
    }, { passive: true });
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // Act I Trigger: Shatter Prism on first interaction/scroll
  triggerShatter() {
    if (this.isShattered) return;
    this.isShattered = true;
    if (window.kineticAudio) window.kineticAudio.playShatter();

    // Animate shatter explosion with spring curve
    if (window.gsap) {
      window.gsap.to(this, {
        shatterProgress: 1,
        duration: 2.2,
        ease: 'power3.out'
      });
      window.gsap.to(this.glassPrism.material, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          this.glassPrism.visible = false;
        }
      });
      window.gsap.to(this.shatteredRibbons.material, {
        opacity: 0.9,
        duration: 0.4,
        onComplete: () => {
          window.gsap.to(this.shatteredRibbons.material, {
            opacity: 0.25,
            duration: 1.8,
            ease: 'power1.out'
          });
        }
      });
    } else {
      this.shatterProgress = 1;
      this.glassPrism.visible = false;
      this.shatteredRibbons.material.opacity = 0.5;
    }

    // Broadcast shatter event to DOM
    window.dispatchEvent(new CustomEvent('kinetic:shattered'));
  }

  // Act II: Update morphing wireframe stage (0 to 3)
  setScaleStage(stageIndex) {
    this.scaleDialStage = stageIndex;
    if (window.kineticAudio) window.kineticAudio.playDetent(stageIndex);

    this.wireframeMeshes.forEach((mesh, idx) => {
      const isTarget = idx === stageIndex;
      if (isTarget) {
        mesh.visible = true;
        if (window.gsap) {
          window.gsap.to(mesh.material, { opacity: 0.85, duration: 0.6, ease: 'power2.out' });
          window.gsap.fromTo(mesh.scale, { x: 0.6, y: 0.6, z: 0.6 }, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'back.out(1.4)' });
        } else {
          mesh.material.opacity = 0.85;
          mesh.scale.set(1, 1, 1);
        }
      } else {
        if (window.gsap) {
          window.gsap.to(mesh.material, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => { mesh.visible = false; }
          });
        } else {
          mesh.material.opacity = 0;
          mesh.visible = false;
        }
      }
    });
  }

  // Act IV: Switch Engine Room visual mode
  setEngineMode(engineIndex) {
    this.currentEngine = engineIndex;
    if (window.kineticAudio) window.kineticAudio.playClick(1.1 + engineIndex * 0.2);

    if (this.gyroGroup) {
      this.gyroGroup.visible = (engineIndex === 0);
    }
    if (this.thrusterParticles) {
      this.thrusterParticles.visible = (engineIndex === 2);
    }
  }

  // Act V: Trigger Ignition Launch Sequence
  triggerIgnition() {
    this.isIgnited = true;
    if (window.kineticAudio) window.kineticAudio.playIgnite();

    if (window.gsap) {
      window.gsap.to(this, {
        igniteProgress: 1,
        duration: 3.5,
        ease: 'power2.out'
      });
      window.gsap.to(this.ignitionVortex.material, {
        opacity: 0.95,
        duration: 0.4,
        onComplete: () => {
          window.gsap.to(this.ignitionVortex.material, {
            opacity: 0.3,
            duration: 2.8,
            ease: 'power1.out'
          });
        }
      });
    } else {
      this.igniteProgress = 1;
      this.ignitionVortex.material.opacity = 0.8;
    }
  }

  // Per-frame physics animation loop
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // 1. Smooth Spring-Damper Mouse Inertia
    const spring = 0.085;
    this.mouse.vx += (this.mouse.targetX - this.mouse.x) * spring;
    this.mouse.vy += (this.mouse.targetY - this.mouse.y) * spring;
    this.mouse.x += this.mouse.vx;
    this.mouse.y += this.mouse.vy;
    this.mouse.vx *= 0.72; // damping
    this.mouse.vy *= 0.72;

    // 2. Track Scroll Velocity
    const currentScrollY = window.scrollY;
    this.scrollVelocity = (currentScrollY - this.lastScrollY) * 0.02;
    this.lastScrollY = currentScrollY;

    // Camera track down along with scroll
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const scrollRatio = Math.min(1, Math.max(0, currentScrollY / maxScroll));
    this.scrollProgress = scrollRatio;

    // Smooth camera Y translation (-0 to -48 units)
    const targetCamY = -scrollRatio * 46;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.08;

    // 3. Act I: Ember Physics & Breathing
    if (this.prismGroup) {
      if (!this.isShattered) {
        // Ember rolls inside prism with tilt inertia
        this.prismGroup.rotation.x = this.mouse.y * 0.35 + Math.sin(time * 0.8) * 0.05;
        this.prismGroup.rotation.y = this.mouse.x * 0.45 + Math.cos(time * 0.7) * 0.05;

        // Ember rolling inside sphere
        if (this.emberMesh) {
          this.emberMesh.position.x = this.mouse.x * 0.75 + Math.sin(time * 2.5) * 0.08;
          this.emberMesh.position.y = this.mouse.y * 0.75 + Math.cos(time * 2.2) * 0.08;
          this.emberMesh.position.z = Math.sin(time * 1.8) * 0.15;

          // Organic breathing pulse
          const breath = 1 + Math.sin(time * 2.2) * 0.15;
          this.emberMesh.scale.set(breath, breath, breath);

          if (this.emberLight) {
            this.emberLight.intensity = 3.5 + Math.sin(time * 2.2) * 1.5;
            this.emberLight.position.copy(this.emberMesh.position);
          }
        }

        if (this.innerWire) {
          this.innerWire.rotation.x += 0.008;
          this.innerWire.rotation.y += 0.012;
        }
      } else {
        // Shattered state: update ribbon particles expansion
        if (this.shatteredRibbons && this.shatterProgress > 0) {
          const pos = this.shatteredRibbons.geometry.attributes.position.array;
          const vel = this.ribbonVelocities;
          for (let i = 0; i < vel.length / 3; i++) {
            pos[i * 3] += vel[i * 3] * delta * (1 - this.shatterProgress * 0.4);
            pos[i * 3 + 1] += vel[i * 3 + 1] * delta * (1 - this.shatterProgress * 0.4);
            pos[i * 3 + 2] += vel[i * 3 + 2] * delta * (1 - this.shatterProgress * 0.4);
          }
          this.shatteredRibbons.geometry.attributes.position.needsUpdate = true;
          this.shatteredRibbons.rotation.y += 0.005;
        }
      }
    }

    // 4. Kinetic Rail Conduit Motion
    if (this.railParticles) {
      const rPos = this.railParticles.geometry.attributes.position.array;
      for (let i = 0; i < rPos.length / 3; i++) {
        // Particles slowly stream upward against scroll velocity
        rPos[i * 3 + 1] += (0.04 + Math.abs(this.scrollVelocity) * 0.2);
        if (rPos[i * 3 + 1] > 20) {
          rPos[i * 3 + 1] = -25;
        }
      }
      this.railParticles.geometry.attributes.position.needsUpdate = true;
      this.railParticles.rotation.y += 0.002;
    }

    // 5. Act II: Morphing Wireframe Rotation
    if (this.dialMorphGroup) {
      this.dialMorphGroup.rotation.y += 0.012 + this.mouse.x * 0.02;
      this.dialMorphGroup.rotation.x = Math.sin(time * 0.7) * 0.15 + this.mouse.y * 0.15;
    }

    // 6. Act IV: Gyroscope Compass Needle Alignment
    if (this.gyroGroup && this.gyroGroup.visible) {
      this.gyroRing1.rotation.x += 0.015;
      this.gyroRing1.rotation.y += 0.008;

      this.gyroRing2.rotation.y += 0.018;
      this.gyroRing2.rotation.z += 0.012;

      this.gyroRing3.rotation.z += 0.022;
      this.gyroRing3.rotation.x += 0.01;

      // Pointer dynamically tracks cursor coordinate
      if (this.needleMesh) {
        this.needleMesh.rotation.z = Math.atan2(this.mouse.y, this.mouse.x) - Math.PI / 2;
        this.needleMesh.rotation.x = this.mouse.y * 0.5;
      }
    }

    // Act IV Thruster Accelerator Tunnel
    if (this.thrusterParticles && this.thrusterParticles.visible) {
      const tPos = this.thrusterParticles.geometry.attributes.position.array;
      const tSpeed = 0.35 + Math.abs(this.scrollVelocity) * 0.6;
      for (let i = 0; i < tPos.length / 3; i++) {
        tPos[i * 3 + 2] += tSpeed;
        if (tPos[i * 3 + 2] > 5) {
          tPos[i * 3 + 2] = -20;
        }
      }
      this.thrusterParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 7. Act V Ignition Vortex Surge
    if (this.isIgnited && this.ignitionVortex) {
      const vPos = this.ignitionVortex.geometry.attributes.position.array;
      const vVel = this.vortexVelocities;
      for (let i = 0; i < vVel.length / 3; i++) {
        vPos[i * 3] += vVel[i * 3] * delta;
        vPos[i * 3 + 1] += vVel[i * 3 + 1] * delta;
        vPos[i * 3 + 2] += vVel[i * 3 + 2] * delta;

        // Reset if reached stratosphere
        if (vPos[i * 3 + 1] > 10) {
          vPos[i * 3 + 1] = -48;
          vPos[i * 3] = (Math.random() - 0.5) * 2;
          vPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }
      }
      this.ignitionVortex.geometry.attributes.position.needsUpdate = true;
      this.ignitionVortex.rotation.y += 0.05;
    }

    // Render WebGL frame
    this.renderer.render(this.scene, this.camera);
  }
}

// Global scene singleton initialized after DOM content loaded
window.KineticScene = KineticScene;
