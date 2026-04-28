export default class SequenceController {
  constructor({ canvas, frameCount, getFrameSrc }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.frameCount = frameCount;
    this.getFrameSrc = getFrameSrc;

    this.images = [];

    this.width = 0;
    this.height = 0;

    this.currentIndex = 0;

    this._init();

    window.addEventListener("resize", () => this._resize());
  }

  // load first frame
  _init() {
    const img = new Image();
    img.src = this.getFrameSrc(0);

    img.onload = () => {
      this.images[0] = img;

      this.width = img.naturalWidth;
      this.height = img.naturalHeight;

      this._resize();
      this._draw(img);
    };

    img.onerror = () => {
      console.error("First frame failed");
    };
  }

  // responsive resize
  _resize() {
    if (!this.width || !this.height) return;

    const dpr = window.devicePixelRatio || 1;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // cover scaling
    const scale = Math.max(vw / this.width, vh / this.height);

    this.drawWidth = this.width * scale;
    this.drawHeight = this.height * scale;

    this.offsetX = (vw - this.drawWidth) / 2;
    this.offsetY = (vh - this.drawHeight) / 2;

    // canvas resolution (this clears canvas)
    this.canvas.width = vw * dpr;
    this.canvas.height = vh * dpr;

    this.canvas.style.width = vw + "px";
    this.canvas.style.height = vh + "px";

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 🔥 redraw current frame after resize
    const img = this.images[this.currentIndex];
    if (img) this._draw(img);
  }

  // main API
  setProgress(progress) {
    const index = Math.floor(progress * (this.frameCount - 1));
    this.currentIndex = index;

    if (!this.images[index]) {
      const img = new Image();
      img.src = this.getFrameSrc(index);

      img.onload = () => {
        this.images[index] = img;

        // draw only if still current
        if (this.currentIndex === index) {
          this._draw(img);
        }
      };

      img.onerror = () => {
        console.warn("Frame failed:", index);
      };
    } else {
      this._draw(this.images[index]);
    }
  }

  // draw frame
  _draw(img) {
    if (!img) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(
      img,
      this.offsetX,
      this.offsetY,
      this.drawWidth,
      this.drawHeight
    );
  }
}