/**
 * Playwright dependencies
 */
import { test, expect } from '@playwright/test';

/**
 * Internal dependencies
 */
// import {
// 	cleanUpSettings, // Needs migration
// 	scrollToElement, // Needs migration
// 	completeWizard, // Needs migration
// } from '../../utils/onboarding-wizard-utils';
// import { saveSettings } from '../../utils/amp-settings-utils'; // Needs migration

const panelSelector = '#other-settings .components-panel__body-toggle';

test.describe('Other settings', () => {
	test.beforeEach(async ({ page }) => {
		// await cleanUpSettings(); // Needs migration
		// await completeWizard({ technical: true, mode: 'transitional' }); // Needs migration
		console.warn('Test suite "Other settings" is heavily disabled due to utility function dependencies (cleanUpSettings, completeWizard).');
		// Dummy navigation to settings page, assuming wizard is done and correct mode is set.
		await page.goto('/wp-admin/admin.php?page=amp-options');

		// await scrollToElement({ selector: panelSelector, click: true }); // Needs migration
		console.warn('Test suite "Other settings" is partially disabled due to scrollToElement dependency.');
        const panelToggle = page.locator(panelSelector);
        await panelToggle.scrollIntoViewIfNeeded();
        await panelToggle.click(); // Assuming scrollToElement also clicked it.
	});

	test.afterAll(async ({ page }) => { // Added page, though cleanUpSettings is static for now
		// await cleanUpSettings(); // Needs migration
		console.warn('Test suite "Other settings" afterAll is disabled due to cleanUpSettings dependency.');
	});

	const testCases = [
		['mobile redirect', '.mobile-redirection .amp-setting-toggle'],
		['dev tools', '.developer-tools .amp-setting-toggle'],
	];

	for (const [title, toggleSelector] of testCases) {
		test(`persists the ${title} setting value`, async ({ page }) => {
			const fullSelector = `#other-settings ${toggleSelector} input[type="checkbox"]`;
			const checkboxLocator = page.locator(fullSelector);

			// Confirm the setting is initially enabled.
			// await expect(page).toMatchElement(`${fullSelector}:checked`); // Original
			await expect(checkboxLocator).toBeChecked();

			// Disable the setting, save and reload.
			// await scrollToElement({ selector: fullSelector, click: true }); // Needs migration
			console.warn(`Test "persists the ${title} setting value" is partially disabled due to scrollToElement dependency.`);
            await checkboxLocator.scrollIntoViewIfNeeded();
            await checkboxLocator.click(); // Assuming click interaction

			// await expect(page).toMatchElement(`${fullSelector}:not(:checked)`); // Original
			await expect(checkboxLocator).not.toBeChecked();

			// await saveSettings(); // Needs migration
			console.warn(`Test "persists the ${title} setting value" is partially disabled due to saveSettings dependency.`);
            const saveButton = page.locator('.amp-settings-nav button[type="submit"]');
            if (await saveButton.isEnabled()) {
                await saveButton.click();
                await expect(page.locator('.amp .amp-save-success-notice.amp-notice')).toBeVisible({ timeout: 10000 });
            }

			await page.reload();

			// Confirm the setting value has been persisted.
			// await scrollToElement({ selector: panelSelector, click: true }); // Needs migration
            const panelToggle = page.locator(panelSelector); // Re-locate after reload
            await panelToggle.scrollIntoViewIfNeeded();
            await panelToggle.click();


			// await expect(page).toMatchElement(`${fullSelector}:not(:checked)`); // Original
            // Re-locate checkbox after reload and panel toggle
            const reLocatedCheckboxLocator = page.locator(fullSelector);
			await expect(reLocatedCheckboxLocator).not.toBeChecked();
		});
	}
});
