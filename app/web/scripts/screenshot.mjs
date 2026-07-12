import { chromium } from '@playwright/test';

const [url, outPath = 'screenshot.png'] = process.argv.slice(2);

if (!url) {
  console.error('Usage: node scripts/screenshot.mjs <url> [outputPath]');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved screenshot to ${outPath}`);
