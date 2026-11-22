import { expect, test } from '@playwright/test';
import { business, pages } from './pages';

// The site exists to be called. Every call, WhatsApp and SMS link must reach the real number.
for (const { locale, path, dir } of pages) {
  test.describe(`contact (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test('page has the right language and direction', async ({ page }) => {
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('html')).toHaveAttribute('dir', dir);
    });

    test('every call link dials the business number', async ({ page }) => {
      const hrefs = await page
        .locator('a[href^="tel:"]')
        .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) expect(href).toBe(`tel:${business.phone.e164}`);
    });

    test('every WhatsApp link opens a chat with the business number', async ({ page }) => {
      const hrefs = await page
        .locator('a[href*="wa.me/"]')
        .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs)
        expect(href).toMatch(new RegExp(`^https://wa\\.me/${business.whatsapp}(\\?|$)`));
    });

    test('every SMS link texts the business number', async ({ page }) => {
      const hrefs = await page
        .locator('a[href^="sms:"]')
        .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs)
        expect(href).toMatch(new RegExp(`^sms:\\${business.phone.e164}(\\?|$)`));
    });

    test('every email link writes to the business address', async ({ page }) => {
      const hrefs = await page
        .locator('a[href^="mailto:"]')
        .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      if (business.email) expect(hrefs.length).toBeGreaterThan(0);
      else expect(hrefs).toEqual([]);
      for (const href of hrefs) expect(href).toBe(`mailto:${business.email}`);
    });

    test('the number is also shown as text', async ({ page }) => {
      await expect(page.getByText(business.phone.display).first()).toBeAttached();
    });

    test('a call button is on screen on arrival', async ({ page, isMobile }) => {
      // Phones: the fixed bar. Larger screens: the header's Call button.
      const call = page.locator(
        isMobile ? '.quick-contact a[href^="tel:"]' : 'header a[href^="tel:"]',
      );
      await expect(call).toBeInViewport();
    });

    test('structured data has the business phone number', async ({ page }) => {
      const json = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(JSON.parse(json ?? '{}')).toMatchObject({ telephone: business.phone.e164 });
    });
  });
}
