# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Fake Store E2E Automation (POM) >> Search & Filter >> Filter by category
- Location: tests\e2e.spec.ts:107:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-test^="product-card-"]').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('[data-test^="product-card-"]').first()

```

```yaml
- navigation:
  - link "Fake Store":
    - /url: /
  - link "Home":
    - /url: /
  - text: Hello, mor_2314
  - link "shopping_cart Cart":
    - /url: /cart
  - button "Logout"
- main:
  - heading "Our Collection" [level=1]
  - paragraph: Discover quality products at fake prices!
  - textbox "Search products..."
  - button "All"
  - button "electronics"
  - button "jewelery"
  - button "men's clothing"
  - button "women's clothing"
  - text: search_off
  - paragraph: No products found matching your criteria.
  - button "Clear all filters"
```

# Test source

```ts
  9   |   test.beforeEach(async ({ page }) => {
  10  |     loginPage = new LoginPage(page);
  11  |     homePage = new HomePage(page);
  12  | 
  13  |     // Global default mocks
  14  |     await page.route('**/auth/login', async route => {
  15  |       const postData = route.request().postDataJSON();
  16  |       if (postData.username === 'mor_2314' && postData.password === '83r5^_') {
  17  |         await route.fulfill({
  18  |           status: 200,
  19  |           contentType: 'application/json',
  20  |           body: JSON.stringify({ token: 'fake-token' })
  21  |         });
  22  |       } else {
  23  |         await route.fulfill({
  24  |           status: 401,
  25  |           contentType: 'application/json',
  26  |           body: JSON.stringify({ msg: 'Error' })
  27  |         });
  28  |       }
  29  |     });
  30  | 
  31  |     await page.route('**/products', async route => {
  32  |       if (route.request().url().endsWith('/products')) {
  33  |         await route.fulfill({
  34  |           status: 200,
  35  |           contentType: 'application/json',
  36  |           body: JSON.stringify([
  37  |             { id: 1, title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops', price: 109.95, description: 'Your perfect pack', category: "men's clothing", image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', rating: { rate: 3.9, count: 120 } },
  38  |             { id: 2, title: 'Mens Casual Premium Slim Fit T-Shirts', price: 22.3, description: 'Slim-fitting style', category: "men's clothing", image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', rating: { rate: 4.1, count: 259 } }
  39  |           ])
  40  |         });
  41  |       } else {
  42  |         await route.continue();
  43  |       }
  44  |     });
  45  | 
  46  |     await page.route('**/products/categories', async route => {
  47  |       await route.fulfill({
  48  |         status: 200,
  49  |         contentType: 'application/json',
  50  |         body: JSON.stringify(["electronics", "jewelery", "men's clothing", "women's clothing"])
  51  |       });
  52  |     });
  53  | 
  54  |     await page.route('**/products/category/*', async route => {
  55  |       await route.fulfill({
  56  |         status: 200,
  57  |         contentType: 'application/json',
  58  |         body: JSON.stringify([
  59  |           { id: 1, title: 'Electronics Item', category: 'electronics' }
  60  |         ])
  61  |       });
  62  |     });
  63  |   });
  64  | 
  65  |   test.describe('Authentication Flow', () => {
  66  |     test('Valid Login - @smoke', async ({ page }) => {
  67  |       await loginPage.goto();
  68  |       await loginPage.login('mor_2314', '83r5^_');
  69  |       await expect(page).toHaveURL('/');
  70  |       await expect(homePage.title).toBeVisible();
  71  |     });
  72  | 
  73  |     test('Invalid Login - @negative', async () => {
  74  |       await loginPage.goto();
  75  |       await loginPage.login('wrong_user', 'wrong_pass');
  76  |       await expect(loginPage.errorMessage).toBeVisible();
  77  |       await expect(loginPage.errorMessage).toContainText('Invalid username');
  78  |     });
  79  | 
  80  |     test('Logout Flow', async ({ page }) => {
  81  |       await loginPage.goto();
  82  |       await loginPage.login('mor_2314', '83r5^_');
  83  |       await homePage.logoutButton.click();
  84  |       await expect(page).toHaveURL('/login');
  85  |     });
  86  |   });
  87  | 
  88  |   test.describe('Search & Filter', () => {
  89  |     test.beforeEach(async () => {
  90  |       await loginPage.goto();
  91  |       await loginPage.login('mor_2314', '83r5^_');
  92  |     });
  93  | 
  94  |     test('Search for existing product', async () => {
  95  |       await homePage.search('Backpack');
  96  |       const count = await homePage.productCards.count();
  97  |       expect(count).toBeGreaterThan(0);
  98  |       await expect(homePage.productCards.first()).toContainText('Backpack');
  99  |     });
  100 | 
  101 |     test('Search for non-existent product - @ui-state', async () => {
  102 |       await homePage.search('NonExistentProductXYZ');
  103 |       await expect(homePage.emptyState).toBeVisible();
  104 |       await expect(homePage.emptyState).toContainText('No products found');
  105 |     });
  106 | 
  107 |     test('Filter by category', async ({ page }) => {
  108 |       await homePage.filterByCategory('electronics');
> 109 |       await expect(homePage.productCards.first()).toBeVisible({ timeout: 15000 });
      |                                                   ^ Error: expect(locator).toBeVisible() failed
  110 |       
  111 |       const categories = await page.locator('[data-test="product-category"]').allTextContents();
  112 |       expect(categories.length).toBeGreaterThan(0);
  113 |       for (const cat of categories) {
  114 |         expect(cat.toLowerCase()).toContain('electronics');
  115 |       }
  116 |     });
  117 |   });
  118 | 
  119 |   test.describe('Cart & Checkout Flow', () => {
  120 |     test.beforeEach(async ({ page }) => {
  121 |       await loginPage.goto();
  122 |       await loginPage.login('mor_2314', '83r5^_');
  123 |     });
  124 | 
  125 |     test('Full E2E Flow: Add to Cart and Verify', async ({ page }) => {
  126 |       page.on('dialog', dialog => {
  127 |         expect(dialog.message()).toContain('Thanks for shopping');
  128 |         dialog.accept();
  129 |       });
  130 | 
  131 |       await homePage.addToCart(0);
  132 |       await homePage.addToCart(1);
  133 |       
  134 |       const cartCount = page.locator('[data-test="cart-count"]');
  135 |       await expect(cartCount).toHaveText('2');
  136 |       
  137 |       await homePage.cartLink.click();
  138 |       await expect(page).toHaveURL('/cart');
  139 |       
  140 |       const total = page.locator('[data-test="cart-total"]');
  141 |       await expect(total).toContainText('$');
  142 |       
  143 |       await page.locator('[data-test="checkout-btn"]').click();
  144 |     });
  145 |   });
  146 | 
  147 |   test.describe('API & Error States (Mocks)', () => {
  148 |     test('Server Error (500) State', async ({ page }) => {
  149 |       await page.route('**/products', async route => {
  150 |         await route.fulfill({
  151 |           status: 500,
  152 |           contentType: 'application/json',
  153 |           body: JSON.stringify({ error: 'Internal Server Error' })
  154 |         });
  155 |       });
  156 |       
  157 |       await loginPage.goto();
  158 |       await loginPage.login('mor_2314', '83r5^_');
  159 |       
  160 |       const errorState = page.locator('[data-test="error-state"]');
  161 |       await expect(errorState).toBeVisible({ timeout: 15000 });
  162 |       await expect(errorState).toContainText('Failed to fetch');
  163 |     });
  164 | 
  165 |     test('Product 404 Detail State', async ({ page }) => {
  166 |       await page.route('**/products/999', async route => {
  167 |         await route.fulfill({
  168 |           status: 404,
  169 |           contentType: 'application/json',
  170 |           body: JSON.stringify({ error: 'Not Found' })
  171 |         });
  172 |       });
  173 |       
  174 |       await loginPage.goto();
  175 |       await loginPage.login('mor_2314', '83r5^_');
  176 |       await expect(page).toHaveURL('/');
  177 |       
  178 |       await page.goto('/product/999');
  179 |       const errorState = page.locator('[data-test="error-state"]');
  180 |       await expect(errorState).toBeVisible({ timeout: 15000 });
  181 |       await expect(errorState).toContainText('find the product');
  182 |     });
  183 |   });
  184 | });
  185 | 
```