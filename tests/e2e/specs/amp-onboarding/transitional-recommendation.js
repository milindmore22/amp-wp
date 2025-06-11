/**
 * Playwright dependencies
 */
import { test, expect } from '@playwright/test';

/**
 * Internal dependencies
 */
// import {
// 	moveToReaderThemesScreen, // Needs migration
// 	moveToDoneScreen, // Needs migration
// } from '../../utils/onboarding-wizard-utils';

/**
 * When selecting Reader mode, the list of themes should no longer omit the active theme from the list.
 * Instead, if the user selects the active theme to be the Reader theme, then the template mode should be automatically
 * switched from reader to transitional, and a notice can appear on the summary screen to make them aware of this.
 *
 * The active theme in test environment is twentytwenty.
 *
 * @see https://github.com/ampproject/amp-wp/issues/4975
 */
test.describe('Current active theme is reader theme and user is nontechnical', () => {
	test('includes active theme in reader theme list', async ({ page }) => {
		// await moveToReaderThemesScreen({ technical: false }); // This util needs migration
		console.warn('Test "includes active theme in reader theme list" is partially disabled due to moveToReaderThemesScreen dependency.');
		// Dummy navigation
		await page.goto('/wp-admin/admin.php?page=amp-onboarding-wizard&step=reader-theme&technical=false');

		// await expect(page).toMatchElement('[for="theme-card__twentytwenty"]'); // Original
		await expect(page.locator('[for="theme-card__twentytwenty"]')).toBeVisible();
	});

	test('switches to transitional mode and shows a notice if the user chooses the active theme', async ({ page }) => {
		// await moveToDoneScreen({ // This util needs migration
		// 	technical: false,
		// 	readerTheme: 'twentytwenty',
		// 	mode: 'reader',
		// });
		console.warn('Test "switches to transitional mode and shows a notice if the user chooses the active theme" is partially disabled due to moveToDoneScreen dependency.');
		// Dummy navigation - This state is complex to replicate with a simple URL
		await page.goto('/wp-admin/admin.php?page=amp-onboarding-wizard&step=done&technical=false&readerTheme=twentytwenty&mode=reader');


		// const stepperItemCount = await page.$$eval('.amp-stepper__item', (els) => els.length); // Original
		// expect(stepperItemCount).toBe(5); // Original
		await expect(page.locator('.amp-stepper__item')).toHaveCount(5);

		// await expect(page).toMatchElement('p', { text: /transitional mode/i }); // Original
		await expect(page.locator('p').filter({ hasText: /transitional mode/i })).toBeVisible();
		// await expect(page).toMatchElement('.amp-notice--info', { // Original
		// 	text: /switched to Transitional/i,
		// });
		await expect(page.locator('.amp-notice--info').filter({ hasText: /switched to Transitional/i })).toBeVisible();
	});
});
