# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cc-insufficient-funds.spec.ts >> Credit Card Negative Scenarios - Xendit Failures >> Should fail with Insufficient Balance (10054) error on Xendit simulation
- Location: tests\cc-insufficient-funds.spec.ts:66:5

# Error details

```
Error: Waiting for failure message...

Call Log:
- Timeout 60000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - paragraph [ref=e5]: You are in Test Mode and any transactions made are simulated and not real.
    - button "Click here to simulate your payment with Credit Card" [ref=e6] [cursor=pointer]
  - main [ref=e7]:
    - generic [ref=e9]:
      - generic [ref=e11]:
        - generic [ref=e12]:
          - img "malstro" [ref=e14]
          - heading "malstro" [level=3] [ref=e15]
        - button "Switch language" [ref=e20] [cursor=pointer]:
          - text: English
          - img [ref=e21]
      - generic [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]:
            - paragraph [ref=e26]: Pay Before September 7, 2026 at 7:02 PM
            - paragraph [ref=e29]: IDR 10.054
          - generic [ref=e31]:
            - heading "Payment Method" [level=2] [ref=e32]
            - generic [ref=e33]:
              - heading "Bank Transfer BJB Muamalat Permata +9" [level=3] [ref=e35]:
                - button "Bank Transfer BJB Muamalat Permata +9" [ref=e36] [cursor=pointer]:
                  - img [ref=e38]
                  - generic [ref=e43]:
                    - generic [ref=e45]: Bank Transfer
                    - generic [ref=e46]:
                      - img "BJB" [ref=e48]
                      - img "Muamalat" [ref=e50]
                      - img "Permata" [ref=e52]
                      - generic [ref=e53]: "+9"
                  - img [ref=e54]
              - generic [ref=e56]:
                - heading "Credit / Debit Card" [level=3] [ref=e57]:
                  - button "Credit / Debit Card" [expanded] [ref=e58] [cursor=pointer]:
                    - img [ref=e60]
                    - generic [ref=e67]: Credit / Debit Card
                    - img [ref=e68]
                - region "Credit / Debit Card" [ref=e70]:
                  - generic [ref=e72]:
                    - generic [ref=e73]:
                      - group [ref=e74]:
                        - generic [ref=e75]: Card Number
                        - textbox "Card number" [ref=e78]:
                          - /placeholder: 4000 0000 0000 1091
                      - generic [ref=e79]:
                        - group [ref=e81]:
                          - generic [ref=e82]: Valid Thru
                          - textbox "Card expiry" [ref=e85]:
                            - /placeholder: MM/YY
                        - group [ref=e87]:
                          - generic [ref=e88]: CVN
                          - textbox "CVN" [ref=e91]
                    - generic [ref=e92]:
                      - generic [ref=e93]:
                        - group [ref=e95]:
                          - generic [ref=e96]: First Name
                          - textbox "John" [ref=e99]
                        - group [ref=e101]:
                          - generic [ref=e102]: Last Name
                          - textbox "Doe" [ref=e105]
                      - group [ref=e106]:
                        - generic [ref=e107]: Email Address
                        - textbox "payer@xendit.co" [ref=e110]
                      - group [ref=e112]:
                        - generic [ref=e113]: Mobile Number
                        - generic [ref=e115]:
                          - combobox [ref=e117] [cursor=pointer]:
                            - generic [ref=e118]: 🇮🇩
                            - generic [ref=e119]: "+62"
                          - textbox "Enter mobile number" [ref=e122]
                    - group [ref=e124]:
                      - generic [ref=e125]: Installment Plan
                      - generic [ref=e127]:
                        - button "Pay in full" [disabled] [ref=e128]:
                          - generic [ref=e131]: Pay in full
                          - img [ref=e132]
                        - generic:
                          - list:
                            - listitem:
                              - button "Pay in full":
                                - generic:
                                  - generic: Pay in full
                    - button "Pay Now" [disabled] [ref=e135]
              - heading "E-Wallet OVO ShopeePay Nex Cash +5" [level=3] [ref=e137]:
                - button "E-Wallet OVO ShopeePay Nex Cash +5" [ref=e138] [cursor=pointer]:
                  - img [ref=e140]
                  - generic [ref=e142]:
                    - generic [ref=e144]: E-Wallet
                    - generic [ref=e145]:
                      - img "OVO" [ref=e147]
                      - img "ShopeePay" [ref=e149]
                      - img "Nex Cash" [ref=e151]
                      - generic [ref=e152]: "+5"
                  - img [ref=e153]
              - heading "QR Payments QRIS" [level=3] [ref=e156]:
                - button "QR Payments QRIS" [ref=e157] [cursor=pointer]:
                  - img [ref=e159]
                  - generic [ref=e164]:
                    - generic [ref=e166]: QR Payments
                    - img "QRIS" [ref=e169]
                  - img [ref=e170]
              - heading "Direct Debit BRI Direct Debit Mandiri Direct Debit" [level=3] [ref=e173]:
                - button "Direct Debit BRI Direct Debit Mandiri Direct Debit" [ref=e174] [cursor=pointer]:
                  - img [ref=e176]
                  - generic [ref=e181]:
                    - generic [ref=e183]: Direct Debit
                    - generic [ref=e184]:
                      - img "BRI Direct Debit" [ref=e186]
                      - img "Mandiri Direct Debit" [ref=e188]
                  - img [ref=e189]
              - heading "PayLater Kredivo Akulaku" [level=3] [ref=e192]:
                - button "PayLater Kredivo Akulaku" [ref=e193] [cursor=pointer]:
                  - img [ref=e195]
                  - generic [ref=e198]:
                    - generic [ref=e200]: PayLater
                    - generic [ref=e201]:
                      - img "Kredivo" [ref=e203]
                      - img "Akulaku" [ref=e205]
                  - img [ref=e206]
        - generic [ref=e211]:
          - generic [ref=e212]: Powered by
          - img [ref=e213]
          - generic [ref=e215]: xendit
    - complementary [ref=e216]:
      - generic [ref=e218]:
        - generic [ref=e219]:
          - heading "Order Summary" [level=2] [ref=e220]
          - paragraph [ref=e221]:
            - strong [ref=e222]: "Invoice #:"
            - text: MAL-1788696146127
        - list [ref=e224]:
          - listitem [ref=e225]:
            - generic [ref=e226]:
              - img [ref=e228]
              - heading "Description" [level=3] [ref=e235]
            - paragraph [ref=e236]: Malstro Order for malyasqa
          - listitem [ref=e237]:
            - generic [ref=e238]:
              - img [ref=e240]
              - heading "Pay before September 7, 2026 at 7:02 PM" [level=3] [ref=e244]:
                - text: Pay before
                - strong [ref=e245]: September 7, 2026 at 7:02 PM
        - separator [ref=e247]
        - table [ref=e249]:
          - rowgroup [ref=e250]:
            - row "Trigger Failure Item (1054) 1 × IDR 10.054 IDR 10.054" [ref=e251]:
              - cell "Trigger Failure Item (1054) 1 × IDR 10.054" [ref=e252]:
                - generic [ref=e253]: Trigger Failure Item (1054)
                - generic [ref=e254]: 1 × IDR 10.054
              - cell "IDR 10.054" [ref=e255]
            - row [ref=e256]:
              - cell [ref=e257]:
                - separator [ref=e258]
            - row "Subtotal IDR 10.054" [ref=e259]:
              - cell "Subtotal" [ref=e260]
              - cell "IDR 10.054" [ref=e261]
            - row [ref=e262]:
              - cell [ref=e263]:
                - separator [ref=e264]
            - row "Total Amount Due IDR 10.054" [ref=e265]:
              - cell "Total Amount Due IDR 10.054" [ref=e266]:
                - generic [ref=e267]:
                  - generic [ref=e268]: Total Amount Due
                  - generic [ref=e269]: IDR 10.054
```

