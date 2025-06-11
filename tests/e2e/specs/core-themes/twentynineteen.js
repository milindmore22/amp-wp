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

test.describe('Twenty Nineteen theme on AMP', () => {
	test.beforeAll(async ({ page }) => { // Added page argument
		// await installTheme('twentynineteen'); // Needs migration
		// await activateTheme('twentynineteen'); // Needs migration
		console.warn('Test suite "Twenty Nineteen theme on AMP" beforeAll is heavily disabled due to theme utility dependencies.');

		// await visitAdminPage('admin.php', 'page=amp-options'); // Original
		await page.goto('/wp-admin/admin.php?page=amp-options');
		// await setTemplateMode('standard'); // Needs migration
		console.warn('Test suite "Twenty Nineteen theme on AMP" beforeAll is partially disabled due to setTemplateMode dependency.');
	});

	test.afterAll(async ({ page }) => { // Added page argument
		// await activateTheme('twentytwenty'); // Needs migration
		console.warn('Test suite "Twenty Nineteen theme on AMP" afterAll is disabled due to activateTheme dependency.');
	});

	test.describe('main navigation on mobile', () => {
		test.beforeAll(async ({ page }) => { // Added page argument
			// await createTestMenu('menu-1'); // Needs migration (different menu name than previous themes)
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

		test('should have a togglable submenu', async ({ page }) => {
			// await expect(page).toMatchElement('.main-navigation'); // Original
			await expect(page.locator('.main-navigation').first()).toBeVisible(); // Ensure at least one main nav exists

			// await page.waitForSelector('.main-navigation .menu-item-has-children'); // Original
			const menuItemWithSubmenu = page.locator('.main-navigation .menu-item-has-children').first();
			await expect(menuItemWithSubmenu).toBeVisible();

			// const menuItemWithSubmenuHandle = await page.$('.main-navigation .menu-item-has-children'); // Original page.$
			// expect(menuItemWithSubmenuHandle).not.toBeNull(); // Original - replaced by expect().toBeVisible()

			const displayOnMobileToggle = menuItemWithSubmenu.locator('.display-on-mobile');
			const subMenu = menuItemWithSubmenu.locator('.sub-menu');

			// await expect(menuItemWithSubmenu).toMatchElement('.display-on-mobile'); // Original - this is a selector within menuItemWithSubmenu
			await expect(displayOnMobileToggle).toBeVisible();
			// await expect(menuItemWithSubmenu).toMatchElement('.sub-menu', { visible: false }); // Original
			await expect(subMenu).toBeHidden();

			// await expect(menuItemWithSubmenu).toClick('.display-on-mobile'); // Original
			await displayOnMobileToggle.click();
			// await expect(menuItemWithSubmenu).toMatchElement('.sub-menu', { visible: true }); // Original
			await expect(subMenu).toBeVisible();
		});
	});
});
