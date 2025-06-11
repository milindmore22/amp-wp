/**
 * Playwright dependencies
 */
import { test, expect } from '@playwright/test';

/**
 * Internal dependencies
 */
// import {
// 	testCloseButton,
// 	cleanUpSettings,
// 	moveToDoneScreen,
// 	scrollToElement,
// } from '../../utils/onboarding-wizard-utils'; // Needs migration

async function testCommonDoneStepElements(page) { // Added page argument
	await expect(page.locator('h1').filter({ hasText: 'Done' })).toBeVisible();
	await expect(page.locator('h2').filter({ hasText: 'Review' })).toBeVisible();
	await expect(page.locator('h2').filter({ hasText: 'Need help?' })).toBeVisible();

	await expect(page.locator('.done__list')).toBeVisible();
	// await expect('.done__list li').countToBe(3); // Original custom matcher
	await expect(page.locator('.done__list li')).toHaveCount(3); // Playwright equivalent

	await expect(page.locator('.done__list li').filter({ hasText: /support forums/i })).toBeVisible();
	await expect(page.locator('.done__list li').filter({ hasText: /different template mode/i })).toBeVisible();
	await expect(page.locator('.done__list li').filter({ hasText: /how the AMP plugin works/i })).toBeVisible();

	await expect(page.locator('p').filter({ hasText: /Browse your site/i })).toBeVisible();
	await expect(page.locator('.done__preview-iframe')).toBeVisible();

	// Checks for admin bar in iframe phone preview.
	const iframeElement = page.frameLocator('iframe[name="amp-wizard-completion-preview"]');
	await expect(iframeElement.locator('#wpadminbar')).toBeHidden(); // or not.toBeVisible()

	// await expect('.done__links-container a').not.countToBe(0); // Original
	await expect(page.locator('.done__links-container a')).not.toHaveCount(0); // Playwright equivalent

	const originalIframeSrc = await page.locator('.done__preview-iframe').getAttribute('src');

	// TODO: Migrate scrollToElement and ensure reliable wait for src change
	// await Promise.all([
	// 	scrollToElement({ // This util needs migration
	// 		selector: '.done__links-container a:not([class*="--active"])',
	// 		click: true,
	// 	}),
	// 	page.waitForXPath( // waitForXPath might need a Playwright-specific replacement
	// 		`//iframe[@class="done__preview-iframe"][not(@src="${originalIframeSrc}")]`
	// 	),
	// ]);
    // Temporary placeholder for the above block:
    const firstLink = page.locator('.done__links-container a:not([class*="--active"])').first();
    if (await firstLink.isVisible()) {
        await firstLink.click();
        // Need a robust way to wait for iframe src change in Playwright
        await page.waitForTimeout(1000); // Placeholder, not a reliable wait
    }


	const updatedIframeSrc = await page.locator('.done__preview-iframe').getAttribute('src');
	expect(updatedIframeSrc).not.toBe(originalIframeSrc);
}

test.describe('Done', () => {
	test.afterEach(async ({ page }) => {
		// await cleanUpSettings(); // This util needs migration
	});

	test('renders standard mode site review screen', async ({ page }) => {
		// await moveToDoneScreen({ mode: 'standard' }); // This util needs migration
		console.warn('Test "renders standard mode site review screen" is partially disabled due to moveToDoneScreen dependency.');
		// Dummy navigation to allow some parts of the test to run. Replace with actual setup.
		await page.goto('/wp-admin/admin.php?page=amp-onboarding-wizard&step=done&mode=standard');


		// testCloseButton({ exists: false }); // This util needs migration

		await testCommonDoneStepElements(page);

		await expect(page.locator('p').filter({ hasText: /Standard mode/i })).toBeVisible();
		await expect(page.locator('.done__preview-container input[type="checkbox"]')).toBeHidden();
	});

	test('renders transitional mode site review screen', async ({ page }) => {
		// await moveToDoneScreen({ mode: 'transitional' }); // This util needs migration
		console.warn('Test "renders transitional mode site review screen" is partially disabled due to moveToDoneScreen dependency.');
		await page.goto('/wp-admin/admin.php?page=amp-onboarding-wizard&step=done&mode=transitional');


		// testCloseButton({ exists: false }); // This util needs migration

		await testCommonDoneStepElements(page);

		await expect(page.locator('p').filter({ hasText: /Transitional mode/i })).toBeVisible();
		const checkbox = page.locator('.done__preview-container input[type="checkbox"]');
		await expect(checkbox).toBeVisible();
		await expect(checkbox).toBeChecked();

		const originalIframeSrc = await page.locator('.done__preview-iframe').getAttribute('src');

		// TODO: Migrate scrollToElement and ensure reliable wait for src change
		// await Promise.all([
		// 	scrollToElement({ // This util needs migration
		// 		selector: '.done__preview-container input[type="checkbox"]',
		// 		click: true,
		// 	}),
		// 	page.waitForXPath( // This might need a Playwright-specific replacement
		// 		`//iframe[@class="done__preview-iframe"][not(@src="${originalIframeSrc}")]`
		// 	),
		// ]);
        // Temporary placeholder for the above block:
        if (await checkbox.isVisible()) {
            await checkbox.click();
            // Need a robust way to wait for iframe src change in Playwright
            await page.waitForTimeout(1000); // Placeholder, not a reliable wait
        }

		const updatedIframeSrc = await page.locator('.done__preview-iframe').getAttribute('src');
		expect(updatedIframeSrc).not.toBe(originalIframeSrc);

		await expect(checkbox).not.toBeChecked();
	});

	test('renders reader mode site review screen', async ({ page }) => {
		// await moveToDoneScreen({ mode: 'reader' }); // This util needs migration
		console.warn('Test "renders reader mode site review screen" is partially disabled due to moveToDoneScreen dependency.');
		await page.goto('/wp-admin/admin.php?page=amp-onboarding-wizard&step=done&mode=reader');

		// testCloseButton({ exists: true }); // This util needs migration

		await testCommonDoneStepElements(page);

		await expect(page.locator('p').filter({ hasText: /Reader mode/i })).toBeVisible();
		await expect(page.locator('.done__preview-container input[type="checkbox"]')).toBeVisible();
	});
});
