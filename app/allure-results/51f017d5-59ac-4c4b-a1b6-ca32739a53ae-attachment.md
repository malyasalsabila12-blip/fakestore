# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cc-insufficient-funds.spec.ts >> Credit Card Negative Scenarios - Xendit Failures >> Should fail with Insufficient Balance (10054) error on Xendit simulation
- Location: tests\cc-insufficient-funds.spec.ts:66:5

# Error details

```
Error: Waiting for app failure banner...

Call Log:
- Timeout 60000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - paragraph [ref=e5]: You are in Test Mode and any transactions made are simulated and not real.
  - main [ref=e6]:
    - generic [ref=e8]:
      - generic [ref=e10]:
        - generic [ref=e11]:
          - img "malstro" [ref=e13]
          - heading "malstro" [level=3] [ref=e14]
        - button "Switch language" [ref=e19] [cursor=pointer]:
          - text: English
          - img [ref=e20]
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]:
            - paragraph [ref=e25]: Pay Before September 7, 2026 at 7:12 PM
            - paragraph [ref=e28]: IDR 10.054
          - generic [ref=e30]:
            - heading "Payment Method" [level=2] [ref=e31]
            - generic [ref=e32]:
              - generic [ref=e33]:
                - heading "Bank Transfer" [level=3] [ref=e34]:
                  - button "Bank Transfer" [expanded] [active] [ref=e35] [cursor=pointer]:
                    - img [ref=e37]
                    - generic [ref=e44]: Bank Transfer
                    - img [ref=e45]
                - region "Bank Transfer" [ref=e47]:
                  - list [ref=e49]:
                    - listitem [ref=e50]:
                      - button "Permata" [ref=e51] [cursor=pointer]:
                        - img "Permata" [ref=e53]
                    - listitem [ref=e54]:
                      - button "BSI" [ref=e55] [cursor=pointer]:
                        - img "BSI" [ref=e57]
                    - listitem [ref=e58]:
                      - button "Sahabat Sampoerna" [ref=e59] [cursor=pointer]:
                        - img "Sahabat Sampoerna" [ref=e61]
                    - listitem [ref=e62]:
                      - button "Mandiri" [ref=e63] [cursor=pointer]:
                        - img "Mandiri" [ref=e65]
                    - listitem [ref=e66]:
                      - button "BCA" [ref=e67] [cursor=pointer]:
                        - img "BCA" [ref=e69]
                    - listitem [ref=e70]:
                      - button "BNI" [ref=e71] [cursor=pointer]:
                        - img "BNI" [ref=e73]
                    - listitem [ref=e74]:
                      - button "BRI" [ref=e75] [cursor=pointer]:
                        - img "BRI" [ref=e77]
                    - listitem [ref=e78]:
                      - button "CIMB" [ref=e79] [cursor=pointer]:
                        - img "CIMB" [ref=e81]
                    - listitem [ref=e82]:
                      - button "Muamalat" [ref=e83] [cursor=pointer]:
                        - img "Muamalat" [ref=e85]
                    - listitem [ref=e86]:
                      - button "BJB" [ref=e87] [cursor=pointer]:
                        - img "BJB" [ref=e89]
                    - listitem [ref=e90]:
                      - button "BNC" [ref=e91] [cursor=pointer]:
                        - img "BNC" [ref=e93]
                    - listitem [ref=e94]:
                      - button "Other Banks" [ref=e95] [cursor=pointer]:
                        - generic [ref=e97]:
                          - img [ref=e98]
                          - generic [ref=e111]: Other Banks
              - heading "Credit / Debit Card VISA MASTERCARD AMEX JCB" [level=3] [ref=e113]:
                - button "Credit / Debit Card VISA MASTERCARD AMEX JCB" [ref=e114] [cursor=pointer]:
                  - img [ref=e116]
                  - generic [ref=e121]:
                    - generic [ref=e123]: Credit / Debit Card
                    - generic [ref=e124]:
                      - img "VISA" [ref=e126]
                      - img "MASTERCARD" [ref=e128]
                      - img "AMEX" [ref=e130]
                      - img "JCB" [ref=e132]
                  - img [ref=e133]
              - heading "E-Wallet OVO ShopeePay Nex Cash +5" [level=3] [ref=e136]:
                - button "E-Wallet OVO ShopeePay Nex Cash +5" [ref=e137] [cursor=pointer]:
                  - img [ref=e139]
                  - generic [ref=e141]:
                    - generic [ref=e143]: E-Wallet
                    - generic [ref=e144]:
                      - img "OVO" [ref=e146]
                      - img "ShopeePay" [ref=e148]
                      - img "Nex Cash" [ref=e150]
                      - generic [ref=e151]: "+5"
                  - img [ref=e152]
              - heading "QR Payments QRIS" [level=3] [ref=e155]:
                - button "QR Payments QRIS" [ref=e156] [cursor=pointer]:
                  - img [ref=e158]
                  - generic [ref=e163]:
                    - generic [ref=e165]: QR Payments
                    - img "QRIS" [ref=e168]
                  - img [ref=e169]
              - heading "Direct Debit BRI Direct Debit Mandiri Direct Debit" [level=3] [ref=e172]:
                - button "Direct Debit BRI Direct Debit Mandiri Direct Debit" [ref=e173] [cursor=pointer]:
                  - img [ref=e175]
                  - generic [ref=e180]:
                    - generic [ref=e182]: Direct Debit
                    - generic [ref=e183]:
                      - img "BRI Direct Debit" [ref=e185]
                      - img "Mandiri Direct Debit" [ref=e187]
                  - img [ref=e188]
              - heading "PayLater Kredivo Akulaku" [level=3] [ref=e191]:
                - button "PayLater Kredivo Akulaku" [ref=e192] [cursor=pointer]:
                  - img [ref=e194]
                  - generic [ref=e197]:
                    - generic [ref=e199]: PayLater
                    - generic [ref=e200]:
                      - img "Kredivo" [ref=e202]
                      - img "Akulaku" [ref=e204]
                  - img [ref=e205]
        - generic [ref=e210]:
          - generic [ref=e211]: Powered by
          - img [ref=e212]
          - generic [ref=e214]: xendit
    - complementary [ref=e215]:
      - generic [ref=e217]:
        - generic [ref=e218]:
          - heading "Order Summary" [level=2] [ref=e219]
          - paragraph [ref=e220]:
            - strong [ref=e221]: "Invoice #:"
            - text: MAL-1788696728943
        - list [ref=e223]:
          - listitem [ref=e224]:
            - generic [ref=e225]:
              - img [ref=e227]
              - heading "Description" [level=3] [ref=e234]
            - paragraph [ref=e235]: Malstro Order for malyasqa
          - listitem [ref=e236]:
            - generic [ref=e237]:
              - img [ref=e239]
              - heading "Pay before September 7, 2026 at 7:12 PM" [level=3] [ref=e243]:
                - text: Pay before
                - strong [ref=e244]: September 7, 2026 at 7:12 PM
        - separator [ref=e246]
        - table [ref=e248]:
          - rowgroup [ref=e249]:
            - row "Trigger Failure Item (1054) 1 × IDR 10.054 IDR 10.054" [ref=e250]:
              - cell "Trigger Failure Item (1054) 1 × IDR 10.054" [ref=e251]:
                - generic [ref=e252]: Trigger Failure Item (1054)
                - generic [ref=e253]: 1 × IDR 10.054
              - cell "IDR 10.054" [ref=e254]
            - row [ref=e255]:
              - cell [ref=e256]:
                - separator [ref=e257]
            - row "Subtotal IDR 10.054" [ref=e258]:
              - cell "Subtotal" [ref=e259]
              - cell "IDR 10.054" [ref=e260]
            - row [ref=e261]:
              - cell [ref=e262]:
                - separator [ref=e263]
            - row "Total Amount Due IDR 10.054" [ref=e264]:
              - cell "Total Amount Due IDR 10.054" [ref=e265]:
                - generic [ref=e266]:
                  - generic [ref=e267]: Total Amount Due
                  - generic [ref=e268]: IDR 10.054
```

