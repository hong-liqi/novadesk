import { expect, test } from '@playwright/test';

test.describe('smoke', () => {
  test('home page loads with hero and sections', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Integrated engineering ecosystem' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'NovaDesk modules' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Case studies' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Get in touch' })).toBeVisible();
  });

  test('hero CTAs point to platform apps', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'HelpDesk SaaS' }).first()).toHaveAttribute(
      'href',
      '/helpdesk',
    );
    await expect(page.getByRole('link', { name: 'Analytics' }).first()).toHaveAttribute(
      'href',
      '/analytics',
    );
    await expect(page.getByRole('link', { name: 'Admin Portal' }).first()).toHaveAttribute(
      'href',
      '/admin',
    );
  });

  test('case study page loads', async ({ page }) => {
    await page.goto('/case-studies/spell');
    await expect(page.getByRole('heading', { name: /Spell/i })).toBeVisible();
  });
});
