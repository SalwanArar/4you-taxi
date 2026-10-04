/**
 * Scroll-driven car rotation (CLAUDE.md §6).
 * Scroll progress through the section maps linearly to a frame, drawn on a canvas.
 * Scrolling is the only control: no drag, no auto-rotation, no scroll hijacking.
 */

const PRIORITY_STEP = 4; // load every 4th frame first, then fill the gaps
const CONCURRENCY = 4;

export function initCarViewer(root: HTMLElement): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const base = root.dataset.frames ?? '';
  const ext = root.dataset.extension ?? '';
  const count = Number(root.dataset.count);
  const frameWidth = Number(root.dataset.width);
  const frameHeight = Number(root.dataset.height);
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  const poster = root.querySelector<HTMLImageElement>('img');
  const hint = root.querySelector<HTMLElement>('[data-hint]');
  const captions = Array.from(root.querySelectorAll<HTMLElement>('[data-caption]'));
  const ctx = canvas?.getContext('2d');
  if (!canvas || !poster || !ctx || !(count > 1) || !(frameWidth > 0) || !(frameHeight > 0)) return;

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

  // Each caption gets an equal slice of the turn, centred in it, and shows for most of that slice.
  const updateCaptions = (p: number) => {
    const n = captions.length;
    captions.forEach((el, i) => {
      const centre = (i + 1) / (n + 1);
      el.toggleAttribute('data-on', Math.abs(p - centre) < 0.4 / (n + 1));
    });
  };

  const onScroll = () => {
    const p = progress();
    updateCaptions(p);
    const index = Math.round(p * (count - 1));
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

  // Decode off the main thread where possible: fetch the file and let createImageBitmap decode
  // the blob (a worker-thread job in modern browsers). Falls back to <img> + decode().
  const decodeFrame = async (url: string): Promise<ImageBitmap | HTMLImageElement> => {
    if (typeof createImageBitmap === 'function') {
      try {
        const response = await fetch(url);
        if (response.ok) {
          // Decode at no more than the canvas resolution, to keep memory in check.
          const scale = Math.min(1, canvas.width / frameWidth, canvas.height / frameHeight);
          return await createImageBitmap(await response.blob(), {
            resizeWidth: Math.max(1, Math.round(frameWidth * scale)),
            resizeHeight: Math.max(1, Math.round(frameHeight * scale)),
            resizeQuality: 'medium',
          });
        }
      } catch {
        // fall through to <img>
      }
    }
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  };

  const load = async (i: number) => {
    if (requested.has(i)) return;
    requested.add(i);
    try {
      frames[i] = await decodeFrame(src(i));
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
