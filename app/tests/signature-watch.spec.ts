import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';

test.describe('Signature Watch E2E Payment Flow', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);

    test.setTimeout(180000);

    // 1. Login
    await loginPage.goto();
    await loginPage.login('malyasqa', 'serverqa123');
    // Anchor the regex to ensure we are at the root, not /login
    await expect(page).toHaveURL(/\/$/, { timeout: 30000 });
    // Wait for a home-page specific element
    await page.waitForSelector('[data-test="home-title"]', { timeout: 20000 });
  });

  test('Checkout and Pay for Signature Watch via Credit Card', async ({ page }) => {
    // 2. Add Signature Watch to Cart directly via Home Page (it should be the first item or we search)
    await page.goto('/');
    
    // Explicitly wait for products to load
    await page.waitForSelector('[data-test^="product-card-"]', { timeout: 30000 });
    
    await homePage.addProductToCart('Malstro Signature Watch');
    
    // 3. Go to Cart and Checkout
    await homePage.goToCart();
    // Wait for the cart page to fully load
    await page.waitForURL('**/cart');
    await expect(page).toHaveURL(/\/cart$/);
    await cartPage.checkout();

    // 4. Handle Xendit Redirect and Select Credit Card
    console.log('Waiting for Xendit redirect...');
    await expect(page).toHaveURL(/checkout-staging\.xendit\.co/, { timeout: 40000 });

    console.log('Selecting Credit Card method...');
    
    // Target only the Credit Card payment method
    const ccMethodItem = page.locator('div[class*="payment-channel"], div[class*="Method"], button').filter({ hasText: /^Credit \/ Debit Card$/ }).first();
    await ccMethodItem.waitFor({ state: 'visible', timeout: 10000 });
    await ccMethodItem.click({ force: true });
    
    // Wait specifically for the Credit Card form to be active
    await page.locator('input[name*="Number"], #cardNumber').first().waitFor({ state: 'visible', timeout: 15000 });
    console.log('Confirmed: Credit Card form is now active.');
    
    // 5. Fill Simulation Details (Official Xendit Challenge Card)
    console.log('Filling simulation details...');
    
    const findAndClickSimulate = async () => {
        // Specifically target the Credit Card simulation trigger
        const bannerLink = page.locator('a, button, [role="button"], span').filter({ hasText: /simulate your payment with Credit Card/i }).first();
        if (await bannerLink.isVisible({ timeout: 15000 }).catch(() => false)) {
            console.log('Found Credit Card simulation trigger. Clicking...');
            await bannerLink.click({ force: true });
            return true;
        }
        return false;
    };

    if (!(await findAndClickSimulate())) {
        console.log('CC Simulation trigger not found. Manual fill required (skipped for this script).');
        // Manual fill logic could go here if needed, but we prefer the simulator for E2E consistency
    }

    // 6. Trigger Payment
    console.log('Triggering payment...');
    const payNowBtn = page.locator('button[data-testid="pay-now"], button:has-text("Pay"), button:has-text("PAY")').first();
    await page.waitForTimeout(2000);
    await payNowBtn.click({ force: true }).catch(() => payNowBtn.evaluate(el => (el as HTMLElement).click()));

    // 7. Handle 3DS OTP
    console.log('Handling 3DS OTP...');
    const handledFrames = new Set<string>();
    for (let i = 0; i < 60; i++) {
        if (page.url().includes('/cart')) break;

        for (const frame of page.frames()) {
            const frameUrl = frame.url();
            if (handledFrames.has(frameUrl)) continue;

            try {
                const otpInput = frame.locator('input[placeholder*="Code"], input[name*="otp"], #otp, .otp-input').first();
                if (await otpInput.isVisible({ timeout: 500 }).catch(() => false)) {
                    console.log(`Entering OTP 1234 in frame: ${frameUrl}`);
                    await otpInput.fill('1234');
                    const submitBtn = frame.locator('button:has-text("SUBMIT"), button:has-text("OK"), button:has-text("Verify")').first();
                    if (await submitBtn.isVisible()) await submitBtn.evaluate(el => (el as HTMLElement).click());
                    else await otpInput.press('Enter');
                    
                    handledFrames.add(frameUrl);
                    await page.waitForTimeout(5000);
                    break;
                }
            } catch (e) {}
        }
        await page.waitForTimeout(1000);
    }

    // 8. Verify Final Success
    await page.goto('/profile');
    await page.locator('[data-test="profile-tab-orders"]').click();
    const firstOrder = page.locator('[data-test="order-item"]').first();
    await expect(firstOrder).toBeVisible({ timeout: 20000 });
    // Verifying total amount instead of title which is in details view
    await expect(firstOrder).toContainText(/4,499,850/i);
    await expect(firstOrder).toContainText(/completed/i);
    console.log('E2E Test Passed: Signature Watch purchased successfully!');
  });
});
