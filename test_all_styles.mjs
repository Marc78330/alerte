import { chromium } from 'playwright-core';
const exe = '/Users/maz/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errs = [];
page.on('pageerror', e => errs.push(String(e).split('\n')[0]));
page.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errs.push('[console] ' + m.text().slice(0, 120)); });
await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle' });
await page.fill('input[name="email"]', 'admin@fc-etoile.fr');
await page.fill('input[name="password"]', 'admin123');
await page.click('button[type="submit"]');
await page.waitForTimeout(1500);
await page.goto('http://localhost:3000/admin/affiche', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const cards = await page.locator('button[aria-pressed]');
console.log('style cards:', await cards.count());

const checked = [];
for (const [idx, [label, snippet]] of [
  ['Street', 'PARLE.'],
  ['Néon', 'PARLE.'],
  ['Y2K', 'PAS SEUL'],
  ['Éditorial', 'OSEZ EN PARLER'],
].entries()) {
  await page.click(`button[aria-pressed="false"]:has-text("${label}")`);
  await page.waitForTimeout(700);
  const previewOk = (await page.getByText(`Aperçu — ${label}`).count()) > 0;
  const bodyNow = await page.locator('.print-page').innerText();
  const snippetOk = bodyNow.includes(snippet);
  checked.push(`${label}(prev=${previewOk},txt=${snippetOk})`);
}
console.log('variants:', checked.join(' | '));
console.log('QR in preview:', (await page.locator('.print-page img[alt="QR code de signalement"]').count()) > 0);

await page.click('button[aria-pressed="false"]:has-text("Sport")');
await page.click('button:has-text("Mémoriser ce style")');
await page.waitForTimeout(1200);
console.log('page errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();