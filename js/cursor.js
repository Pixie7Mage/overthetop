/**
 * KINETIC PHYSICS CURSOR
 * Spring-damper follower with magnetic element attraction, velocity shear,
 * and contextual tactile state blooms.
 */

class KineticCursor {
  constructor() {
    this.dot = document.getElementById('cursor-dot');
    this.ring = document.getElementById('cursor-ring');
    this.badge = document.getElementById('cursor-badge');

    if (!this.dot || !this.ring) return;

    this.mouse = { x: -100, y: -100 };
    this.pos = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.vel = { x: 0, y: 0 };
    this.magneticTarget = null;
    this.isHovering = false;
    this.isDown = false;
    this.label = '';

    this.init();
  }

  init() {
    // Only activate custom cursor on fine pointer devices (desktops/laptops)
    if (window.matchMedia('(pointer: coarse)').matches) {
      if (this.dot) this.dot.style.display = 'none';
      if (this.ring) this.ring.style.display = 'none';
      return;
    }

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mousedown', () => {
      this.isDown = true;
      this.ring.classList.add('cursor-down');
    });

    window.addEventListener('mouseup', () => {
      this.isDown = false;
      this.ring.classList.remove('cursor-down');
    });

    document.addEventListener('mouseleave', () => {
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      this.dot.style.opacity = '1';
      this.ring.style.opacity = '1';
    });

    this.setupMagneticListeners();
    this.render();
  }

  setupMagneticListeners() {
    const updateMagneticTargets = () => {
      const magnetics = document.querySelectorAll('[data-magnetic]');
      magnetics.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          this.magneticTarget = el;
          this.ring.classList.add('cursor-magnetic');
          const customLabel = el.getAttribute('data-cursor-label');
          if (customLabel) {
            this.setLabel(customLabel);
          }
        });

        el.addEventListener('mouseleave', () => {
          this.magneticTarget = null;
          this.ring.classList.remove('cursor-magnetic');
          this.clearLabel();
        });
      });
    };

    updateMagneticTargets();
    // Expose for dynamic re-attaching when DOM changes
    window.refreshMagneticCursor = updateMagneticTargets;
  }

  setLabel(text) {
    if (!this.badge) return;
    this.badge.textContent = text;
    this.badge.classList.add('visible');
  }

  clearLabel() {
    if (!this.badge) return;
    this.badge.textContent = '';
    this.badge.classList.remove('visible');
  }

  render() {
    requestAnimationFrame(() => this.render());

    let targetX = this.mouse.x;
    let targetY = this.mouse.y;

    // Apply magnetic pull if hovering a magnetic item
    if (this.magneticTarget) {
      const rect = this.magneticTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // 35% magnetic attraction
      targetX = this.mouse.x + (centerX - this.mouse.x) * 0.38;
      targetY = this.mouse.y + (centerY - this.mouse.y) * 0.38;
    }

    // Velocity calculation for dynamic stretching
    const prevRingX = this.ringPos.x;
    const prevRingY = this.ringPos.y;

    // Spring interpolation: dot moves fast, ring follows with spring drag
    this.pos.x += (targetX - this.pos.x) * 0.45;
    this.pos.y += (targetY - this.pos.y) * 0.45;

    this.ringPos.x += (targetX - this.ringPos.x) * 0.16;
    this.ringPos.y += (targetY - this.ringPos.y) * 0.16;

    this.vel.x = this.ringPos.x - prevRingX;
    this.vel.y = this.ringPos.y - prevRingY;

    const speed = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    const angle = Math.atan2(this.vel.y, this.vel.x);

    // Dynamic squash & stretch based on velocity
    const stretch = Math.min(1 + speed * 0.025, 1.45);
    const squash = Math.max(1 - speed * 0.015, 0.75);

    // Apply transforms
    this.dot.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate(-50%, -50%)`;

    if (!this.magneticTarget) {
      this.ring.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${stretch}, ${squash})`;
    } else {
      this.ring.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0) translate(-50%, -50%) scale(1.35)`;
    }

    if (this.badge) {
      this.badge.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0) translate(-50%, -50%)`;
    }
  }
}

window.KineticCursor = KineticCursor;
