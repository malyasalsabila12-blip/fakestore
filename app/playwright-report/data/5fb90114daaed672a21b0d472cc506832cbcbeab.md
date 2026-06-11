# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Fake Store E2E Automation (POM) >> API & Error States (Mocks) >> Product 404 Detail State
- Location: tests\e2e.spec.ts:102:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-test="error-state"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-test="error-state"]')

```

```yaml
- main:
  - heading "Login to Fake Store" [level=1]
  - text: Username
  - textbox "mor_2314"
  - text: Password
  - textbox "83r5^_"
  - button "Sign in"
  - paragraph: "Demo credentials:"
  - paragraph: "User: mor_2314"
  - paragraph: "Pass: 83r5^_"
```

# Test source

```ts
  11  |     homePage = new HomePage(page);
  12  |   });
  13  | 
  14  |   test.describe('Authentication Flow', () => {
  15  |     test('Valid Login - @smoke', async ({ page }) => {
  16  |       await loginPage.goto();
  17  |       await loginPage.login('mor_2314', '83r5^_');
  18  |       await expect(page).toHaveURL('/');
  19  |       await expect(homePage.title).toBeVisible();
  20  |     });
  21  | 
  22  |     test('Invalid Login - @negative', async () => {
  23  |       await loginPage.goto();
  24  |       await loginPage.login('wrong_user', 'wrong_pass');
  25  |       await expect(loginPage.errorMessage).toBeVisible();
  26  |       await expect(loginPage.errorMessage).toContainText('Invalid username');
  27  |     });
  28  | 
  29  |     test('Logout Flow', async ({ page }) => {
  30  |       await loginPage.goto();
  31  |       await loginPage.login('mor_2314', '83r5^_');
  32  |       await homePage.logoutButton.click();
  33  |       await expect(page).toHaveURL('/login');
  34  |     });
  35  |   });
  36  | 
  37  |   test.describe('Search & Filter', () => {
  38  |     test.beforeEach(async () => {
  39  |       await loginPage.goto();
  40  |       await loginPage.login('mor_2314', '83r5^_');
  41  |     });
  42  | 
  43  |     test('Search for existing product', async () => {
  44  |       await homePage.search('Backpack');
  45  |       const count = await homePage.productCards.count();
  46  |       expect(count).toBeGreaterThan(0);
  47  |       await expect(homePage.productCards.first()).toContainText('Backpack');
  48  |     });
  49  | 
  50  |     test('Search for non-existent product - @ui-state', async () => {
  51  |       await homePage.search('NonExistentProductXYZ');
  52  |       await expect(homePage.emptyState).toBeVisible();
  53  |       await expect(homePage.emptyState).toContainText('No products found');
  54  |     });
  55  | 
  56  |     test('Filter by category', async () => {
  57  |       await homePage.filterByCategory('electronics');
  58  |       await expect(homePage.productCards.first()).toContainText('SanDisk', { ignoreCase: true });
  59  |       // Verify all items are in category (this is a more thorough check)
  60  |       const categories = await homePage.page.locator('[data-test="product-category"]').allTextContents();
  61  |       // Note: my component doesn't have data-test="product-category" yet, let's fix that later or use existing logic
  62  |     });
  63  |   });
  64  | 
  65  |   test.describe('Cart & Checkout Flow', () => {
  66  |     test.beforeEach(async () => {
  67  |       await loginPage.goto();
  68  |       await loginPage.login('mor_2314', '83r5^_');
  69  |     });
  70  | 
  71  |     test('Full E2E Flow: Add to Cart and Verify', async ({ page }) => {
  72  |       await homePage.addToCart(0);
  73  |       await homePage.addToCart(1);
  74  |       
  75  |       const cartCount = page.locator('[data-test="cart-count"]');
  76  |       await expect(cartCount).toHaveText('2');
  77  |       
  78  |       await homePage.cartLink.click();
  79  |       await expect(page).toHaveURL('/cart');
  80  |       
  81  |       const total = page.locator('[data-test="cart-total"]');
  82  |       await expect(total).toContainText('$');
  83  |       
  84  |       await page.locator('[data-test="checkout-btn"]').click();
  85  |       // Handle alert
  86  |       page.on('dialog', dialog => dialog.accept());
  87  |     });
  88  |   });
  89  | 
  90  |   test.describe('API & Error States (Mocks)', () => {
  91  |     test('Server Error (500) State', async ({ page }) => {
  92  |       await page.route('**/products', route => route.fulfill({
  93  |         status: 500,
  94  |         body: JSON.stringify({ error: 'Internal Server Error' })
  95  |       }));
  96  |       
  97  |       await loginPage.goto();
  98  |       await loginPage.login('mor_2314', '83r5^_');
  99  |       await expect(page.locator('[data-test="error-state"]')).toBeVisible();
  100 |     });
  101 | 
  102 |     test('Product 404 Detail State', async ({ page }) => {
  103 |       await page.route('**/products/999', route => route.fulfill({
  104 |         status: 404,
  105 |         body: JSON.stringify({ error: 'Not Found' })
  106 |       }));
  107 |       
  108 |       await loginPage.goto();
  109 |       await loginPage.login('mor_2314', '83r5^_');
  110 |       await page.goto('/product/999');
> 111 |       await expect(page.locator('[data-test="error-state"]')).toBeVisible();
      |                                                               ^ Error: expect(locator).toBeVisible() failed
  112 |     });
  113 |   });
  114 | });
  115 | 
```