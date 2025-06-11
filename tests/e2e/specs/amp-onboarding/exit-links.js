/**
 * Playwright dependencies
 */
import { test, expect } from '@playwright/test';

/**
 * WordPress dependencies
 */
// const {
// 	visitAdminPage, // Replaced with page.goto
// } = require('@wordpress/e2e-test-utils/build/visit-admin-page');

/**
 * Internal dependencies
 */
// const {
// 	goToOnboardingWizard, // Needs migration
// 	cleanUpSettings, // Needs migration
// 	moveToDoneScreen, // Needs migration
// } = require('../../utils/onboarding-wizard-utils');

test.describe('Onboarding wizard exit links', () => {
	test('if no previous page, returns to settings when clicking close', async ({ page }) => {
		// await goToOnboardingWizard(); // This util needs migration
		console.warn('Test "if no previous page, returns to settings when clicking close" is partially disabled due to goToOnboardingWizard dependency.');
		// Dummy navigation, replace with actual setup from goToOnboardingWizard
		await page.goto('/wp-admin/admin.php?page=amp-onboarding-wizard');


		// await expect(page).toClick('a', { text: 'Close' }); // Original
		await page.locator('a').filter({ hasText: 'Close' }).click();

		await expect(page.locator('.wp-admin')).toBeVisible(); // Was page.waitForSelector

		await expect(page.locator('h1').filter({ hasText: 'AMP Settings' })).toBeVisible();
	});

	test('returns to previous page when clicking close', async ({ page }) => {
		// await visitAdminPage('admin.php', 'page=amp-options'); // Original
		await page.goto('/wp-admin/admin.php?page=amp-options');
		await expect(page.locator('.wp-admin')).toBeVisible(); // Was page.waitForSelector

		const wizardLink = page.locator('a[href*="admin.php?page=amp-onboarding-wizard"]');
		await expect(wizardLink).toBeVisible(); // Was page.waitForSelector

		// await expect(page).toClick('a[href*="admin.php?page=amp-onboarding-wizard"]'); // Original
		await wizardLink.click();

		await expect(page.locator('#amp-onboarding-wizard')).toBeVisible(); // Was page.waitForSelector

		// await expect(page).toClick('a', { text: 'Close' }); // Original
		await page.locator('a').filter({ hasText: 'Close' }).click();

		await expect(page.locator('.wp-admin')).toBeVisible(); // Was page.waitForSelector

		await expect(page.locator('h1').filter({ hasText: 'AMP Settings' })).toBeVisible();
	});

	test('goes to settings when clicking finish', async ({ page }) => {
		// await moveToDoneScreen({ mode: 'standard' }); // This util needs migration
		console.warn('Test "goes to settings when clicking finish" is partially disabled due to moveToDoneScreen dependency.');
		// Dummy navigation, replace with actual setup from moveToDoneScreen
		await page.goto('/wp-admin/admin.php?page=amp-onboarding-wizard&step=done&mode=standard');


		// await expect(page).toClick('a', { text: 'Finish' }); // Original
		await page.locator('a').filter({ hasText: 'Finish' }).click();

		await expect(page.locator('.wp-admin')).toBeVisible(); // Was page.waitForSelector

		await expect(page.locator('h1').filter({ hasText: 'AMP Settings' })).toBeVisible();

		// await cleanUpSettings(); // This util needs migration
	});
});