# Test source

```ts
  38  |       try {
  39  |         for (const term of terms) {
  40  |           const loc = frame.locator('div, span, p, h1, h2, h3, .modal-content, .alert').filter({ hasText: term }).first();
  41  |           if (await loc.isVisible().catch(() => false)) return loc;
  42  |         }
  43  |       } catch (e) {}
  44  |     }
  45  |     const banner = page.locator('[data-test="payment-error-banner"]').first();
  46  |     if (await banner.isVisible().catch(() => false)) return banner;
  47  |     return null;
  48  |   };
  49  | 
  50  |   const scenarios = [
  51  |     { 
  52  |         id: 1054, 
  53  |         title: "Insufficient Balance (10054)", 
  54  |         amount: "10,054", 
  55  |         term: /Insufficient|Balance|Funds|51|54/i 
  56  |     },
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
  124 |           const failureBanner = await findFailure(page);
  125 |           if (failureBanner) {
  126 |               const text = await failureBanner.innerText();
  127 |               expect(text.toLowerCase()).toMatch(scenario.term);
  128 |           } else {
  129 |               if (page.url().includes('checkout')) {
  130 |                   const otpInput = page.locator('input[placeholder*="Code"], input[name*="otp"], #otp').first();
  131 |                   if (await otpInput.isVisible().catch(() => false)) {
  132 |                       await otpInput.fill('1234');
  133 |                       await page.keyboard.press('Enter');
  134 |                   }
  135 |               }
  136 |               throw new Error('Waiting for failure message...');
  137 |           }
> 138 |       }).toPass({ timeout: 60000 });
      |          ^ Error: Waiting for failure message...
  139 |       console.log(`E2E Negative Test Passed: ${scenario.title} correctly handled.`);
  140 |     });
  141 |   }
  142 | });
  143 | 
```