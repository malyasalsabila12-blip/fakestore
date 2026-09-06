# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cc-insufficient-funds.spec.ts >> Credit Card Negative Case - Insufficient Balance >> Should fail with Insufficient Balance error on Xendit simulation
- Location: tests\cc-insufficient-funds.spec.ts:35:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('[data-test="cart-total"]')
Expected substring: "13,051"
Received string:    "IDR 13,050"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('[data-test="cart-total"]')
    14 × locator resolved to <span data-test="cart-total">IDR 13,050</span>
       - unexpected value "IDR 13,050"

```

```yaml
- text: IDR 13,050
```

# Test source

```ts
  14  |     cartPage = new CartPage(page);
  15  | 
  16  |     test.setTimeout(180000);
  17  | 
  18  |     // 1. Bypass Login and CLEAR CART
  19  |     await page.goto('/');
  20  |     await page.evaluate(() => {
  21  |       localStorage.removeItem('cart');
  22  |       localStorage.setItem('user', JSON.stringify({
  23  |         id: 1,
  24  |         username: 'malyasqa',
  25  |         email: 'harfymalya@gmail.com',
  26  |         firstName: 'Malya',
  27  |         lastName: 'Salsabila',
  28  |         phone: '+62 876 3456 5767'
  29  |       }));
  30  |     });
  31  |     await page.reload();
  32  |     await page.waitForSelector('[data-test="home-title"]', { timeout: 30000 });
  33  |   });
  34  | 
  35  |   test('Should fail with Insufficient Balance error on Xendit simulation', async ({ page }) => {
  36  |     const findFailure = async () => {
  37  |       const terms = [/Insufficient balance/i, /\[51\]/, /Transaction failed/i, /Payment declined/i, /expiry/i, /expiration/i, /declined/i, /failed/i, /error/i];
  38  |       for (const frame of [page, ...page.frames()]) {
  39  |         try {
  40  |           // Use locator with text filter instead of fetching all elements
  41  |           for (const term of terms) {
  42  |             const loc = frame.locator('div, span, p, h1, h2, h3, .modal-content, .alert').filter({ hasText: term }).first();
  43  |             if (await loc.isVisible().catch(() => false)) {
  44  |                 const text = await loc.innerText().catch(() => '');
  45  |                 if (term.test(text)) return loc;
  46  |             }
  47  |           }
  48  |         } catch (e) {}
  49  |       }
  50  |       const banner = page.locator('[data-test="payment-error-banner"]').first();
  51  |       if (await banner.isVisible().catch(() => false)) return banner;
  52  |       return null;
  53  |     };
  54  | 
  55  |     const findOtpInput = async () => {
  56  |       for (const frame of page.frames()) {
  57  |         const input = frame.locator('input[placeholder*="Code"], input[name*="otp"], #otp').first();
  58  |         if (await input.isVisible().catch(() => false)) return input;
  59  |       }
  60  |       return null;
  61  |     };
  62  | 
  63  |     const findPayButton = async () => {
  64  |       const selectors = ['button:has-text("Pay")', 'button:has-text("PAY")', '[data-testid*="pay"]', '.pay-button', 'input[type="submit"]'];
  65  |       for (const frame of [page, ...page.frames()]) {
  66  |         for (const sel of selectors) {
  67  |           const loc = frame.locator(sel).first();
  68  |           if (await loc.isVisible().catch(() => false)) return loc;
  69  |         }
  70  |       }
  71  |       return null;
  72  |     };
  73  | 
  74  |     const handleModals = async () => {
  75  |       for (const frame of [page, ...page.frames()]) {
  76  |         try {
  77  |           // Specific locators for known modal buttons
  78  |           const modalButtons = frame.locator('button').filter({ hasText: /OK|Got it|Dismiss|Close|Try again/i });
  79  |           const count = await modalButtons.count().catch(() => 0);
  80  |           for (let i = 0; i < count; i++) {
  81  |             const btn = modalButtons.nth(i);
  82  |             if (await btn.isVisible().catch(() => false)) {
  83  |                 console.log('Clicking modal button...');
  84  |                 await btn.click({ force: true });
  85  |                 return true;
  86  |             }
  87  |           }
  88  |         } catch (e) {}
  89  |       }
  90  |       return false;
  91  |     };
  92  | 
  93  |     // 2. Add trigger item (Directly via localStorage to ensure it exists)
  94  |     await page.goto('/');
  95  |     await page.evaluate(() => {
  96  |       const triggerItem = {
  97  |         id: 1013,
  98  |         title: "Trigger Failure Item",
  99  |         price: 13051 / 15000,
  100 |         description: "Special item for testing insufficient balance failure (Test Mode).",
  101 |         category: "jewelery",
  102 |         image: "https://images.unsplash.com/photo-1594539829535-de2adbd3c761?auto=format&fit=crop&q=80&w=800",
  103 |         rating: { rate: 1.0, count: 0 }
  104 |       };
  105 |       localStorage.setItem('cart', JSON.stringify([triggerItem]));
  106 |     });
  107 |     
  108 |     // 3. Checkout
  109 |     await page.goto('/cart');
  110 |     await page.waitForURL('**/cart');
  111 |     
  112 |     // Verify total (13,051 trigger for code 51)
  113 |     const totalElement = page.locator('[data-test="cart-total"]');
> 114 |     await expect(totalElement).toContainText('13,051');
      |                                ^ Error: expect(locator).toContainText(expected) failed
  115 |     await cartPage.checkout();
  116 | 
  117 |     // 4. Handle Xendit
  118 |     await expect(page).toHaveURL(/checkout-staging\.xendit\.co/, { timeout: 40000 });
  119 |     const ccMethodItem = page.locator('div[class*="payment-channel"], div[class*="Method"], button').filter({ hasText: /^Credit \/ Debit Card$/ }).first();
  120 |     await ccMethodItem.waitFor({ state: 'visible' });
  121 |     await ccMethodItem.click({ force: true });
  122 |     
  123 |     const cardNumberInput = page.locator('input[name*="Number"], #cardNumber').first();
  124 |     const expiryInput = page.locator('input[placeholder*="MM/YY"], input[name*="expiry"], #cardExpiry, #expiryDate').first();
  125 |     const cvnInput = page.locator('input[name*="CVN"], input[placeholder*="CVN"], #cvn, #cardCvv').first();
  126 | 
  127 |     await cardNumberInput.waitFor({ state: 'visible' });
  128 |     
  129 |     // 5. Fill Details
  130 |     const fillDetails = async () => {
  131 |         console.log('Searching for simulation banner...');
  132 |         let banner = null;
  133 |         for (const frame of [page, ...page.frames()]) {
  134 |             const loc = frame.locator('button, a, span, p').filter({ hasText: /simulate your payment/i }).first();
  135 |             if (await loc.isVisible().catch(() => false)) {
  136 |                 banner = loc;
  137 |                 break;
  138 |             }
  139 |         }
  140 | 
  141 |         if (banner) {
  142 |             console.log('Found simulation banner. Clicking...');
  143 |             await banner.click({ force: true });
  144 |             await page.waitForTimeout(2000);
  145 |             
  146 |             // Look for "Insufficient Funds" or "Failure" option in the simulation modal
  147 |             for (const frame of [page, ...page.frames()]) {
  148 |                 const failureOption = frame.locator('button, div, li').filter({ hasText: /Insufficient|Failure|\[51\]/i }).first();
  149 |                 if (await failureOption.isVisible().catch(() => false)) {
  150 |                     console.log('Selecting Insufficient Balance simulation...');
  151 |                     await failureOption.click({ force: true });
  152 |                     return true;
  153 |                 }
  154 |             }
  155 |             
  156 |             // If no specific failure option, just try to close the modal or click Pay
  157 |             await handleModals();
  158 |             return true;
  159 |         }
  160 | 
  161 |         console.log('Banner not found, using manual fill...');
  162 |         await cardNumberInput.click({ force: true });
  163 |         await page.keyboard.press('Control+A');
  164 |         // Using Xendit recommended test card
  165 |         await page.keyboard.type('4352000000000001', { delay: 50 });
  166 |         
  167 |         await expiryInput.click({ force: true });
  168 |         // Use 12/35 to ensure it is in the future
  169 |         await page.keyboard.type('1235', { delay: 100 });
  170 |         await page.keyboard.press('Tab');
  171 |         
  172 |         await cvnInput.click({ force: true });
  173 |         await page.keyboard.type('111', { delay: 50 });
  174 |         await page.keyboard.press('Tab');
  175 | 
  176 |         const emailInput = page.locator('input[type="email"], #email').first();
  177 |         if (await emailInput.isVisible().catch(() => false)) {
  178 |             await emailInput.click({ force: true });
  179 |             await emailInput.fill('customer@example.com');
  180 |         }
  181 |         return false;
  182 |     };
  183 | 
  184 |     await fillDetails();
  185 |     await handleModals();
  186 |     
  187 |     // Check for validation errors before paying
  188 |     const errorOnPage = await findFailure();
  189 |     if (errorOnPage) {
  190 |         console.log('Detected validation error before pay, attempting fix...');
  191 |         await handleModals();
  192 |     }
  193 | 
  194 |     // 6. Pay
  195 |     console.log('Attempting to trigger payment...');
  196 |     await expect(async () => {
  197 |       const btn = await findPayButton();
  198 |       if (!btn) throw new Error('Pay button not found');
  199 |       
  200 |       // Try to remove disabled attribute if it exists
  201 |       await btn.evaluate(el => el.removeAttribute('disabled')).catch(() => {});
  202 |       
  203 |       // Attempt click - use force to bypass any overlays
  204 |       await btn.click({ force: true, timeout: 5000 });
  205 |       console.log('Pay button clicked successfully.');
  206 |     }).toPass({ timeout: 30000 });
  207 | 
  208 |     // 7. terminal State (OTP or Failure)
  209 |     console.log('Waiting for final result...');
  210 |     let foundIndicator = null;
  211 |     await expect(async () => {
  212 |       const url = page.url();
  213 |       console.log('Current URL:', url);
  214 |       
```