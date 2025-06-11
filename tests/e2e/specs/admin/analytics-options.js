/**
 * Playwright dependencies
 */
import { test, expect } from '@playwright/test';

/**
 * WordPress dependencies
 */
// import { visitAdminPage } from '@wordpress/e2e-test-utils'; // Replaced by page.goto

/**
 * Internal dependencies
 */
// import { scrollToElement } from '../../utils/onboarding-wizard-utils'; // Needs migration

test.describe('AMP analytics options', () => {
	test.beforeEach(async ({ page }) => {
		// await visitAdminPage('admin.php', 'page=amp-options'); // Original
		await page.goto('/wp-admin/admin.php?page=amp-options');
		await page.addStyleTag({
			content: 'html {scroll-behavior: auto !important;}', // This is fine in Playwright
		});
	});

	test('allows adding and deleting entries', async ({ page }) => {
		// await expect(page).toClick('#analytics-options .components-panel__body-toggle'); // Original
		await page.locator('#analytics-options .components-panel__body-toggle').click();
		// await expect(page).not.toMatchElement('.amp-analytics-entry'); // Original
		await expect(page.locator('.amp-analytics-entry')).toBeHidden(); // Or toHaveCount(0)

		// await scrollToElement({ selector: '#amp-analytics-add-entry' }); // Needs migration
		// For now, assume it's visible or scroll manually if needed:
        const addEntryButton = page.locator('#amp-analytics-add-entry');
        await addEntryButton.scrollIntoViewIfNeeded();

		// Add entry.
		// await expect(page).toClick('#amp-analytics-add-entry'); // Original
		await addEntryButton.click();
		// await expect('.amp-analytics-entry').countToBe(1); // Original custom matcher
		await expect(page.locator('.amp-analytics-entry')).toHaveCount(1);
		// await expect(page).toFill('#amp-analytics-entry-1 input', 'googleanalytics'); // Original
		await page.locator('#amp-analytics-entry-1 input').fill('googleanalytics');

		// Add second entry.
		// await expect(page).toClick('#amp-analytics-add-entry'); // Original
		await addEntryButton.click();
		// await expect('.amp-analytics-entry').countToBe(2); // Original
		await expect(page.locator('.amp-analytics-entry')).toHaveCount(2);
		// await expect(page).toFill('#amp-analytics-entry-2 input', 'googleanalytics-2'); // Original
		await page.locator('#amp-analytics-entry-2 input').fill('googleanalytics-2');

		// await scrollToElement({ selector: '#amp-analytics-add-entry' }); // Needs migration
        await addEntryButton.scrollIntoViewIfNeeded();


		// Add third entry.
		// await expect(page).toClick('#amp-analytics-add-entry'); // Original
		await addEntryButton.click();
		// await expect('.amp-analytics-entry').countToBe(3); // Original
		await expect(page.locator('.amp-analytics-entry')).toHaveCount(3);
		// await expect(page).toFill('#amp-analytics-entry-3 input', 'alexametrics'); // Original
		await page.locator('#amp-analytics-entry-3 input').fill('alexametrics');

		const expectedJsonValue = JSON.stringify(
			{
				vars: {
					atrk_acct: '<YOURACCOUNT>',
					domain: '<YOURDOMAIN>',
				},
			},
			null,
			'\t'
		);
		// await expect(page).toMatchElement('#analytics-textarea-control-3', { // Original
		// 	value: expectedJsonValue,
		// });
		await expect(page.locator('#analytics-textarea-control-3')).toHaveValue(expectedJsonValue);

		// Save.
		// await expect(page).toClick('.amp-settings-nav button[type="submit"]'); // Original
		await page.locator('.amp-settings-nav button[type="submit"]').click();

		// await page.waitForSelector('.amp .amp-save-success-notice.amp-notice'); // Original
		await expect(page.locator('.amp .amp-save-success-notice.amp-notice')).toBeVisible();

		// Delete entries.
		const deleteButton = page.locator('.amp-analytics__delete-button');
		// await expect(page).toClick('.amp-analytics__delete-button'); // Original - assumes first one
		await deleteButton.first().click();
		// await expect(page).toClick('.amp-analytics__delete-button'); // Original
		await deleteButton.first().click(); // After one is deleted, the next becomes first
		// await expect(page).toClick('.amp-analytics__delete-button'); // Original
		await deleteButton.first().click();


		// await expect(page).not.toMatchElement('.amp-analytics-entry'); // Original
		await expect(page.locator('.amp-analytics-entry')).toHaveCount(0); // More precise

		// Save.
		// await expect(page).toClick('.amp-settings-nav button[type="submit"]'); // Original
		await page.locator('.amp-settings-nav button[type="submit"]').click();
		// await expect(page).toMatchElement('.amp .amp-save-success-notice.amp-notice'); // Original
		await expect(page.locator('.amp .amp-save-success-notice.amp-notice')).toBeVisible();
	});
});
