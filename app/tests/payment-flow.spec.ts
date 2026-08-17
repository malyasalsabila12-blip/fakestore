import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';

test.describe('Payment & Simulation Flow', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    cartPage = new CartPage(page);

    // Mock auth and products to ensure we can reach the cart
    await page.route('**/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'fake-token' })
      });
    });

    await page.route('**/products', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { 
            id: 1, 
            title: 'Test Product', 
            price: 10, 
            description: 'Test Desc', 
            category: 'test', 
            image: 'https://placehold.co/400x400', 
            rating: { rate: 5, count: 1 } 
          }
        ])
      });
    });

    await loginPage.goto();
    await loginPage.login('malya', 'serverqa123');
  });

  test('Successful Payment Simulation Flow', async ({ page }) => {
    // 1. Add product to cart
    await homePage.addToCart(0);
    await homePage.cartLink.click();
    
    // Click the checkout button in the slide-over to go to the cart page
    await page.locator('[data-test="slideover-checkout"]').click();
    await expect(page).toHaveURL('/cart');

    // 2. Mock checkout failure to trigger simulation dialog
    // We expect this to happen because we haven't guaranteed the backend is running in the test env
    // OR we can explicitly mock it to fail
    await page.route('**/api/checkout', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Mocked Server Error' })
      });
    });

    // 3. Handle the confirmation dialog for simulation
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Would you like to SIMULATE a successful payment');
      await dialog.accept();
    });

    // 4. Click checkout
    await cartPage.checkout();

    // 5. Verify we are redirected to profile after simulation
    // Simulation has a timeout of 1.5s + 3s redirect
    await expect(page).toHaveURL('/profile', { timeout: 10000 });

    // 6. Navigate to orders tab and verify the order
    await page.locator('[data-test="profile-tab-orders"]').click();
    const orderItem = page.locator('[data-test="order-item"]').first();
    await expect(orderItem).toBeVisible();
    await expect(orderItem).toContainText('completed');
    await expect(orderItem).toContainText('Simulated Xendit Payment');
  });

  test('Payment Flow - Xendit Redirect', async ({ page }) => {
    await homePage.addToCart(0);
    await homePage.cartLink.click();

    await page.locator('[data-test="slideover-checkout"]').click();
    await expect(page).toHaveURL('/cart');

    // Remove the mock to allow the real backend to generate a valid Xendit URL
    await cartPage.checkout();
    
    // Wait for the redirect to Xendit Staging
    await expect(page).toHaveURL(/checkout-staging\.xendit\.co/, { timeout: 15000 });
    
    // Select QR Payments
    const qrOption = page.locator('button:has-text("QR Payments")');
    await qrOption.click();
    
    // Verify QRIS logo inside the expanded section is visible
    // We use a more specific locator to target the visible one
    const qrisLogo = page.locator('img[alt="QRIS"]').filter({ visible: true }).first();
    await expect(qrisLogo).toBeVisible({ timeout: 15000 });
    
    // In staging, we want to actually pay. We look for the simulation button.
    // Xendit staging often has a "Simulate" button for test payments.
    const simulateBtn = page.locator('button:has-text("simulate")').or(page.locator('button:has-text("Pay Now")'));
    if (await simulateBtn.isVisible()) {
      await simulateBtn.click();
      // Wait for redirect back to the app profile
      await expect(page).toHaveURL(/\/profile/, { timeout: 30000 });
    }
  });

  test('Minimum Payment Amount Validation', async ({ page }) => {
    // Mock a very cheap product to trigger the IDR 10,000 minimum check
    // This override should happen before actions in the test
    await page.route('**/products', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 99, title: 'Cheap Item', price: 0.1, category: 'test', image: 'https://placehold.co/400', rating: { rate: 5, count: 1 } }
        ])
      });
    });

    // We need to reload to get the new mocked products
    await page.reload();
    
    await homePage.addToCart(0);
    await homePage.gotoCart();

    // Handle the alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('below the minimum required');
      await dialog.accept();
    });

    await cartPage.checkout();
  });

  test('Promo Code Application', async ({ page }) => {
    await homePage.addToCart(0);
    await homePage.gotoCart();

    const initialTotalText = await cartPage.cartTotal.innerText();
    
    await cartPage.applyPromo('SAVE10');

    const newTotalText = await cartPage.cartTotal.innerText();
    expect(newTotalText).not.toBe(initialTotalText);
    await expect(page.locator('text=Discount (SAVE10)')).toBeVisible();
  });

  test('Empty Cart State', async ({ page }) => {
    await cartPage.goto();
    await expect(cartPage.emptyCartMessage).toBeVisible();
    await expect(cartPage.checkoutButton).not.toBeVisible();
  });
});
