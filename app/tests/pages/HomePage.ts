import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly title: Locator;
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly searchInput: Locator;
  readonly categoryFilters: Locator;
  readonly emptyState: Locator;
  readonly cartLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="home-title"]');
    this.productGrid = page.locator('[data-test="product-grid"]');
    this.productCards = page.locator('[data-test^="product-card-"]');
    this.searchInput = page.locator('[data-test="search-input"]');
    this.categoryFilters = page.locator('[data-test="category-filters"]');
    this.emptyState = page.locator('[data-test="empty-state"]');
    this.cartLink = page.locator('[data-test="nav-cart"]');
    this.logoutButton = page.locator('[data-test="logout-btn"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async filterByCategory(category: string) {
    await this.page.locator(`[data-test="category-${category.replace(/\s+/g, '-')}"]`).click();
  }

  async addToCart(index: number = 0) {
    const btn = this.page.locator('[data-test="increment-product-btn"]').nth(index);
    await expect(btn).toBeVisible({ timeout: 15000 });
    await btn.click();
  }

  async openProductDetails(index: number = 0) {
    await this.page.locator('[data-test="product-link"]').nth(index).click();
  }

  async navigateToProfile() {
    await this.page.locator('[data-test="profile-link"]').click();
  }
}
