import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // Replace with your actual project title
  await expect(page).toHaveTitle(/One Little Mistake/i);
});

test('renders main content', async ({ page }) => {
  await page.goto('/');

  // Check if main element is present
  // await page.locator('main');
  // If no main tag, check body
  await expect(page.locator('body')).toBeVisible();
});
