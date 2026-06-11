import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

test.describe('Fake Store E2E Automation (POM)', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  test.describe('Authentication Flow', () => {
    test('Valid Login - @smoke', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login('mor_2314', '83r5^_');
      await expect(page).toHaveURL('/');
      await expect(homePage.title).toBeVisible();
    });

    test('Invalid Login - @negative', async () => {
      await loginPage.goto();
      await loginPage.login('wrong_user', 'wrong_pass');
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Invalid username');
    });

    test('Logout Flow', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login('mor_2314', '83r5^_');
      await homePage.logoutButton.click();
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Search & Filter', () => {
    test.beforeEach(async () => {
      await loginPage.goto();
      await loginPage.login('mor_2314', '83r5^_');
    });

    test('Search for existing product', async () => {
      await homePage.search('Backpack');
      const count = await homePage.productCards.count();
      expect(count).toBeGreaterThan(0);
      await expect(homePage.productCards.first()).toContainText('Backpack');
    });

    test('Search for non-existent product - @ui-state', async () => {
      await homePage.search('NonExistentProductXYZ');
      await expect(homePage.emptyState).toBeVisible();
      await expect(homePage.emptyState).toContainText('No products found');
    });

    test('Filter by category', async ({ page }) => {
      await homePage.filterByCategory('electronics');
      await expect(homePage.productCards.first()).toBeVisible({ timeout: 15000 });
      
      // Verify that all displayed items belong to the selected category
      const categories = await page.locator('[data-test="product-category"]').allTextContents();
      expect(categories.length).toBeGreaterThan(0);
      for (const cat of categories) {
        expect(cat.toLowerCase()).toBe('electronics');
      }
    });
  });

  test.describe('Cart & Checkout Flow', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login('mor_2314', '83r5^_');
    });

    test('Full E2E Flow: Add to Cart and Verify', async ({ page }) => {
      // Handle checkout alert
      page.on('dialog', dialog => {
        expect(dialog.message()).toContain('Thanks for shopping');
        dialog.accept();
      });

      await homePage.addToCart(0);
      await homePage.addToCart(1);
      
      const cartCount = page.locator('[data-test="cart-count"]');
      await expect(cartCount).toHaveText('2');
      
      await homePage.cartLink.click();
      await expect(page).toHaveURL('/cart');
      
      const total = page.locator('[data-test="cart-total"]');
      await expect(total).toContainText('$');
      
      await page.locator('[data-test="checkout-btn"]').click();
    });
  });

  test.describe('API & Error States (Mocks)', () => {
    test('Server Error (500) State', async ({ page }) => {
      // Mock any product-related request to fail
      await page.route(/\/products/, async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
      
      await loginPage.goto();
      await loginPage.login('mor_2314', '83r5^_');
      
      const errorState = page.locator('[data-test="error-state"]');
      await expect(errorState).toBeVisible({ timeout: 15000 });
      await expect(errorState).toContainText('Failed to fetch');
    });

    test('Product 404 Detail State', async ({ page }) => {
      // Mock specific product ID to 404
      await page.route('**/products/999', async route => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Not Found' })
        });
      });
      
      await loginPage.goto();
      await loginPage.login('mor_2314', '83r5^_');
      await expect(page).toHaveURL('/');
      
      await page.goto('/product/999');
      const errorState = page.locator('[data-test="error-state"]');
      await expect(errorState).toBeVisible({ timeout: 15000 });
      // The catch block sets a custom message
      await expect(errorState).toContainText('find the product');
    });
  });
});
