import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async searchProduct(query: string) {
    const searchInput = this.page.locator('[data-test="search-input"]').first();
    await searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await searchInput.fill(query);
  }

  async addProductToCart(productTitle: string) {
    // Find card by title first, then click add button within it
    const productCard = this.page.locator(`[data-test^="product-card-"]`).filter({ hasText: productTitle }).first();
    await productCard.locator('[data-test="add-to-cart-btn"]').click();
  }

  async goToCart() {
    await this.page.click('[data-test="nav-cart"]');
    // Once slide-over is open, click the checkout link to go to full cart page
    const checkoutLink = this.page.locator('[data-test="slideover-checkout"]');
    await checkoutLink.waitFor({ state: 'visible', timeout: 5000 });
    await checkoutLink.click();
  }
}
