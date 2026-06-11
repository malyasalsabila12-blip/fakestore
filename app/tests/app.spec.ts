import { test, expect } from '@playwright/test';

test.describe('Fake Store Comprehensive Tests', () => {
  
  test.describe('Authentication', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('valid login should redirect to home', async ({ page }) => {
      await page.fill('[data-test="username-input"]', 'mor_2314');
      await page.fill('[data-test="password-input"]', '83r5^_');
      await page.click('[data-test="login-submit"]');

      await expect(page).toHaveURL('/');
      await expect(page.locator('[data-test="home-title"]')).toBeVisible();
      await expect(page.locator('[data-test="nav-username"]')).toContainText('mor_2314');
    });

    test('invalid login should show error message', async ({ page }) => {
      await page.fill('[data-test="username-input"]', 'invalid_user');
      await page.fill('[data-test="password-input"]', 'invalid_pass');
      await page.click('[data-test="login-submit"]');

      const errorMsg = page.locator('[data-test="login-error"]');
      await expect(errorMsg).toBeVisible();
      await expect(errorMsg).toContainText('Invalid username or password');
    });

    test('unauthorized access should redirect to login', async ({ page }) => {
      // Clear storage to ensure logged out
      await page.context().clearCookies();
      await page.goto('/');
      await expect(page).toHaveURL('/login');
    });

    test('logout should clear session', async ({ page }) => {
      // Login first
      await page.fill('[data-test="username-input"]', 'mor_2314');
      await page.fill('[data-test="password-input"]', '83r5^_');
      await page.click('[data-test="login-submit"]');
      
      await expect(page.locator('[data-test="logout-btn"]')).toBeVisible();
      await page.click('[data-test="logout-btn"]');
      
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Home Page & UI States', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('[data-test="username-input"]', 'mor_2314');
      await page.fill('[data-test="password-input"]', '83r5^_');
      await page.click('[data-test="login-submit"]');
      await expect(page).toHaveURL('/');
    });

    test('should show loading state then products', async ({ page }) => {
      // Products should eventually appear
      const productGrid = page.locator('[data-test="product-grid"]');
      await expect(productGrid).toBeVisible({ timeout: 15000 });
      const productCards = page.locator('[data-test^="product-card-"]');
      await expect(productCards.first()).toBeVisible();
    });

    test('should handle API error state', async ({ page }) => {
      // Intercept and fail the products request
      await page.route('**/products', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });
      
      // Navigate again to trigger the mocked request
      await page.goto('/');
      const errorState = page.locator('[data-test="error-state"]');
      await expect(errorState).toBeVisible({ timeout: 15000 });
      await expect(errorState).toContainText('Failed to fetch products');
    });
  });

  test.describe('Detail Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('[data-test="username-input"]', 'mor_2314');
      await page.fill('[data-test="password-input"]', '83r5^_');
      await page.click('[data-test="login-submit"]');
      await expect(page).toHaveURL('/');
    });

    test('should display product details correctly', async ({ page }) => {
      await expect(page.locator('[data-test="product-grid"]')).toBeVisible({ timeout: 15000 });
      await page.locator('[data-test="view-details-btn"]').first().click();
      
      await expect(page.locator('[data-test="product-details-container"]')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('[data-test="detail-title"]')).toBeVisible();
      await expect(page.locator('[data-test="detail-price"]')).toContainText('$');
    });

    test('should show error for non-existent product', async ({ page }) => {
      await page.route('**/products/999999', async route => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Not Found' }),
        });
      });
      await page.goto('/product/999999');
      const errorState = page.locator('[data-test="error-state"]');
      await expect(errorState).toBeVisible({ timeout: 15000 });
    });

    test('back link should return to home', async ({ page }) => {
      // Go to a known valid product
      await page.goto('/product/1');
      const backLink = page.locator('[data-test="back-link"]');
      await expect(backLink).toBeVisible({ timeout: 15000 });
      await backLink.click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Cart Flow', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await page.fill('[data-test="username-input"]', 'mor_2314');
      await page.fill('[data-test="password-input"]', '83r5^_');
      await page.click('[data-test="login-submit"]');
    });

    test('should handle empty cart state', async ({ page }) => {
      await page.click('[data-test="nav-cart"]');
      await expect(page.locator('[data-test="empty-cart-msg"]')).toBeVisible();
    });

    test('should add and remove items', async ({ page }) => {
      await page.locator('[data-test="add-to-cart-btn"]').first().click();
      await page.locator('[data-test="add-to-cart-btn"]').nth(1).click();
      
      await expect(page.locator('[data-test="cart-count"]')).toHaveText('2');
      
      await page.click('[data-test="nav-cart"]');
      const items = page.locator('[data-test^="cart-item-"]');
      await expect(items).toHaveCount(2);
      
      // Remove one
      await page.locator('[data-test="remove-item-btn"]').first().click();
      await expect(items).toHaveCount(1);
      await expect(page.locator('[data-test="cart-count"]')).toHaveText('1');
      
      // Clear cart
      await page.click('[data-test="clear-cart-btn"]');
      await expect(page.locator('[data-test="empty-cart-msg"]')).toBeVisible();
    });
  });
});
