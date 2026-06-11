# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Fake Store Comprehensive Tests >> Cart Flow >> should add and remove items
- Location: tests\app.spec.ts:139:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-test="add-to-cart-btn"]').first()

```

# Page snapshot

```yaml
- main [ref=e4]:
  - generic [ref=e6]:
    - heading "Login to Fake Store" [level=1] [ref=e7]
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]: Username
        - textbox "mor_2314" [ref=e11]
      - generic [ref=e12]:
        - generic [ref=e13]: Password
        - textbox "83r5^_" [ref=e14]
      - button "Logging in..." [disabled] [ref=e15]
    - generic [ref=e16]:
      - paragraph [ref=e17]: "Demo credentials:"
      - paragraph [ref=e18]: "User: mor_2314"
      - paragraph [ref=e19]: "Pass: 83r5^_"
```

# Test source

```ts
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
  81  |       await expect(errorState).toContainText('Failed to fetch products');
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
> 140 |       await page.locator('[data-test="add-to-cart-btn"]').first().click();
      |                                                                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
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