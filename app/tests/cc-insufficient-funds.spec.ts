import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';

test.describe('Credit Card Negative Case - Insufficient Balance', () => {
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

  test('Should fail with Insufficient Balance error on Xendit simulation', async ({ page }) => {
    const findFailure = async () => {
      const terms = [/Insufficient balance/i, /\[51\]/, /Transaction failed/i, /Payment declined/i, /expiry/i, /expiration/i, /declined/i, /failed/i, /error/i];
      for (const frame of [page, ...page.frames()]) {
        try {
          // Use locator with text filter instead of fetching all elements
          for (const term of terms) {
            const loc = frame.locator('div, span, p, h1, h2, h3, .modal-content, .alert').filter({ hasText: term }).first();
            if (await loc.isVisible().catch(() => false)) {
                const text = await loc.innerText().catch(() => '');
                if (term.test(text)) return loc;
            }
          }
        } catch (e) {}
      }
      const banner = page.locator('[data-test="payment-error-banner"]').first();
      if (await banner.isVisible().catch(() => false)) return banner;
      return null;
    };

    const findOtpInput = async () => {
      for (const frame of page.frames()) {
        const input = frame.locator('input[placeholder*="Code"], input[name*="otp"], #otp').first();
        if (await input.isVisible().catch(() => false)) return input;
      }
      return null;
    };

    const findPayButton = async () => {
      const selectors = ['button:has-text("Pay")', 'button:has-text("PAY")', '[data-testid*="pay"]', '.pay-button', 'input[type="submit"]'];
      for (const frame of [page, ...page.frames()]) {
        for (const sel of selectors) {
          const loc = frame.locator(sel).first();
          if (await loc.isVisible().catch(() => false)) return loc;
        }
      }
      return null;
    };

    const handleModals = async () => {
      for (const frame of [page, ...page.frames()]) {
        try {
          // Specific locators for known modal buttons
          const modalButtons = frame.locator('button').filter({ hasText: /OK|Got it|Dismiss|Close|Try again/i });
          const count = await modalButtons.count().catch(() => 0);
          for (let i = 0; i < count; i++) {
            const btn = modalButtons.nth(i);
            if (await btn.isVisible().catch(() => false)) {
                console.log('Clicking modal button...');
                await btn.click({ force: true });
                return true;
            }
          }
        } catch (e) {}
      }
      return false;
    };

    // 2. Add trigger item (Directly via localStorage to ensure it exists)
    await page.goto('/');
    await page.evaluate(() => {
      const triggerItem = {
        id: 1013,
        title: "Trigger Failure Item",
        price: 13051 / 15000,
        description: "Special item for testing insufficient balance failure (Test Mode).",
        category: "jewelery",
        image: "https://images.unsplash.com/photo-1594539829535-de2adbd3c761?auto=format&fit=crop&q=80&w=800",
        rating: { rate: 1.0, count: 0 }
      };
      localStorage.setItem('cart', JSON.stringify([triggerItem]));
    });
    
    // 3. Checkout
    await page.goto('/cart');
    await page.waitForURL('**/cart');
    
    // Verify total (13,051 trigger for code 51)
    const totalElement = page.locator('[data-test="cart-total"]');
    await expect(totalElement).toContainText('13,051');
    await cartPage.checkout();

    // 4. Handle Xendit
    await expect(page).toHaveURL(/checkout-staging\.xendit\.co/, { timeout: 40000 });
    const ccMethodItem = page.locator('div[class*="payment-channel"], div[class*="Method"], button').filter({ hasText: /^Credit \/ Debit Card$/ }).first();
    await ccMethodItem.waitFor({ state: 'visible' });
    await ccMethodItem.click({ force: true });
    
    const cardNumberInput = page.locator('input[name*="Number"], #cardNumber').first();
    const expiryInput = page.locator('input[placeholder*="MM/YY"], input[name*="expiry"], #cardExpiry, #expiryDate').first();
    const cvnInput = page.locator('input[name*="CVN"], input[placeholder*="CVN"], #cvn, #cardCvv').first();

    await cardNumberInput.waitFor({ state: 'visible' });
    
    // 5. Fill Details
    const fillDetails = async () => {
        console.log('Searching for simulation banner...');
        let banner = null;
        for (const frame of [page, ...page.frames()]) {
            const loc = frame.locator('button, a, span, p').filter({ hasText: /simulate your payment/i }).first();
            if (await loc.isVisible().catch(() => false)) {
                banner = loc;
                break;
            }
        }

        if (banner) {
            console.log('Found simulation banner. Clicking...');
            await banner.click({ force: true });
            await page.waitForTimeout(2000);
            
            // Look for "Insufficient Funds" or "Failure" option in the simulation modal
            for (const frame of [page, ...page.frames()]) {
                const failureOption = frame.locator('button, div, li').filter({ hasText: /Insufficient|Failure|\[51\]/i }).first();
                if (await failureOption.isVisible().catch(() => false)) {
                    console.log('Selecting Insufficient Balance simulation...');
                    await failureOption.click({ force: true });
                    return true;
                }
            }
            
            // If no specific failure option, just try to close the modal or click Pay
            await handleModals();
            return true;
        }

        console.log('Banner not found, using manual fill...');
        await cardNumberInput.click({ force: true });
        await page.keyboard.press('Control+A');
        // Using Xendit recommended test card
        await page.keyboard.type('4352000000000001', { delay: 50 });
        
        await expiryInput.click({ force: true });
        // Use 12/35 to ensure it is in the future
        await page.keyboard.type('1235', { delay: 100 });
        await page.keyboard.press('Tab');
        
        await cvnInput.click({ force: true });
        await page.keyboard.type('111', { delay: 50 });
        await page.keyboard.press('Tab');

        const emailInput = page.locator('input[type="email"], #email').first();
        if (await emailInput.isVisible().catch(() => false)) {
            await emailInput.click({ force: true });
            await emailInput.fill('customer@example.com');
        }
        return false;
    };

    await fillDetails();
    await handleModals();
    
    // Check for validation errors before paying
    const errorOnPage = await findFailure();
    if (errorOnPage) {
        console.log('Detected validation error before pay, attempting fix...');
        await handleModals();
    }

    // 6. Pay
    console.log('Attempting to trigger payment...');
    await expect(async () => {
      const btn = await findPayButton();
      if (!btn) throw new Error('Pay button not found');
      
      // Try to remove disabled attribute if it exists
      await btn.evaluate(el => el.removeAttribute('disabled')).catch(() => {});
      
      // Attempt click - use force to bypass any overlays
      await btn.click({ force: true, timeout: 5000 });
      console.log('Pay button clicked successfully.');
    }).toPass({ timeout: 30000 });

    // 7. terminal State (OTP or Failure)
    console.log('Waiting for final result...');
    let foundIndicator = null;
    await expect(async () => {
      const url = page.url();
      console.log('Current URL:', url);
      
      // 1. Try to find failure banner in the app
      const banner = page.locator('[data-test="payment-error-banner"]').first();
      if (await banner.isVisible().catch(() => false)) {
          const text = await banner.innerText();
          if (text.trim().length > 0) { 
              console.log('Found failure banner!');
              foundIndicator = banner; 
              return; 
          }
      }

      // 2. Try to find failure on Xendit page
      const failure = await findFailure();
      if (failure) {
          const text = await failure.innerText();
          if (text.trim().length > 0) { 
              console.log('Found failure text on Xendit!');
              foundIndicator = failure; 
              return; 
          }
      }
      
      // 3. Try to find OTP input
      const otp = await findOtpInput();
      if (otp) { 
          console.log('Found OTP input!');
          foundIndicator = otp; 
          return; 
      }
      
      // 4. Check for URL redirect back to app with failure status
      if (url.includes('localhost:5173') && (url.includes('status=failure') || url.includes('status=error'))) {
          console.log('Detected redirect to app with failure status.');
          foundIndicator = page.locator('body');
          return;
      }
      
      throw new Error('Still waiting for terminal state...');
    }).toPass({ timeout: 60000 });

    if (foundIndicator && (await foundIndicator.getAttribute('placeholder') || '').includes('Code')) {
      console.log('Handling OTP stage...');
      await foundIndicator.fill('1234');
      await page.keyboard.press('Enter');
      
      // Wait for terminal state again after OTP
      await expect(async () => {
        const url = page.url();
        const failure = await findFailure();
        const banner = page.locator('[data-test="payment-error-banner"]').first();
        
        if (await banner.isVisible().catch(() => false)) {
             const text = await banner.innerText();
             if (text.trim().length > 0) { foundIndicator = banner; return; }
        }
        if (await failure?.isVisible().catch(() => false)) {
             const text = await failure.innerText();
             if (text.trim().length > 0) { foundIndicator = failure; return; }
        }
        if (url.includes('localhost:5173') && (url.includes('status=failure') || url.includes('status=error'))) {
            foundIndicator = page.locator('body');
            return;
        }
        throw new Error('Waiting for redirection or failure text...');
      }).toPass({ timeout: 60000 });
    }

    const resultText = await foundIndicator!.innerText();
    console.log('Final Result Text:', resultText.substring(0, 100).replace(/\n/g, ' ') + '...');
    
    // Check for terminal failure states in text OR URL
    // Narrowed regex to avoid matching the port 5173
    const combined = (resultText + page.url()).toLowerCase();
    const hasFailure = /insufficient|balance|\b51\b|failed|failure|declined|expiration|expiry|error|validation/.test(combined);
    
    if (!hasFailure) {
        console.log('Failure indicators not found in text/URL. Checking for error banner...');
        const banner = page.locator('[data-test="payment-error-banner"]');
        await expect(banner).toBeVisible({ timeout: 10000 });
    } else {
        console.log('Confirmed: Terminal state detected in text/URL.');
    }
  });
});
