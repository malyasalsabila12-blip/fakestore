import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

test.describe('Fake Store E2E Automation (POM)', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    // Global default mocks
    await page.route('**/auth/login', async route => {
      const postData = route.request().postDataJSON();
      if (postData.username === 'mor_2314' && postData.password === '83r5^_') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ token: 'fake-token' })
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ msg: 'Error' })
        });
      }
    });

    await page.route('**/products', async route => {
      if (route.request().url().endsWith('/products')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops', price: 109.95, description: 'Your perfect pack', category: "men's clothing", image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', rating: { rate: 3.9, count: 120 } },
            { id: 2, title: 'Mens Casual Premium Slim Fit T-Shirts', price: 22.3, description: 'Slim-fitting style', category: "men's clothing", image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', rating: { rate: 4.1, count: 259 } }
          ])
        });
      } else {
        await route.continue();
      }
    });

    await page.route('**/products/categories', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(["electronics", "jewelery", "men's clothing", "women's clothing"])
      });
    });

    await page.route('**/products/category/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, title: 'Electronics Item', category: 'electronics' }
        ])
      });
    });
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
      
      const categories = await page.locator('[data-test="product-category"]').allTextContents();
      expect(categories.length).toBeGreaterThan(0);
      for (const cat of categories) {
        expect(cat.toLowerCase()).toContain('electronics');
      }
    });
  });

  test.describe('Cart & Checkout Flow', () => {
    test.beforeEach(async ({ page }) => {
      await loginPage.goto();
      await loginPage.login('mor_2314', '83r5^_');
    });

    test('Full E2E Flow: Add to Cart and Verify', async ({ page }) => {
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
      await page.route('**/products', async route => {
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
      await expect(errorState).toContainText('find the product');
    });
  });
});
