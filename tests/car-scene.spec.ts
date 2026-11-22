import { expect, test } from '@playwright/test';

// The hero story (CLAUDE.md §6): scrolling moves it through five scenes. Without the script, or
// with reduced motion, it must be one screen that shows the last scene with the call buttons.
const viewer = '[data-car-viewer]';

test('scrolling plays the scenes from the first to the last', async ({ page }) => {
  await page.goto('/');
  const section = page.locator(viewer);
  await expect(section).toHaveAttribute('data-scrub', 'true');
  await expect(section).toHaveAttribute('data-scene', '0');

  // Scroll to the end of the story: the bottom of the section meets the bottom of the screen.
  await page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement;
    window.scrollTo(0, el.offsetTop + el.offsetHeight - window.innerHeight);
  }, viewer);
  await expect(section).toHaveAttribute('data-scene', '4');
  await expect(section.locator('.car-drawing')).toBeVisible();
});

test('the last scene shows the call buttons', async ({ page, isMobile }) => {
  test.skip(isMobile, 'on phones the fixed call bar holds the buttons instead');
  await page.goto('/');
  await page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement;
    window.scrollTo(0, el.offsetTop + el.offsetHeight - window.innerHeight);
  }, viewer);
  await expect(page.locator(`${viewer} a.btn-call`)).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the hero is one screen with the car and a call link', async ({ page }) => {
    await page.goto('/');
    const section = page.locator(viewer);
    await expect(section).not.toHaveAttribute('data-scrub', /.*/);
    const ratio = await section.evaluate(
      (el) => el.getBoundingClientRect().height / window.innerHeight,
    );
    expect(ratio).toBeLessThan(1.5);
    await expect(section.locator('.car-drawing')).toBeVisible();
    await expect(section.locator('a[href^="tel:"]').first()).toBeVisible();
  });
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the hero is one screen and does not play', async ({ page }) => {
    await page.goto('/');
    const section = page.locator(viewer);
    await expect(section).not.toHaveAttribute('data-scrub', /.*/);
    await expect(section.locator('.car-drawing')).toBeVisible();
  });
});

test('if the scene script crashes, the hero falls back to one screen', async ({ page }) => {
  // Make the scene script throw part-way through setting up.
  await page.addInitScript(() => {
    const original = Element.prototype.querySelectorAll;
    Element.prototype.querySelectorAll = function (this: Element, selector: string) {
      if (selector === '[data-scroll-vars]') throw new Error('simulated failure');
      return original.call(this, selector);
    } as typeof original;
  });
  await page.goto('/', { waitUntil: 'load' });
  const section = page.locator(viewer);
  await expect(section).not.toHaveAttribute('data-scrub', /.*/);
  await expect(section.locator('.car-drawing')).toBeVisible();
});
