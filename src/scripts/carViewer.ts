/**
 * Scroll-driven car rotation (CLAUDE.md §6).
 * Scroll progress through the section maps linearly to a frame, drawn on a canvas.
 * Scrolling is the only control: no drag, no auto-rotation, no scroll hijacking.
 */

const PRIORITY_STEP = 4; // load every 4th frame first, then fill the gaps
const CONCURRENCY = 6;

export function initCarViewer(root: HTMLElement): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const base = root.dataset.frames ?? '';
  const ext = root.dataset.extension ?? '';
  const count = Number(root.dataset.count);
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  const poster = root.querySelector<HTMLImageElement>('img');
  const hint = root.querySelector<HTMLElement>('[data-hint]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !poster || !ctx || !(count > 1)) return;

  // Frames are kept as decoded bitmaps: drawing a plain <img> can make the browser decode the
  // WebP again on every draw, which stutters on slower phones.
  const frames: (ImageBitmap | HTMLImageElement | undefined)[] = new Array(count);
  const requested = new Set<number>();
  let wanted = 0;
  let drawn = -1;
  let raf = 0;

  const src = (i: number) => `${base}${String(i + 1).padStart(3, '0')}${ext}`;

  // Closest frame to `i` that has finished loading.
  const nearestLoaded = (i: number): number => {
    for (let d = 0; d < count; d++) {
      if (frames[i - d]) return i - d;
      if (frames[i + d]) return i + d;
    }
    return -1;
  };

  const draw = () => {
    raf = 0;
    const i = nearestLoaded(wanted);
    if (i < 0 || i === drawn) return;
    const img = frames[i]!;
    const { width: w, height: h } = canvas;
    const scale = Math.min(w / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    drawn = i;
    // Swap the poster <img> for the canvas once there is something on it.
    root.dataset.ready = 'true';
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(draw);
  };

  const progress = (): number => {
    const rect = root.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / scrollable));
  };

  const onScroll = () => {
    const index = Math.round(progress() * (count - 1));
    if (index === wanted) return;
    wanted = index;
    if (hint) hint.dataset.hidden = 'true';
    schedule();
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    drawn = -1; // canvas was cleared by resizing: force a redraw
    schedule();
  };

  // Decode once at no more than the canvas resolution, to keep memory in check.
  const toBitmap = async (img: HTMLImageElement): Promise<ImageBitmap | HTMLImageElement> => {
    if (typeof createImageBitmap !== 'function') return img;
    const scale = Math.min(1, canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    try {
      return await createImageBitmap(img, {
        resizeWidth: Math.max(1, Math.round(img.naturalWidth * scale)),
        resizeHeight: Math.max(1, Math.round(img.naturalHeight * scale)),
        resizeQuality: 'high',
      });
    } catch {
      return img;
    }
  };

  const load = async (i: number) => {
    if (requested.has(i)) return;
    requested.add(i);
    const img = new Image();
    img.src = src(i);
    try {
      await img.decode();
      frames[i] = await toBitmap(img);
      schedule();
    } catch {
      requested.delete(i);
    }
  };

  const preloadAll = async () => {
    const order: number[] = [];
    for (let i = 0; i < count; i += PRIORITY_STEP) order.push(i);
    for (let i = 0; i < count; i++) if (i % PRIORITY_STEP) order.push(i);
    const queue = order.filter((i) => !requested.has(i));
    const worker = async () => {
      while (queue.length) await load(queue.shift()!);
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  };

  // From here on the section is tall and sticky (see CarViewer.astro styles).
  root.dataset.scrub = 'true';
  resize();
  wanted = Math.round(progress() * (count - 1));
  load(0);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    resize();
    onScroll();
  });

  new IntersectionObserver(
    (entries, observer) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        preloadAll();
      }
    },
    { rootMargin: '100% 0px' },
  ).observe(root);
}