# Test source

```ts
  57  |     { 
  58  |         id: 1059, 
  59  |         title: "Declined by Issuer (10059)", 
  60  |         amount: "10,059", 
  61  |         term: /Declined|Issuer|Bank|59/i 
  62  |     }
  63  |   ];
  64  | 
  65  |   for (const scenario of scenarios) {
  66  |     test(`Should fail with ${scenario.title} error on Xendit simulation`, async ({ page }) => {
  67  |       // 2. Add trigger item
  68  |       await page.evaluate((s) => {
  69  |         const item = {
  70  |           id: s.id,
  71  |           title: `Trigger Failure Item (${s.id})`,
  72  |           price: parseInt(s.amount.replace(',', '')) / 15000,
  73  |           description: `Test Item for ${s.title}`,
  74  |           category: "jewelery",
  75  |           image: "https://images.unsplash.com/photo-1573408302185-9127b5428fb3",
  76  |           rating: { rate: 1.0, count: 0 }
  77  |         };
  78  |         localStorage.setItem('cart', JSON.stringify([item]));
  79  |       }, scenario);
  80  |       
  81  |       await page.goto('/cart');
  82  |       await page.waitForURL('**/cart');
  83  |       
  84  |       const totalElement = page.locator('[data-test="cart-total"]');
  85  |       await expect(totalElement).toContainText(scenario.amount);
  86  |       await cartPage.checkout();
  87  | 
  88  |       // 4. Handle Xendit
  89  |       await expect(page).toHaveURL(/checkout-staging\.xendit\.co/, { timeout: 40000 });
  90  |       const ccMethodItem = page.locator('div[class*="payment-channel"], div[class*="Method"], button').filter({ hasText: /^Credit \/ Debit Card$/ }).first();
  91  |       await ccMethodItem.waitFor({ state: 'visible' });
  92  |       await ccMethodItem.click({ force: true });
  93  |       
  94  |       // 5. Simulation
  95  |       console.log('Searching for simulation banner...');
  96  |       let banner = null;
  97  |       for (const frame of [page, ...page.frames()]) {
  98  |           const loc = frame.locator('button, a, span, p').filter({ hasText: /simulate your payment/i }).first();
  99  |           if (await loc.isVisible().catch(() => false)) { banner = loc; break; }
  100 |       }
  101 | 
  102 |       if (banner) {
  103 |           console.log('Found simulation banner. Clicking...');
  104 |           await banner.click({ force: true });
  105 |           await page.waitForTimeout(2000);
  106 |           
  107 |           for (const frame of [page, ...page.frames()]) {
  108 |               const failureOption = frame.locator('button, div, li').filter({ hasText: scenario.term }).first();
  109 |               if (await failureOption.isVisible().catch(() => false)) {
  110 |                   console.log(`Selecting ${scenario.title} simulation...`);
  111 |                   await failureOption.click({ force: true });
  112 |                   break;
  113 |               }
  114 |           }
  115 |       }
  116 | 
  117 |       // 6. Pay
  118 |       const payBtn = page.locator('button:has-text("Pay"), button:has-text("PAY"), [data-testid*="pay"]').first();
  119 |       await payBtn.click({ force: true }).catch(() => {});
  120 | 
  121 |       // 7. Verify
  122 |       console.log('Waiting for final result...');
  123 |       await expect(async () => {
  124 |           // 1. Check for Xendit failure modal first
  125 |           for (const frame of [page, ...page.frames()]) {
  126 |               const modal = frame.locator('div').filter({ hasText: /Transaction Failed/i }).first();
  127 |               if (await modal.isVisible().catch(() => false)) {
  128 |                   const text = await modal.innerText();
  129 |                   console.log('Detected Xendit Failure Modal:', text.replace(/\n/g, ' '));
  130 |                   
  131 |                   const okBtn = frame.locator('button').filter({ hasText: /OK|Got it/i }).first();
  132 |                   if (await okBtn.isVisible()) {
  133 |                       await okBtn.click();
  134 |                       console.log('Clicked OK on failure modal.');
  135 |                   }
  136 |                   break;
  137 |               }
  138 |           }
  139 | 
  140 |           // 2. Check for App Failure Banner
  141 |           const failureBanner = page.locator('[data-test="payment-error-banner"]').first();
  142 |           if (await failureBanner.isVisible().catch(() => false)) {
  143 |               const text = await failureBanner.innerText();
  144 |               console.log('Found App Failure Banner:', text);
  145 |               expect(text.toLowerCase()).toMatch(scenario.term);
  146 |           } else {
  147 |               // If we are still on Xendit and found OTP, handle it
  148 |               if (page.url().includes('checkout')) {
  149 |                   const otpInput = page.locator('input[placeholder*="Code"], input[name*="otp"], #otp').first();
  150 |                   if (await otpInput.isVisible().catch(() => false)) {
  151 |                       await otpInput.fill('1234');
  152 |                       await page.keyboard.press('Enter');
  153 |                   }
  154 |               }
  155 |               throw new Error('Waiting for app failure banner...');
  156 |           }
> 157 |       }).toPass({ timeout: 60000 });
      |          ^ Error: Waiting for app failure banner...
  158 |       console.log(`E2E Negative Test Passed: ${scenario.title} correctly handled.`);
  159 |     });
  160 |   }
  161 | });
  162 | 
```