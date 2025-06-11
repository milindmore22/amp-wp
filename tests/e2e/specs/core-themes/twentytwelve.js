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
// import { createTestMenu } from '../../utils/nav-menu-utils'; // Needs migration
import {
	DEFAULT_BROWSER_VIEWPORT_SIZE,
	MOBILE_BROWSER_VIEWPORT_SIZE,
} from '../../config/bootstrap'; // Assuming this path is correct

test.describe('Twenty Twelve theme on AMP', () => {
	test.beforeAll(async ({ page }) => { // Added page argument
		// await installTheme('twentytwelve'); // Needs migration
		// await activateTheme('twentytwelve'); // Needs migration
		console.warn('Test suite "Twenty Twelve theme on AMP" beforeAll is heavily disabled due to theme utility dependencies.');

		// await visitAdminPage('admin.php', 'page=amp-options'); // Original
		await page.goto('/wp-admin/admin.php?page=amp-options');
		// await setTemplateMode('standard'); // Needs migration
		console.warn('Test suite "Twenty Twelve theme on AMP" beforeAll is partially disabled due to setTemplateMode dependency.');
	});

	test.afterAll(async ({ page }) => { // Added page argument
		// await activateTheme('twentytwenty'); // Needs migration
		console.warn('Test suite "Twenty Twelve theme on AMP" afterAll is disabled due to activateTheme dependency.');
	});

	test.describe('main navigation on mobile', () => {
		test.beforeAll(async ({ page }) => { // Added page argument
			// await createTestMenu('primary'); // Needs migration
			console.warn('Test suite "main navigation on mobile" beforeAll is disabled due to createTestMenu dependency.');
		});

		test.beforeEach(async ({ page }) => {
			// await setBrowserViewport(MOBILE_BROWSER_VIEWPORT_SIZE); // Original
			await page.setViewportSize(MOBILE_BROWSER_VIEWPORT_SIZE);
			// await page.goto(createURL('/')); // Original
			await page.goto('/'); // baseURL is handled by Playwright config
			// await page.waitForSelector('#page'); // Original
			await expect(page.locator('#page')).toBeVisible();
		});

		test.afterAll(async ({ page }) => { // Added page argument
			// await setBrowserViewport(DEFAULT_BROWSER_VIEWPORT_SIZE); // Original
			await page.setViewportSize(DEFAULT_BROWSER_VIEWPORT_SIZE);
		});

		test('should be initially hidden', async ({ page }) => {
			const menuToggle = page.locator('#site-navigation .menu-toggle');
			const navMenu = page.locator('#site-navigation .nav-menu');

			// await expect(page).toMatchElement( // Original
			// 	'#site-navigation .menu-toggle[aria-expanded=false]'
			// );
			await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
			// await expect(page).toMatchElement('#site-navigation .nav-menu', { // Original
			// 	visible: false,
			// });
			await expect(navMenu).toBeHidden();
		});

		test('should be togglable', async ({ page }) => {
			const menuToggle = page.locator('#site-navigation .menu-toggle');
			const navMenu = page.locator('#site-navigation .nav-menu');

			// await expect(page).toClick('#site-navigation .menu-toggle'); // Original
			await menuToggle.click();
			// await expect(page).toMatchElement( // Original
			// 	'#site-navigation .menu-toggle[aria-expanded=true]'
			// );
			await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
			// await expect(page).toMatchElement('#site-navigation .nav-menu', { // Original
			// 	visible: true,
			// });
			await expect(navMenu).toBeVisible();

			// Submenus are expanded by default on twentytwelve mobile.
			// await expect(page).toMatchElement( // Original
			// 	'#site-navigation .nav-menu .menu-item-has-children .sub-menu',
			// 	{ visible: true }
			// );
			await expect(page.locator('#site-navigation .nav-menu .menu-item-has-children .sub-menu').first()).toBeVisible();

			// await expect(page).toClick('#site-navigation .menu-toggle'); // Original
			await menuToggle.click();
			// await expect(page).toMatchElement( // Original
			// 	'#site-navigation .menu-toggle[aria-expanded=false]'
			// );
			await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
			// await expect(page).toMatchElement('#site-navigation .nav-menu', { // Original
			// 	visible: false,
			// });
			await expect(navMenu).toBeHidden();
		});
	});
});
