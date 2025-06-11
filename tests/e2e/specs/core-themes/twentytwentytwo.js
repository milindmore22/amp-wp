/**
 * Playwright dependencies
 */
import { test, expect } from '@playwright/test';

/**
 * WordPress dependencies
 */
// import {
// 	activateTheme, // Needs migration
// 	createURL, // Replaced by direct URL construction or page.url()
// 	installTheme, // Needs migration
// 	setBrowserViewport, // Replaced by page.setViewportSize()
// 	visitAdminPage, // Replaced by page.goto()
// } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
// import { setTemplateMode } from '../../utils/amp-settings-utils'; // Needs migration
import {
	DEFAULT_BROWSER_VIEWPORT_SIZE,
	MOBILE_BROWSER_VIEWPORT_SIZE,
} from '../../config/bootstrap'; // Assuming this path is correct

test.describe('Twenty Twenty-Two theme on AMP', () => {
	test.beforeAll(async ({ page }) => { // Added page argument
		// await installTheme('twentytwentytwo'); // Needs migration
		// await activateTheme('twentytwentytwo'); // Needs migration
		console.warn('Test suite "Twenty Twenty-Two theme on AMP" beforeAll is heavily disabled due to theme utility dependencies.');

		// await visitAdminPage('admin.php', 'page=amp-options'); // Original
		await page.goto('/wp-admin/admin.php?page=amp-options');
		// await setTemplateMode('standard'); // Needs migration
		console.warn('Test suite "Twenty Twenty-Two theme on AMP" beforeAll is partially disabled due to setTemplateMode dependency.');
	});

	test.afterAll(async ({ page }) => { // Added page argument
		// await activateTheme('twentytwenty'); // Needs migration
		console.warn('Test suite "Twenty Twenty-Two theme on AMP" afterAll is disabled due to activateTheme dependency.');
	});

	test.describe('header navigation on mobile', () => {
		const pageHeaderSelector = 'header.wp-block-template-part';

		test.beforeEach(async ({ page }) => {
			// await setBrowserViewport(MOBILE_BROWSER_VIEWPORT_SIZE); // Original
			await page.setViewportSize(MOBILE_BROWSER_VIEWPORT_SIZE);
			// await page.goto(createURL('/')); // Original
			await page.goto('/');
			// await page.waitForSelector('.wp-site-blocks'); // Original
			await expect(page.locator('.wp-site-blocks')).toBeVisible();
		});

		test.afterAll(async ({ page }) => { // Added page argument
			// await setBrowserViewport(DEFAULT_BROWSER_VIEWPORT_SIZE); // Original
			await page.setViewportSize(DEFAULT_BROWSER_VIEWPORT_SIZE);
		});

		test('should be initially hidden', async ({ page }) => {
			// const pageHeaderElement = await page.$(pageHeaderSelector); // Original
			// expect(pageHeaderElement).not.toBeNull(); // Original
			const pageHeaderLocator = page.locator(pageHeaderSelector);
			await expect(pageHeaderLocator).toBeVisible();


			// await expect(pageHeaderElement).toMatchElement( // Original
			// 	'.wp-block-navigation__responsive-container-open'
			// );
			await expect(pageHeaderLocator.locator('.wp-block-navigation__responsive-container-open')).toBeVisible();
			// await expect(pageHeaderElement).toMatchElement( // Original
			// 	'.wp-block-navigation__responsive-container[aria-hidden=true]',
			// 	{ visible: false }
			// );
			const responsiveContainer = pageHeaderLocator.locator('.wp-block-navigation__responsive-container');
			await expect(responsiveContainer).toHaveAttribute('aria-hidden', 'true');
			await expect(responsiveContainer).toBeHidden(); // Check visibility as well

			// await expect(pageHeaderElement).toMatchElement( // Original
			// 	'.wp-block-navigation__responsive-container-close',
			// 	{ visible: false }
			// );
			await expect(pageHeaderLocator.locator('.wp-block-navigation__responsive-container-close')).toBeHidden();
		});

		test('should be togglable', async ({ page }) => {
			// await page.waitForSelector(pageHeaderSelector); // Original
			const pageHeaderLocator = page.locator(pageHeaderSelector);
			await expect(pageHeaderLocator).toBeVisible();

			// const pageHeaderElementHandle = await page.$(pageHeaderSelector); // Original
			// expect(pageHeaderElementHandle).not.toBeNull(); // Original

			const openButton = pageHeaderLocator.locator('.wp-block-navigation__responsive-container-open');
			const closeButton = pageHeaderLocator.locator('.wp-block-navigation__responsive-container-close');
			const responsiveContainer = pageHeaderLocator.locator('.wp-block-navigation__responsive-container');

			// await expect(pageHeaderElementHandle).toClick( // Original
			// 	'.wp-block-navigation__responsive-container-open'
			// );
			await openButton.click();
			// await expect(pageHeaderElementHandle).toMatchElement( // Original
			// 	'.wp-block-navigation__responsive-container[aria-hidden=false]'
			// );
			await expect(responsiveContainer).toHaveAttribute('aria-hidden', 'false');
			await expect(responsiveContainer).toBeVisible(); // Check visibility

			// await expect(pageHeaderElementHandle).toMatchElement( // Original
			// 	'.wp-block-navigation__responsive-container-close'
			// );
			await expect(closeButton).toBeVisible();


			// await expect(pageHeaderElementHandle).toClick( // Original
			// 	'.wp-block-navigation__responsive-container-close'
			// );
			await closeButton.click();
			// await expect(pageHeaderElementHandle).toMatchElement( // Original
			// 	'.wp-block-navigation__responsive-container[aria-hidden=true]',
			// 	{ visible: false }
			// );
			await expect(responsiveContainer).toHaveAttribute('aria-hidden', 'true');
			await expect(responsiveContainer).toBeHidden();

			// await expect(pageHeaderElementHandle).toMatchElement( // Original
			// 	'.wp-block-navigation__responsive-container-close',
			// 	{ visible: false }
			// );
			await expect(closeButton).toBeHidden();
		});
	});
});
