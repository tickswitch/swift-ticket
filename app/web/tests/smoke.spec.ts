import { test, expect } from '@playwright/test';

test('homepage loads and renders heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
  await page.screenshot({ path: 'test-results/homepage.png', fullPage: true });
});
