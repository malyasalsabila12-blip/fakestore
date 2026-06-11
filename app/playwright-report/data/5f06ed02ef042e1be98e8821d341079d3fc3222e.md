# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Fake Store Comprehensive Tests >> Home Page & UI States >> should handle API error state
- Location: tests\app.spec.ts:67:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('[data-test="error-state"]')
Expected substring: "Failed to fetch products"
Received string:    "Failed to fetch data. Please try again later.Retry"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('[data-test="error-state"]')
    14 × locator resolved to <div data-test="error-state" class="text-center mt-20 text-red-600 p-4">…</div>
       - unexpected value "Failed to fetch data. Please try again later.Retry"

```

```yaml
- paragraph: Failed to fetch data. Please try again later.
- button "Retry"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Fake Store Comprehensive Tests', () => {
  4   |   
  5   |   test.describe('Authentication', () => {
  6   |     test.beforeEach(async ({ page }) => {
  7   |       await page.goto('/login');
  8   |     });
  9   | 
  10  |     test('valid login should redirect to home', async ({ page }) => {
  11  |       await page.fill('[data-test="username-input"]', 'mor_2314');
  12  |       await page.fill('[data-test="password-input"]', '83r5^_');
  13  |       await page.click('[data-test="login-submit"]');
  14  | 
  15  |       await expect(page).toHaveURL('/');
  16  |       await expect(page.locator('[data-test="home-title"]')).toBeVisible();
  17  |       await expect(page.locator('[data-test="nav-username"]')).toContainText('mor_2314');
  18  |     });
  19  | 
  20  |     test('invalid login should show error message', async ({ page }) => {
  21  |       await page.fill('[data-test="username-input"]', 'invalid_user');
  22  |       await page.fill('[data-test="password-input"]', 'invalid_pass');
  23  |       await page.click('[data-test="login-submit"]');
  24  | 
  25  |       const errorMsg = page.locator('[data-test="login-error"]');
  26  |       await expect(errorMsg).toBeVisible();
  27  |       await expect(errorMsg).toContainText('Invalid username or password');
  28  |     });
  29  | 
  30  |     test('unauthorized access should redirect to login', async ({ page }) => {
  31  |       // Clear storage to ensure logged out
  32  |       await page.context().clearCookies();
  33  |       await page.goto('/');
  34  |       await expect(page).toHaveURL('/login');
  35  |     });
  36  | 
  37  |     test('logout should clear session', async ({ page }) => {
  38  |       // Login first
  39  |       await page.fill('[data-test="username-input"]', 'mor_2314');
  40  |       await page.fill('[data-test="password-input"]', '83r5^_');
  41  |       await page.click('[data-test="login-submit"]');
  42  |       
  43  |       await expect(page.locator('[data-test="logout-btn"]')).toBeVisible();
  44  |       await page.click('[data-test="logout-btn"]');
  45  |       
  46  |       await expect(page).toHaveURL('/login');
  47  |     });
  48  |   });
  49  | 
  50  |   test.describe('Home Page & UI States', () => {
  51  |     test.beforeEach(async ({ page }) => {
  52  |       await page.goto('/login');
  53  |       await page.fill('[data-test="username-input"]', 'mor_2314');
  54  |       await page.fill('[data-test="password-input"]', '83r5^_');
  55  |       await page.click('[data-test="login-submit"]');
  56  |       await expect(page).toHaveURL('/');
  57  |     });
  58  | 
  59  |     test('should show loading state then products', async ({ page }) => {
  60  |       // Products should eventually appear
  61  |       const productGrid = page.locator('[data-test="product-grid"]');
  62  |       await expect(productGrid).toBeVisible({ timeout: 15000 });
  63  |       const productCards = page.locator('[data-test^="product-card-"]');
  64  |       await expect(productCards.first()).toBeVisible();
  65  |     });
  66  | 
  67  |     test('should handle API error state', async ({ page }) => {
  68  |       // Intercept and fail the products request
  69  |       await page.route('**/products', async route => {
  70  |         await route.fulfill({
  71  |           status: 500,
  72  |           contentType: 'application/json',
  73  |           body: JSON.stringify({ error: 'Internal Server Error' }),
  74  |         });
  75  |       });
  76  |       
  77  |       // Navigate again to trigger the mocked request
  78  |       await page.goto('/');
  79  |       const errorState = page.locator('[data-test="error-state"]');
  80  |       await expect(errorState).toBeVisible({ timeout: 15000 });
> 81  |       await expect(errorState).toContainText('Failed to fetch products');
      |                                ^ Error: expect(locator).toContainText(expected) failed
  82  |     });
  83  |   });
  84  | 
  85  |   test.describe('Detail Page', () => {
  86  |     test.beforeEach(async ({ page }) => {
  87  |       await page.goto('/login');
  88  |       await page.fill('[data-test="username-input"]', 'mor_2314');
  89  |       await page.fill('[data-test="password-input"]', '83r5^_');
  90  |       await page.click('[data-test="login-submit"]');
  91  |       await expect(page).toHaveURL('/');
  92  |     });
  93  | 
  94  |     test('should display product details correctly', async ({ page }) => {
  95  |       await expect(page.locator('[data-test="product-grid"]')).toBeVisible({ timeout: 15000 });
  96  |       await page.locator('[data-test="view-details-btn"]').first().click();
  97  |       
  98  |       await expect(page.locator('[data-test="product-details-container"]')).toBeVisible({ timeout: 15000 });
  99  |       await expect(page.locator('[data-test="detail-title"]')).toBeVisible();
  100 |       await expect(page.locator('[data-test="detail-price"]')).toContainText('$');
  101 |     });
  102 | 
  103 |     test('should show error for non-existent product', async ({ page }) => {
  104 |       await page.route('**/products/999999', async route => {
  105 |         await route.fulfill({
  106 |           status: 404,
  107 |           contentType: 'application/json',
  108 |           body: JSON.stringify({ error: 'Not Found' }),
  109 |         });
  110 |       });
  111 |       await page.goto('/product/999999');
  112 |       const errorState = page.locator('[data-test="error-state"]');
  113 |       await expect(errorState).toBeVisible({ timeout: 15000 });
  114 |     });
  115 | 
  116 |     test('back link should return to home', async ({ page }) => {
  117 |       // Go to a known valid product
  118 |       await page.goto('/product/1');
  119 |       const backLink = page.locator('[data-test="back-link"]');
  120 |       await expect(backLink).toBeVisible({ timeout: 15000 });
  121 |       await backLink.click();
  122 |       await expect(page).toHaveURL('/');
  123 |     });
  124 |   });
  125 | 
  126 |   test.describe('Cart Flow', () => {
  127 |     test.beforeEach(async ({ page }) => {
  128 |       await page.goto('/login');
  129 |       await page.fill('[data-test="username-input"]', 'mor_2314');
  130 |       await page.fill('[data-test="password-input"]', '83r5^_');
  131 |       await page.click('[data-test="login-submit"]');
  132 |     });
  133 | 
  134 |     test('should handle empty cart state', async ({ page }) => {
  135 |       await page.click('[data-test="nav-cart"]');
  136 |       await expect(page.locator('[data-test="empty-cart-msg"]')).toBeVisible();
  137 |     });
  138 | 
  139 |     test('should add and remove items', async ({ page }) => {
  140 |       await page.locator('[data-test="add-to-cart-btn"]').first().click();
  141 |       await page.locator('[data-test="add-to-cart-btn"]').nth(1).click();
  142 |       
  143 |       await expect(page.locator('[data-test="cart-count"]')).toHaveText('2');
  144 |       
  145 |       await page.click('[data-test="nav-cart"]');
  146 |       const items = page.locator('[data-test^="cart-item-"]');
  147 |       await expect(items).toHaveCount(2);
  148 |       
  149 |       // Remove one
  150 |       await page.locator('[data-test="remove-item-btn"]').first().click();
  151 |       await expect(items).toHaveCount(1);
  152 |       await expect(page.locator('[data-test="cart-count"]')).toHaveText('1');
  153 |       
  154 |       // Clear cart
  155 |       await page.click('[data-test="clear-cart-btn"]');
  156 |       await expect(page.locator('[data-test="empty-cart-msg"]')).toBeVisible();
  157 |     });
  158 |   });
  159 | });
  160 | 
```