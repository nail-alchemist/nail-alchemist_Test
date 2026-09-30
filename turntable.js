/*
 * <nail-turntable> — scroll-scrubbed 3D turntable
 * ------------------------------------------------
 * Plays a numbered frame sequence (nails_0001.webp … nails_0120.webp) as the
 * visitor scrolls through the nearest ancestor marked [data-turntable-track].
 *
 *   <section data-turntable-track data-beats="3">
 *     <nail-turntable path="media/turntable/nails_" frames="120"
 *                     role="img" aria-label="…"></nail-turntable>
 *   </section>
 *
 * Attributes:  path (required), ext (".webp"), frames (120), turns (1)
 *
 * Writes back onto the track, for the page's CSS to use:
 *   style  --turn: 0…1         scroll progress through the track
 *   data-beat="0|1|2…"          which caption is active (needs data-beats)
 *
 * Why a custom element: the dc runtime re-renders pages with React. The
 * canvas lives in this element's shadow root, so a re-render (e.g. opening
 * the nav menu) can never replace or blank it. Load state lives in there
 * too (the canvas fades in on the first frame).
 *
 * The runtime also resets attributes it doesn't know about when it
 * re-renders — on this element and on the track. A MutationObserver puts
 * --turn / data-beat straight back, so opening the menu doesn't snap the
 * captions back to the first one.
 *
 * prefers-reduced-motion is deliberately NOT honoured here: the rotation is
 * driven directly by the visitor's own scrolling (nothing moves by itself),
 * and Windows reports "reduce" for everyone who has turned off its
 * "Animation effects" — which froze the set on a still frame.
 */
(function () {
  if (!window.customElements || customElements.get('nail-turntable')) return;

  const usable = (img) => img && img.complete && img.naturalWidth;

  class NailTurntable extends HTMLElement {
    connectedCallback() {
      if (!this._root) {
        this._root = this.attachShadow({ mode: 'open' });
        this._root.innerHTML =
          '<style>:host{display:block;position:relative}' +
          'canvas{display:block;width:100%;height:100%;opacity:0;transition:opacity .6s ease}' +
          'canvas.ready{opacity:1}</style>' +
          '<canvas aria-hidden="true"></canvas>';
        this._canvas = this._root.querySelector('canvas');
        this._ctx = this._canvas.getContext('2d');
        this._frames = [];
        this._current = -1;
        this._ticking = false;
        this._onScroll = () => {
          if (!this._ticking) { this._ticking = true; requestAnimationFrame(this._tick); }
        };
        this._tick = () => { this._ticking = false; this.update(); };
        this._onResize = () => this.resize();
      }

      this._count = parseInt(this.getAttribute('frames'), 10) || 120;
      this._turns = parseFloat(this.getAttribute('turns')) || 1;
      this._track = this.closest('[data-turntable-track]') || this.parentElement;

      window.addEventListener('scroll', this._onScroll, { passive: true });
      window.addEventListener('resize', this._onResize);
      this._ro = new ResizeObserver(this._onResize);
      this._ro.observe(this);
      this._mo = new MutationObserver(this._onScroll);
      this._mo.observe(this._track, { attributes: true, attributeFilter: ['style', 'data-beat'] });

      // First frame first so the stage is never empty, then all the rest
      // straight away — the turntable is the hero, there's nothing to defer.
      this._load(0);
      this._loadAll();
      this.resize();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this._onScroll);
      window.removeEventListener('resize', this._onResize);
      this._ro.disconnect();
      this._mo.disconnect();
    }

    _src(i) {
      return (this.getAttribute('path') || '') + String(i + 1).padStart(4, '0') + (this.getAttribute('ext') || '.webp');
    }

    _load(i) {
      if (this._frames[i]) return;
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (i === 0) this._canvas.classList.add('ready');
        this._current = -1;
        this._onScroll();
      };
      img.onerror = () => {
        if (i === 0) console.warn('[Nail Alchemist] turntable frames not found (looking for ' + this._src(0) + ').');
      };
      img.src = this._src(i);
      this._frames[i] = img;
    }

    // Interleaved order (0, 16, 32 … 1, 17 …) so a coarse full turn is
    // scrubbable early and fills in while the rest arrive.
    _loadAll() {
      for (let s = 0; s < 16; s++) for (let i = s; i < this._count; i += 16) this._load(i);
    }

    _draw(i) {
      const n = this._count;
      let img = this._frames[i];
      if (!usable(img)) {
        img = null;
        for (let d = 1; d < n && !img; d++) {
          if (usable(this._frames[(i - d + n) % n])) img = this._frames[(i - d + n) % n];
          else if (usable(this._frames[(i + d) % n])) img = this._frames[(i + d) % n];
        }
        if (!img) return;
      }
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this._ctx.drawImage(img, 0, 0, this._canvas.width, this._canvas.height);
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), r = this.getBoundingClientRect();
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
      if (w && h && (w !== this._canvas.width || h !== this._canvas.height)) {
        this._canvas.width = w;
        this._canvas.height = h;
      }
      this._current = -1;
      this.update();
    }

    update() {
      const track = this._track;
      if (!track) return;
      const r = track.getBoundingClientRect(), total = track.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-r.top / total, 0), 1) : 0;

      // Write only on change: the MutationObserver above sees these writes.
      const turn = p.toFixed(4);
      if (track.style.getPropertyValue('--turn') !== turn) track.style.setProperty('--turn', turn);
      const beats = parseInt(track.dataset.beats, 10);
      if (beats > 0) {
        const beat = String(Math.min(Math.floor(p * beats), beats - 1));
        if (track.dataset.beat !== beat) track.dataset.beat = beat;
      }

      let i = Math.floor(p * this._turns * this._count) % this._count;
      if (p === 1) i = (Math.round(this._turns * this._count) - 1) % this._count;
      if (i !== this._current) { this._current = i; this._draw(i); }
    }
  }

  customElements.define('nail-turntable', NailTurntable);
})();
