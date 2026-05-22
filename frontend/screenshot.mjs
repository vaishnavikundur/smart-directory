import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'landing.png', fullPage: true });
  
  console.log('Screenshot saved to landing.png');
  await browser.close();
})();
