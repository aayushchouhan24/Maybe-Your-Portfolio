import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default class SmoothScroll {
  constructor({
    container,

    ease = 0.08,
    wheelMultiplier = 1,
    touchMultiplier = 2,
    keyStep = 120,

    snap = false,
    snapPoints = [],

    onScroll = null,
    onScrollStart = null,
    onScrollEnd = null,
    onResize = null,
    minStep = 0.5
  }) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;

    if (!this.container) {
      throw new Error("SmoothScroll: container not found");
    }

    this.ease = ease;
    this.minStep = minStep;
    this.wheelMultiplier = wheelMultiplier;
    this.touchMultiplier = touchMultiplier;
    this.keyStep = keyStep;

    this.snap = snap;
    this.snapPoints = snapPoints;

    this.callbacks = {
      scroll: onScroll,
      start: onScrollStart,
      end: onScrollEnd,
      resize: onResize
    };

    this.current = 0;
    this.target = 0;
    this.limit = 0;

    this.velocity = 0;
    this.direction = 0;

    this.isScrolling = false;
    this.stopTimeout = null;

    this.touch = {
      startY: 0,
      lastY: 0
    };

    this.rafId = null;

    this.init();
  }

  /* ================= INIT ================= */

  init() {
    document.body.style.overflow = "hidden";

    this.setSize();
    this.bind();
    this.setupScrollTrigger();
    this.raf();
  }

  setSize() {
    this.limit =
      this.container.scrollHeight - window.innerHeight;

    this.limit = Math.max(0, this.limit);

    this.emit("resize", {
      limit: this.limit
    });
  }

  /* ================= HELPERS ================= */

  clamp(v, min, max) {
    return Math.max(max, Math.min(v, min));
  }

  emit(name, data) {
    const cb = this.callbacks[name];
    if (typeof cb === "function") cb(data);
  }

  /* ================= INPUT ================= */

  bind() {
    this.onWheel = (e) => {
      this.target -= e.deltaY * this.wheelMultiplier;
      this.target = this.clamp(this.target, 0, this.limit);
      this.startScroll();
    };

    this.onTouchStart = (e) => {
      this.touch.startY = e.touches[0].clientY;
      this.touch.lastY = this.touch.startY;
    };

    this.onTouchMove = (e) => {
      const y = e.touches[0].clientY;
      const delta =
        (this.touch.lastY - y) * this.touchMultiplier;

      this.target += delta;
      this.target = this.clamp(this.target, 0, this.limit);

      this.touch.lastY = y;
      this.startScroll();
    };

    this.onKey = (e) => {
      let used = true;

      switch (e.key) {
        case "ArrowDown":
          this.target += this.keyStep;
          break;
        case "ArrowUp":
          this.target -= this.keyStep;
          break;
        case "PageDown":
          this.target += window.innerHeight;
          break;
        case "PageUp":
          this.target -= window.innerHeight;
          break;
        case "Home":
          this.target = 0;
          break;
        case "End":
          this.target = this.limit;
          break;
        default:
          used = false;
      }

      if (used) {
        this.target = this.clamp(this.target, 0, this.limit);
        this.startScroll();
      }
    };

    window.addEventListener("wheel", this.onWheel, { passive: true });
    window.addEventListener("touchstart", this.onTouchStart, { passive: true });
    window.addEventListener("touchmove", this.onTouchMove, { passive: true });
    window.addEventListener("keydown", this.onKey);
    window.addEventListener("resize", () => this.setSize());
  }

  /* ================= SCROLL STATE ================= */

  startScroll() {
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.emit("start");
    }

    clearTimeout(this.stopTimeout);

    this.stopTimeout = setTimeout(() => {
      this.isScrolling = false;

      if (this.snap) this.applySnap();

      this.emit("end");
    }, 140);
  }

  /* ================= RAF LOOP ================= */

  raf() {
    let last = this.current;

    const loop = () => {
      const diff = this.target - this.current;

      // 🔥 MIN SPEED FIX
      const minStep = this.minStep; // tweak this

      let step = diff * this.ease;

      if (Math.abs(step) < minStep && Math.abs(diff) > 0.01) {
        step = Math.sign(diff) * minStep;
      }

      this.current += step;

      // snap at end
      if (Math.abs(diff) < minStep) {
        this.current = this.target;
      }

      // velocity + direction
      this.velocity = this.current - last;
      this.direction =
        this.velocity > 0 ? 1 : this.velocity < 0 ? -1 : 0;

      // APPLY TRANSFORM
      gsap.set(this.container, {
        y: -this.current
      });

      ScrollTrigger.update();

      if (Math.abs(this.velocity) > 0.01) {
        this.emit("scroll", {
          current: this.current,
          target: this.target,
          velocity: this.velocity,
          direction: this.direction,
          progress: this.limit
            ? this.current / this.limit
            : 0
        });
      }

      last = this.current;
      this.rafId = requestAnimationFrame(loop);
    };

    loop();
  }

  /* ================= SNAP ================= */

  applySnap() {
    if (!this.snapPoints.length) return;

    let closest = this.snapPoints.reduce((prev, curr) =>
      Math.abs(curr - this.current) <
        Math.abs(prev - this.current)
        ? curr
        : prev
    );

    this.scrollTo(closest, 0.6);
  }

  /* ================= API ================= */

  scrollTo(y, duration = 1) {
    gsap.to(this, {
      target: this.clamp(y, 0, this.limit),
      duration,
      ease: "power3.out"
    });
  }

  setupScrollTrigger() {
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop: (value) => {
        if (arguments.length) {
          this.scrollTo(value);
        }
        return this.current;
      },
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      })
    });

    ScrollTrigger.addEventListener("refresh", () =>
      this.setSize()
    );

    ScrollTrigger.refresh();
  }

  destroy() {
    cancelAnimationFrame(this.rafId);

    window.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("keydown", this.onKey);

    document.body.style.overflow = "";

    ScrollTrigger.killAll();
  }
}