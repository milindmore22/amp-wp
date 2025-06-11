/**
 * Playwright dependencies
 */
import { test, expect } from '@playwright/test';

/**
 * WordPress dependencies
 */
// import { visitAdminPage } from '@wordpress/e2e-test-utils'; // Replaced by page.goto

test.describe('AMP settings screen reader themes carousel', () => {
	test.beforeEach(async ({ page }) => {
		// await visitAdminPage('admin.php', 'page=amp-options'); // Original
		await page.goto('/wp-admin/admin.php?page=amp-options');
		await page.addStyleTag({
			content: 'html {scroll-behavior: auto !important;}', // This is fine in Playwright
		});
	});

	test('allows selection of carousel items', async ({ page }) => {
		// await expect(page).toClick('#template-mode-reader'); // Original
		await page.locator('#template-mode-reader').click();
		// await expect(page).toClick('#reader-themes .components-panel__body-toggle'); // Original
		await page.locator('#reader-themes .components-panel__body-toggle').click();

		// await expect(page).toMatchElement('.amp-carousel__carousel'); // Original
		await expect(page.locator('.amp-carousel__carousel')).toBeVisible();
		// await expect(page).toMatchElement('#theme-card__twentynineteen'); // Original
		const themeCardTwentyNineteen = page.locator('#theme-card__twentynineteen');
		await expect(themeCardTwentyNineteen).toBeVisible();

		// await expect(page).toClick('#theme-card__twentynineteen'); // Original
		await themeCardTwentyNineteen.click(); // Assuming it's a radio or checkbox to be checked by click
		// await expect(page).toMatchElement('#theme-card__twentynineteen:checked'); // Original
		await expect(themeCardTwentyNineteen).toBeChecked();
	});
});
