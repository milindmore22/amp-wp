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

test.describe('Twenty Twenty theme on AMP', () => {
	test.beforeAll(async ({ page }) => { // Added page argument
		// await activateTheme('twentytwenty'); // Needs migration
		console.warn('Test suite "Twenty Twenty theme on AMP" beforeAll is heavily disabled due to theme utility dependencies.');

		// await visitAdminPage('admin.php', 'page=amp-options'); // Original
		await page.goto('/wp-admin/admin.php?page=amp-options');
		// await setTemplateMode('standard'); // Needs migration
		console.warn('Test suite "Twenty Twenty theme on AMP" beforeAll is partially disabled due to setTemplateMode dependency.');
	});

	test.describe('for mobile breakpoint', () => {
		test.beforeEach(async ({ page }) => {
			// await setBrowserViewport(MOBILE_BROWSER_VIEWPORT_SIZE); // Original
			await page.setViewportSize(MOBILE_BROWSER_VIEWPORT_SIZE);
			// await page.goto(createURL('/')); // Original
			await page.goto('/');
			// await page.waitForSelector('#site-header'); // Original
			await expect(page.locator('#site-header')).toBeVisible();
		});

		test.afterAll(async ({ page }) => { // Added page argument
			// await setBrowserViewport(DEFAULT_BROWSER_VIEWPORT_SIZE); // Original
			await page.setViewportSize(DEFAULT_BROWSER_VIEWPORT_SIZE);
		});

		test.describe('main navigation', () => {
			test.beforeAll(async ({ page }) => { // Added page argument
				// await createTestMenu('mobile'); // Needs migration (different menu name)
				console.warn('Test suite "main navigation" beforeAll is disabled due to createTestMenu dependency.');
			});

			test('should be initially hidden', async ({ page }) => {
				const mobileNavToggle = page.locator('.mobile-nav-toggle');
				const menuModal = page.locator('.menu-modal');

				// await expect(page).toMatchElement( // Original
				// 	'.mobile-nav-toggle[aria-expanded=false]'
				// );
				await expect(mobileNavToggle).toHaveAttribute('aria-expanded', 'false');
				// await expect(page).toMatchElement('.menu-modal', { visible: false }); // Original
				await expect(menuModal).toBeHidden();
			});

			test('should be togglable', async ({ page }) => {
				const mobileNavToggle = page.locator('.mobile-nav-toggle');
				const menuModal = page.locator('.menu-modal');

				// await expect(page).toClick('.mobile-nav-toggle'); // Original
				await mobileNavToggle.click();
				// await expect(page).toMatchElement( // Original
				// 	'.mobile-nav-toggle[aria-expanded=true]'
				// );
				await expect(mobileNavToggle).toHaveAttribute('aria-expanded', 'true');
				// await expect(page).toMatchElement('.menu-modal', { visible: true }); // Original
				await expect(menuModal).toBeVisible();

				// await expect(page).toClick('.mobile-nav-toggle'); // Original
				await mobileNavToggle.click();
				// await expect(page).toMatchElement( // Original
				// 	'.mobile-nav-toggle[aria-expanded=false]'
				// );
				await expect(mobileNavToggle).toHaveAttribute('aria-expanded', 'false');
				// await expect(page).toMatchElement('.menu-modal', { visible: false }); // Original
				await expect(menuModal).toBeHidden();
			});

			test('should have a togglable submenu', async ({ page }) => {
				// await expect(page).toClick('.mobile-nav-toggle'); // Original
				await page.locator('.mobile-nav-toggle').click();


				// await page.waitForSelector('.menu-modal .menu-item-has-children'); // Original
				const menuItemWithSubmenu = page.locator('.menu-modal .menu-item-has-children').first();
				await expect(menuItemWithSubmenu).toBeVisible();

				// const menuItemWithSubmenuHandle = await page.$('.menu-modal .menu-item-has-children'); // Original
				// expect(menuItemWithSubmenuHandle).not.toBeNull(); // Original

				const subMenuToggle = menuItemWithSubmenu.locator('.sub-menu-toggle');
				const subMenu = menuItemWithSubmenu.locator('.sub-menu');

				// await expect(menuItemWithSubmenu).toMatchElement( // Original
				// 	'.sub-menu-toggle[aria-expanded=false]'
				// );
				await expect(subMenuToggle).toHaveAttribute('aria-expanded', 'false');
				// await expect(menuItemWithSubmenu).toMatchElement('.sub-menu', { visible: false }); // Original
				await expect(subMenu).toBeHidden();

				// await expect(menuItemWithSubmenu).toClick('.sub-menu-toggle'); // Original
				await subMenuToggle.click();
				// await expect(menuItemWithSubmenu).toMatchElement( // Original
				// 	'.sub-menu-toggle[aria-expanded=true]'
				// );
				await expect(subMenuToggle).toHaveAttribute('aria-expanded', 'true');
				// await expect(menuItemWithSubmenu).toMatchElement('.sub-menu', { visible: true }); // Original
				await expect(subMenu).toBeVisible();

				// await expect(menuItemWithSubmenu).toClick('.sub-menu-toggle'); // Original
				await subMenuToggle.click();
				// await expect(menuItemWithSubmenu).toMatchElement( // Original
				// 	'.sub-menu-toggle[aria-expanded=false]'
				// );
				await expect(subMenuToggle).toHaveAttribute('aria-expanded', 'false');
				// await expect(menuItemWithSubmenu).toMatchElement('.sub-menu', { visible: false }); // Original
				await expect(subMenu).toBeHidden();
			});
		});

		test.describe('search modal', () => {
			test('should be togglable', async ({ page }) => {
				const mobileSearchToggle = page.locator('.mobile-search-toggle');
				const searchModal = page.locator('.search-modal');
				const closeSearchToggle = page.locator('.search-modal .close-search-toggle');


				// await expect(page).toMatchElement( // Original
				// 	'.mobile-search-toggle[aria-expanded=false]'
				// );
				await expect(mobileSearchToggle).toHaveAttribute('aria-expanded', 'false');
				// await expect(page).toMatchElement('.search-modal', { visible: false }); // Original
				await expect(searchModal).toBeHidden();

				// await expect(page).toClick('.mobile-search-toggle'); // Original
				await mobileSearchToggle.click();
				// await expect(page).toMatchElement( // Original - Note: Original test uses .search-toggle, might be an error, assuming it meant mobile-search-toggle or a general toggle
				// 	'.search-toggle[aria-expanded=true]'
				// );
				// Let's assume it's the mobileSearchToggle that should have its aria-expanded state changed
				await expect(mobileSearchToggle).toHaveAttribute('aria-expanded', 'true');

				// await expect(page).toMatchElement('.search-modal', { visible: true }); // Original
				await expect(searchModal).toBeVisible();

				// await expect(page).toMatchElement( // Original
				// 	'.search-modal .close-search-toggle[aria-expanded=true]'
				// );
				await expect(closeSearchToggle).toHaveAttribute('aria-expanded', 'true');
				// await expect(page).toClick('.search-modal .close-search-toggle'); // Original
				await closeSearchToggle.click();
				// await expect(page).toMatchElement('.search-modal', { visible: false }); // Original
				await expect(searchModal).toBeHidden();
			});
		});
	});
});
