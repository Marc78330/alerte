import { chromium } from 'playwright-core';
const exe = '/Users/maz/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errs = [];
page.on('pageerror', e => errs.push(String(e).split('\n')[0]));
page.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errs.push(m.text().slice(0, 140)); });

// fresh context → super admin login
await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle' });
await page.fill('input[name="email"]', 'superadmin@clubsafe.fr');
await page.fill('input[name="password"]', 'admin123');
await page.click('button[type="submit"]');
await page.waitForTimeout(2000);
console.log('1) super admin →', page.url());

const platText = await page.locator('body').innerText();
console.log('2) plateforme shows clubs list:', platText.includes('FC Étoile Sportive'));
console.log('3) has create form:', (await page.locator('#name').count()) > 0);

// navigate to dashboard as super admin
await page.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const dbody = await page.locator('body').innerText();
console.log('4) dashboard shows Plateforme link:', dbody.includes('Plateforme'));

console.log('errors:', errs.length ? errs.join(' | ') : 'none');
await browser.close();