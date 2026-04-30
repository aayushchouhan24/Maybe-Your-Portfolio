export default class SequenceController {
  constructor({
    canvas,
    frameCount = 100,
    getFrameSrc = null,
    resolution = [1920, 1080],
    preload = true,
    transition = false,
    transitionSpeed = 0.2
  }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.frameCount = frameCount;

    // 🎯 fallback to random images if not provided
    const [w, h] = resolution;
    this.getFrameSrc =
      getFrameSrc ||
      ((i) => `https://picsum.photos/${w + i}/${h + i}`);

    this.images = new Array(frameCount);
    this.loaded = new Array(frameCount).fill(false);

    this.width = w;
    this.height = h;

    this.currentIndex = 0;
    this.prevImage = null;

    this.transition = transition;
    this.transitionAlpha = 1;
    this.transitionSpeed = transitionSpeed;

    this._init();

    if (preload) this._preloadAll();

    window.addEventListener("resize", () => this._resize());
  }

  /* ================= INIT ================= */

  _init() {
    const img = new Image();
    img.src = this.getFrameSrc(0);

    img.onload = () => {
      this.images[0] = img;
      this.loaded[0] = true;

      // override resolution if real image available
      this.width = img.naturalWidth || this.width;
      this.height = img.naturalHeight || this.height;

      this._resize();
      this._draw(img);
    };
  }

  /* ================= PRELOAD ================= */

  _preloadAll() {
    for (let i = 0; i < this.frameCount; i++) {
      const img = new Image();
      img.src = this.getFrameSrc(i);

      img.onload = () => {
        this.images[i] = img;
        this.loaded[i] = true;
      };
    }
  }

  /* ================= RESIZE ================= */

  _resize() {
    if (!this.width || !this.height) return;

    const dpr = window.devicePixelRatio || 1;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const scale = Math.max(vw / this.width, vh / this.height);

    this.drawWidth = this.width * scale;
    this.drawHeight = this.height * scale;

    this.offsetX = (vw - this.drawWidth) / 2;
    this.offsetY = (vh - this.drawHeight) / 2;

    this.canvas.width = vw * dpr;
    this.canvas.height = vh * dpr;

    this.canvas.style.width = vw + "px";
    this.canvas.style.height = vh + "px";

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const img = this.images[this.currentIndex];
    if (img) this._draw(img);
  }

  /* ================= MAIN ================= */

  setProgress(progress) {
    // Math.floor maps progress=0 → 0 and progress=1 → frameCount-1 with
    // monotonic step transitions. Math.ceil here jumped past frame 0 on
    // any progress > 0 and could skip a frame at the boundary, causing
    // the visible "jump" reported in #50.
    const index = Math.floor(progress * (this.frameCount - 1));

    if (index === this.currentIndex) return;

    const next = this.images[index];
    if (!next) return;

    if (this.transition) {
      this.prevImage = this.images[this.currentIndex];
      this.transitionAlpha = 0;
      this._animateTransition(next);
    } else {
      this._draw(next);
    }

    this.currentIndex = index;
  }

  /* ================= TRANSITION ================= */

  _animateTransition(nextImg) {
    const step = () => {
      this.transitionAlpha += this.transitionSpeed;

      if (this.transitionAlpha >= 1) {
        this.transitionAlpha = 1;
        this._draw(nextImg);
        return;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.prevImage) {
        this.ctx.globalAlpha = 1;
        this._draw(this.prevImage);
      }

      this.ctx.globalAlpha = this.transitionAlpha;
      this._draw(nextImg);

      this.ctx.globalAlpha = 1;

      requestAnimationFrame(step);
    };

    step();
  }

  /* ================= DRAW ================= */

  _draw(img) {
    this.ctx.drawImage(
      img,
      this.offsetX,
      this.offsetY,
      this.drawWidth,
      this.drawHeight
    );
  }
}