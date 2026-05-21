const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('BAD RESPONSE:', response.url(), response.status());
    }
  });

  await page.goto('https://new-phonebook.vercel.app/login');
  
  // Try to login
  await page.fill('input[type="email"]', 'pramodh5555@gmail.com');
  await page.fill('input[type="password"]', '123123');
  await page.click('button[type="submit"]');
  
  // Wait for 5 seconds to see what happens
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
