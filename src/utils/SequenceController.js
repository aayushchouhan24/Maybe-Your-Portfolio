/**
 * Controls the playback of an image sequence on a canvas tied to scroll progress.
 */
export default class SequenceController {
  /**
   * Creates an instance of SequenceController.
   * @param {Object} options - Configuration options.
   * @param {HTMLCanvasElement} options.canvas - The canvas element to draw on.
   * @param {number} [options.frameCount=100] - Total number of frames in the sequence.
   * @param {Function} [options.getFrameSrc=null] - Function that returns image source URL for a given index.
   * @param {number[]} [options.resolution=[1920, 1080]] - Default aspect ratio width/height.
   * @param {boolean} [options.preload=true] - Whether to fetch all frames immediately.
   * @param {boolean} [options.transition=false] - Enable crossfade transitions between frames.
   * @param {number} [options.transitionSpeed=0.2] - Increment step for opacity transitions.
   */
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

  /**
   * Initializes the canvas by fetching the first frame and computing aspect ratios.
   * @private
   */
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

  /**
   * Preloads all images in the sequence to ensure smooth playback.
   * @private
   */
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

  /**
   * Resizes the canvas properly to cover the screen while maintaining aspect ratios.
   * @private
   */
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

  /**
   * Updates the current frame index based on a progress ratio (0 to 1).
   * @param {number} progress - A float between 0 and 1.
   */
  setProgress(progress) {
    const index = Math.ceil(progress * (this.frameCount - 1));

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

  /**
   * Handles linear crossfade interpolations between frames.
   * @private
   * @param {HTMLImageElement} nextImg - The next image to draw.
   */
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

  /**
   * Renders the image cleanly on the active context.
   * @private
   * @param {HTMLImageElement} img - The image to draw.
   */
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