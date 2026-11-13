/**
 * The hero story (see CarViewer.astro and Hero.astro): scroll progress through the section is
 * split into scenes at `data-scene-edges`. The current scene goes on the section as `data-scene`,
 * and the progress through each scene (0 to 1) goes to CSS as --t0 … --t4, which moves the
 * drawings and the car. Scrolling is the only control: no drag, no autoplay, no scroll hijacking.
 */

export function initCarViewer(root: HTMLElement): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const edges = (root.dataset.sceneEdges ?? '').split(',').filter(Boolean).map(Number);
  if (!edges.length) return;

  const hint = root.querySelector<HTMLElement>('[data-hint]');
  const scrollVars = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-vars]'));
  const progressFills = Array.from(root.querySelectorAll<HTMLElement>('[data-progress-fill]'));
  let raf = 0;

  const progress = (): number => {
    const rect = root.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / scrollable));
  };

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

  const update = () => {
    raf = 0;
    const p = progress();

    let scene = 0;
    edges.forEach((edge, i) => {
      if (p >= edge) scene = i;
    });
    if (root.dataset.scene !== String(scene)) root.dataset.scene = String(scene);

    const values = edges.map((_, i) => within(p, i).toFixed(3));
    for (const el of scrollVars) {
      values.forEach((value, i) => setVar(el, `--t${i}`, value));
    }
    progressFills.forEach((el, i) => {
      const fill = values[i] ?? '0';
      if (el.dataset.fill === fill) return;
      el.dataset.fill = fill;
      el.style.transform = `scaleX(${fill})`;
    });

    if (hint && p > 0.01) hint.dataset.hidden = 'true';
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  // From here on the section is tall and sticky (see CarViewer.astro styles).
  root.dataset.scrub = 'true';
  update();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
}
