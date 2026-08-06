import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartTotal: Locator;
  readonly paymentMethodCard: Locator;
  readonly paymentMethodQR: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTitle = page.locator('[data-test="cart-title"]');
    this.cartItems = page.locator('[data-test="cart-item"]');
    this.checkoutButton = page.locator('[data-test="checkout-btn"]');
    this.emptyCartMessage = page.locator('[data-test="empty-cart-msg"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
