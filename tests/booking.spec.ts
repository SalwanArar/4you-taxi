import { expect, test, type Page } from '@playwright/test';
import { business, pages } from './pages';
import { content } from '../src/data/site';

const pad = (n: number) => String(n).padStart(2, '0');
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Catches what the form would open instead of leaving the page. */
async function recordOpenedLinks(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { opened: string[] }).opened = [];
    window.open = (url?: string | URL) => {
      (window as unknown as { opened: string[] }).opened.push(String(url));
      return null;
    };
  });
}
const openedLinks = (page: Page) =>
  page.evaluate(() => (window as unknown as { opened: string[] }).opened);

async function fill(page: Page, date: string, time: string) {
  const form = page.locator('[data-booking]');
  await form.locator('[data-date]').fill(date);
  await form.locator('[data-time]').fill(time);
  await form.locator('input[name="pickup"]').fill('Jönköpings central');
  await form.locator('input[name="destination"]').fill('Jönköping Airport');
  await form.locator('input[name="childSeat"]').check();
}

for (const { locale, path } of pages) {
  test.describe(`booking (${locale})`, () => {
    const t = content[locale].booking;

    test.beforeEach(async ({ page }) => {
      await recordOpenedLinks(page);
      await page.goto(path);
      await page.locator('#book').scrollIntoViewIfNeeded();
    });

    test('writes a WhatsApp message with every answer', async ({ page }) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await fill(page, isoDate(tomorrow), '07:30');
      await page.locator('[data-booking] button[value="whatsapp"]').click();

      const [link] = await openedLinks(page);
      expect(link).toMatch(new RegExp(`^https://wa\\.me/${business.whatsapp}\\?text=`));
      const message = decodeURIComponent(new URL(link).searchParams.get('text') ?? '');
      expect(message).toContain(t.message.greeting);
      expect(message).toContain(`${t.message.date}: ${isoDate(tomorrow)}`);
      expect(message).toContain(`${t.message.time}: 07:30`);
      expect(message).toContain(`${t.message.pickup}: Jönköpings central`);
      expect(message).toContain(`${t.message.destination}: Jönköping Airport`);
      expect(message).toContain(`${t.message.childSeat}: ${t.message.yes}`);
    });

    test('refuses a time that has already passed today', async ({ page }) => {
      const now = new Date();
      test.skip(
        now.getHours() === 0 && now.getMinutes() === 0,
        'no earlier time exists at midnight',
      );
      await fill(page, isoDate(now), '00:00');
      await page.locator('[data-booking] button[value="whatsapp"]').click();

      expect(await openedLinks(page)).toEqual([]);
      await expect(page.locator('[data-time]')).toHaveJSProperty('validationMessage', t.pastTime);
    });

    test('does not allow a date before today', async ({ page }) => {
      await expect(page.locator('[data-date]')).toHaveAttribute('min', isoDate(new Date()));
    });
  });
}
