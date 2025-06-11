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

test.describe('Twenty Fifteen theme on AMP', () => {
	test.beforeAll(async ({ page }) => { // Added page argument
		// await installTheme('twentyfifteen'); // Needs migration
		// await activateTheme('twentyfifteen'); // Needs migration
		console.warn('Test suite "Twenty Fifteen theme on AMP" beforeAll is heavily disabled due to theme utility dependencies.');

		// await visitAdminPage('admin.php', 'page=amp-options'); // Original
		await page.goto('/wp-admin/admin.php?page=amp-options');
		// await setTemplateMode('standard'); // Needs migration
		console.warn('Test suite "Twenty Fifteen theme on AMP" beforeAll is partially disabled due to setTemplateMode dependency.');
		// Placeholder for setting standard mode if possible through UI, or assume it's set by default/previous step.
	});

	test.afterAll(async ({ page }) => { // Added page argument
		// await activateTheme('twentytwenty'); // Needs migration
		console.warn('Test suite "Twenty Fifteen theme on AMP" afterAll is disabled due to activateTheme dependency.');
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
			// await expect(page).toMatchElement( // Original
			// 	'.site-header .secondary-toggle[aria-expanded=false]'
			// );
			await expect(page.locator('.site-header .secondary-toggle')).toHaveAttribute('aria-expanded', 'false');
			// await expect(page).toMatchElement('#site-navigation', { // Original
			// 	visible: false,
			// });
			await expect(page.locator('#site-navigation')).toBeHidden();
		});

		test('should be togglable', async ({ page }) => {
			const toggleButton = page.locator('.site-header .secondary-toggle');
			const siteNavigation = page.locator('#site-navigation');

			// await expect(page).toClick('.site-header .secondary-toggle'); // Original
			await toggleButton.click();
			// await expect(page).toMatchElement( // Original
			// 	'.site-header .secondary-toggle[aria-expanded=true]'
			// );
			await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
			// await expect(page).toMatchElement('#site-navigation', { visible: true }); // Original
			await expect(siteNavigation).toBeVisible();

			// await expect(page).toClick('.site-header .secondary-toggle'); // Original
			await toggleButton.click();
			// await expect(page).toMatchElement( // Original
			// 	'.site-header .secondary-toggle[aria-expanded=false]'
			// );
			await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
			// await expect(page).toMatchElement('#site-navigation', { visible: false }); // Original
			await expect(siteNavigation).toBeHidden();
		});

		test('should have a togglable submenu', async ({ page }) => {
			// await expect(page).toClick('.site-header .secondary-toggle'); // Original
			await page.locator('.site-header .secondary-toggle').click();

			// await page.waitForSelector('#site-navigation .menu-item-has-children'); // Original
			const menuItemWithSubmenu = page.locator('#site-navigation .menu-item-has-children').first(); // Ensure we pick one if multiple
			await expect(menuItemWithSubmenu).toBeVisible();


			// const menuItemWithSubmenu = await page.$('#site-navigation .menu-item-has-children'); // Original
			// expect(menuItemWithSubmenu).not.toBeNull(); // Original - replaced by expect().toBeVisible() above

			const dropdownToggle = menuItemWithSubmenu.locator('.dropdown-toggle');
			const subMenu = menuItemWithSubmenu.locator('.sub-menu');

			// await expect(menuItemWithSubmenu).toMatchElement( // Original
			// 	'.dropdown-toggle[aria-expanded=false]'
			// );
			await expect(dropdownToggle).toHaveAttribute('aria-expanded', 'false');
			// await expect(menuItemWithSubmenu).toMatchElement('.sub-menu', { visible: false }); // Original
			await expect(subMenu).toBeHidden();

			// await expect(menuItemWithSubmenu).toClick('.dropdown-toggle'); // Original
			await dropdownToggle.click();
			// await expect(menuItemWithSubmenu).toMatchElement( // Original
			// 	'.dropdown-toggle[aria-expanded=true]'
			// );
			await expect(dropdownToggle).toHaveAttribute('aria-expanded', 'true');
			// await expect(menuItemWithSubmenu).toMatchElement('.sub-menu', { visible: true }); // Original
			await expect(subMenu).toBeVisible();

			// await expect(menuItemWithSubmenu).toClick('.dropdown-toggle'); // Original
			await dropdownToggle.click();
			// await expect(menuItemWithSubmenu).toMatchElement( // Original
			// 	'.dropdown-toggle[aria-expanded=false]'
			// );
			await expect(dropdownToggle).toHaveAttribute('aria-expanded', 'false');
			// await expect(menuItemWithSubmenu).toMatchElement('.sub-menu', { visible: false }); // Original
			await expect(subMenu).toBeHidden();
		});
	});
});
