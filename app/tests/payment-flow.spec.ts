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

    // Mock successful checkout redirect
    await page.route('**/api/checkout', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ invoice_url: 'https://checkout-staging.xendit.co/web/test' })
      });
    });

    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-staging\.xendit\.co/);
  });
});
