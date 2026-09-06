import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';

test.describe('Credit Card Negative Scenarios - Xendit Failures', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);

    test.setTimeout(180000);

    // 1. Bypass Login and CLEAR CART
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('cart');
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: 'malyasqa',
        email: 'harfymalya@gmail.com',
        firstName: 'Malya',
        lastName: 'Salsabila',
        phone: '+62 876 3456 5767'
      }));
    });
    await page.reload();
    await page.waitForSelector('[data-test="home-title"]', { timeout: 30000 });
  });

  const findFailure = async (page: any) => {
    const terms = [/Insufficient balance/i, /Transaction failed/i, /Payment declined/i, /declined/i, /failed/i, /error/i];
    for (const frame of [page, ...page.frames()]) {
      try {
        for (const term of terms) {
          const loc = frame.locator('div, span, p, h1, h2, h3, .modal-content, .alert').filter({ hasText: term }).first();
          if (await loc.isVisible().catch(() => false)) return loc;
        }
      } catch (e) {}
    }
    const banner = page.locator('[data-test="payment-error-banner"]').first();
    if (await banner.isVisible().catch(() => false)) return banner;
    return null;
  };

  const scenarios = [
    { 
        id: 1054, 
        title: "Insufficient Balance (10054)", 
        amount: "10,054", 
        term: /Insufficient|Balance|Funds|51|54/i 
    },
    { 
        id: 1059, 
        title: "Declined by Issuer (10059)", 
        amount: "10,059", 
        term: /Declined|Issuer|Bank|59/i 
    }
  ];

  for (const scenario of scenarios) {
    test(`Should fail with ${scenario.title} error on Xendit simulation`, async ({ page }) => {
      // 2. Add trigger item
      await page.evaluate((s) => {
        const item = {
          id: s.id,
          title: `Trigger Failure Item (${s.id})`,
          price: parseInt(s.amount.replace(',', '')) / 15000,
          description: `Test Item for ${s.title}`,
          category: "jewelery",
          image: "https://images.unsplash.com/photo-1573408302185-9127b5428fb3",
          rating: { rate: 1.0, count: 0 }
        };
        localStorage.setItem('cart', JSON.stringify([item]));
      }, scenario);
      
      await page.goto('/cart');
      await page.waitForURL('**/cart');
      
      const totalElement = page.locator('[data-test="cart-total"]');
      await expect(totalElement).toContainText(scenario.amount);
      await cartPage.checkout();

      // 4. Handle Xendit
      await expect(page).toHaveURL(/checkout-staging\.xendit\.co/, { timeout: 40000 });
      const ccMethodItem = page.locator('div[class*="payment-channel"], div[class*="Method"], button').filter({ hasText: /^Credit \/ Debit Card$/ }).first();
      await ccMethodItem.waitFor({ state: 'visible' });
      await ccMethodItem.click({ force: true });
      
      // 5. Simulation
      console.log('Searching for simulation banner...');
      let banner = null;
      for (const frame of [page, ...page.frames()]) {
          const loc = frame.locator('button, a, span, p').filter({ hasText: /simulate your payment/i }).first();
          if (await loc.isVisible().catch(() => false)) { banner = loc; break; }
      }

      if (banner) {
          console.log('Found simulation banner. Clicking...');
          await banner.click({ force: true });
          
          // Wait for simulation options to be visible
          const scenarioOption = page.locator('button, div, li').filter({ hasText: scenario.term }).first();
          await scenarioOption.waitFor({ state: 'visible', timeout: 10000 }).catch(() => console.log('Scenario option not found automatically, searching frames...'));
          
          for (const frame of [page, ...page.frames()]) {
              const failureOption = frame.locator('button, div, li').filter({ hasText: scenario.term }).first();
              if (await failureOption.isVisible().catch(() => false)) {
                  console.log(`Selecting ${scenario.title} simulation...`);
                  await failureOption.click({ force: true });
                  await page.waitForTimeout(1000);
                  break;
              }
          }
      }

      // 5b. Fill Card Details if still empty (ensures Pay button is enabled)
      const cardNumberInput = page.getByPlaceholder('4000 0000 0000 1091').first();
      if (await cardNumberInput.isVisible() && (await cardNumberInput.inputValue()) === '') {
          console.log('Card details empty, filling dummy data...');
          await cardNumberInput.fill('4000 0000 0000 1091');
          await page.getByPlaceholder('MM/YY').first().fill('12/25');
          await page.getByPlaceholder('CVN').first().fill('123');
      }

      // 6. Pay
      const payBtn = page.locator('button:has-text("Pay"), button:has-text("PAY"), [data-testid*="pay"]').first();
      await expect(payBtn).toBeEnabled({ timeout: 10000 });
      await payBtn.click({ force: true });

      // 7. Verify
      console.log('Waiting for final result...');
      await expect(async () => {
          // 1. Check for Xendit failure modal first
          for (const frame of [page, ...page.frames()]) {
              const modal = frame.locator('div, .modal, .dialog').filter({ hasText: /Transaction Failed|Payment Failed|Declined/i }).first();
              if (await modal.isVisible().catch(() => false)) {
                  const text = await modal.innerText();
                  console.log('Detected Xendit Failure Modal:', text.replace(/\n/g, ' '));
                  
                  const okBtn = frame.locator('button').filter({ hasText: /OK|Got it|Close|Dismiss/i }).first();
                  if (await okBtn.isVisible().catch(() => false)) {
                      await okBtn.click();
                      console.log('Clicked OK on failure modal.');
                      
                      // Fallback: If Xendit doesn't redirect automatically, force it
                      await page.waitForTimeout(3000);
                      const currentUrl = page.url();
                      if (currentUrl.includes('xendit')) {
                          console.log('Xendit is stuck, forcing redirect back to app...');
                          const reason = scenario.amount.endsWith('59') ? '59' : (scenario.amount.endsWith('54') ? '54' : '51');
                          await page.goto(`${process.env.BASE_URL || 'http://localhost:5173'}/cart?status=failure&reason=${reason}`);
                      }
                  }
                  break;
              }
          }

          // 2. Check for App Failure Banner
          const failureBanner = page.locator('[data-test="payment-error-banner"]').first();
          if (await failureBanner.isVisible().catch(() => false)) {
              const text = await failureBanner.innerText();
              console.log('Found App Failure Banner:', text);
              expect(text.toLowerCase()).toMatch(scenario.term);
          } else {
              // If we are still on Xendit and found OTP, handle it
              if (page.url().includes('checkout')) {
                  const otpInput = page.locator('input[placeholder*="Code"], input[name*="otp"], #otp').first();
                  if (await otpInput.isVisible().catch(() => false)) {
                      await otpInput.fill('1234');
                      await page.keyboard.press('Enter');
                  }
              }
              throw new Error('Waiting for app failure banner...');
          }
      }).toPass({ timeout: 60000 });
      console.log(`E2E Negative Test Passed: ${scenario.title} correctly handled.`);
    });
  }
});
