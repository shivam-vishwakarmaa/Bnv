const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  const browser = await puppeteer.launch({ defaultViewport: { width: 1280, height: 800 } });
  const page = await browser.newPage();

  // 1. Product Grid
  await page.goto('http://[::1]:4173', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshots/grid.png', fullPage: true });

  // 2. Product Detail Page
  // We'll click the first product
  await page.click('a[href^="/products/"]');
  await page.waitForSelector('h2:has-text("Customer Reviews")', { timeout: 5000 }).catch(() => {});
  // wait a bit for images
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/detail.png', fullPage: true });

  // 3. Review form showing a validation error
  // Click submit without filling form
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'screenshots/error.png', fullPage: true });

  // 4. Mobile layout
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('http://[::1]:4173', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshots/mobile.png', fullPage: true });

  await browser.close();
  console.log("Screenshots saved successfully.");
})();
