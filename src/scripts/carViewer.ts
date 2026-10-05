/**
 * Scroll-driven car rotation (CLAUDE.md §6).
 * Scroll progress through the section maps linearly to a frame, drawn on a canvas.
 * Scrolling is the only control: no drag, no auto-rotation, no scroll hijacking.
 */

const PRIORITY_STEP = 4; // load every 4th frame first, then fill the gaps
const CONCURRENCY = 4;
const REFLECTION_FADE = 0.38; // the reflection fades out over this share of the car's height

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
  const reflection = root.querySelector<HTMLCanvasElement>('[data-reflection]');
  const reflectionCtx = reflection?.getContext('2d');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !poster || !ctx || !(count > 1) || !(frameWidth > 0) || !(frameHeight > 0)) return;

  // Frames are kept as decoded bitmaps: drawing a plain <img> can make the browser decode the
  // WebP again on every draw, which stutters on slower phones.
  const frames: (ImageBitmap | HTMLImageElement | undefined)[] = new Array(count);
  // Where the wheels touch the ground in each frame, as a share of the frame height. The car sits
  // at a different height in each frame, so the reflection is mirrored around this line.
  const ground: number[] = new Array(count).fill(1);
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
    const x = (w - dw) / 2;
    const y = (h - dh) / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, x, y, dw, dh);
    if (reflectionCtx) drawReflection(img, x, y, dw, dh, ground[i]);
    drawn = i;
    // Swap the poster <img> for the canvas once there is something on it.
    root.dataset.ready = 'true';
  };

  // The reflection canvas sits half a stage lower than the main one (see CarViewer.astro).
  const drawReflection = (
    img: CanvasImageSource,
    x: number,
    y: number,
    dw: number,
    dh: number,
    groundShare: number,
  ) => {
    const r = reflectionCtx!;
    const { width: w, height: h } = canvas;
    const top = y - h / 2; // where the car's top edge is in this canvas
    const line = top + groundShare * dh;
    r.setTransform(1, 0, 0, 1, 0, 0);
    r.clearRect(0, 0, w, h);
    r.setTransform(1, 0, 0, -1, 0, 2 * line); // mirror around the ground line
    r.drawImage(img, x, top, dw, dh);
    r.setTransform(1, 0, 0, 1, 0, 0);
    const fade = r.createLinearGradient(0, line, 0, line + dh * REFLECTION_FADE);
    fade.addColorStop(0, '#000');
    fade.addColorStop(1, 'transparent');
    r.globalCompositeOperation = 'destination-in';
    r.fillStyle = fade;
    r.fillRect(0, 0, w, h);
    r.globalCompositeOperation = 'source-over';
  };

  // Lowest non-transparent row of a frame, read once from a narrow copy of it.
  const probe = document.createElement('canvas');
  const probeCtx = probe.getContext('2d', { willReadFrequently: true });
  const findGround = (img: ImageBitmap | HTMLImageElement): number => {
    if (!probeCtx) return 1;
    const pw = 32;
    const ph = img.height;
    probe.width = pw;
    probe.height = ph;
    probeCtx.drawImage(img, 0, 0, pw, ph);
    const { data } = probeCtx.getImageData(0, 0, pw, ph);
    for (let row = ph - 1; row >= 0; row--) {
      for (let col = 0; col < pw; col++) {
        if (data[(row * pw + col) * 4 + 3] > 8) return (row + 1) / ph;
      }
    }
    return 1;
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

  // Story mode (see Hero.astro): the scroll is split into scenes at `data-scene-edges`, and the
  // car turns only between `data-turn-start` and `data-turn-end`. Without them the car turns
  // through the whole section.
  const edges = (root.dataset.sceneEdges ?? '').split(',').filter(Boolean).map(Number);
  const turnStart = Number(root.dataset.turnStart ?? 0);
  const turnEnd = Number(root.dataset.turnEnd ?? 1);

  const frameFor = (p: number): number => {
    const turn = Math.min(1, Math.max(0, (p - turnStart) / (turnEnd - turnStart)));
    return Math.round(turn * (count - 1));
  };

  // Scroll position handed to CSS, so the drawings move with every scroll: --t0 and --t1 are the
  // progress through scenes 0 and 1 (0 to 1). The progress line's fills are scaled directly.
  const scrollVars = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-vars]'));
  const progressFills = Array.from(root.querySelectorAll<HTMLElement>('[data-progress-fill]'));
  const within = (p: number, i: number) => {
    const start = edges[i] ?? 0;
    const end = edges[i + 1] ?? 1;
    return Math.min(1, Math.max(0, (p - start) / (end - start)));
  };
  // Only changed values are written: a write restyles everything under that element.
  const written = new Map<HTMLElement, Record<string, string>>();
  const setVar = (el: HTMLElement, name: string, value: string) => {
    const last = written.get(el) ?? {};
    if (last[name] === value) return;
    last[name] = value;
    written.set(el, last);
    el.style.setProperty(name, value);
  };
  const updateScrollVars = (p: number) => {
    if (!edges.length) return;
    const values = {
      '--t0': within(p, 0).toFixed(3),
      '--t1': within(p, 1).toFixed(3),
    };
    for (const el of scrollVars) {
      for (const [name, value] of Object.entries(values)) setVar(el, name, value);
    }
    progressFills.forEach((el, i) => {
      const fill = within(p, i).toFixed(3);
      if (el.dataset.fill === fill) return;
      el.dataset.fill = fill;
      el.style.transform = `scaleX(${fill})`;
    });
  };

  const updateScene = (p: number) => {
    if (!edges.length) return;
    let scene = 0;
    edges.forEach((edge, i) => {
      if (p >= edge) scene = i;
    });
    if (root.dataset.scene !== String(scene)) root.dataset.scene = String(scene);
  };

  const onScroll = () => {
    const p = progress();
    updateCaptions(p);
    updateScene(p);
    updateScrollVars(p);
    if (hint && p > 0.01) hint.dataset.hidden = 'true';
    const index = frameFor(p);
    if (index === wanted) return;
    wanted = index;
    schedule();
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    if (reflection) {
      reflection.width = canvas.width;
      reflection.height = canvas.height;
    }
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
      const img = await decodeFrame(src(i));
      if (reflectionCtx) ground[i] = findGround(img);
      frames[i] = img;
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
  wanted = frameFor(progress());
  updateScene(progress());
  updateScrollVars(progress());
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
        // Leave the network to the first screen (poster, fonts) until the page has loaded.
        if (document.readyState === 'complete') preloadAll();
        else window.addEventListener('load', () => preloadAll(), { once: true });
      }
    },
    { rootMargin: '100% 0px' },
  ).observe(root);
}
