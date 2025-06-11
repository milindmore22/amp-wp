/**
 * WordPress dependencies
 */
// import { createMenu, deleteAllMenus } from '@wordpress/e2e-test-utils'; // These are Puppeteer-based utils from WP.

/**
 * Playwright page object.
 * @typedef {import('@playwright/test').Page} Page
 */

/**
 * Creates a test navigation menu.
 *
 * TODO: This function needs to be fully reimplemented using Playwright-native browser interactions
 * or by porting the underlying `@wordpress/e2e-test-utils` (createMenu, deleteAllMenus)
 * to be Playwright-compatible. The current implementation is a non-operational placeholder.
 *
 * @param {Page}   page           The Playwright page object.
 * @param {string} [menuLocation='top'] The theme location for the menu.
 * @return {Promise<void>}
 */
export async function createTestMenu(page, menuLocation = 'top') {
	console.warn(
		`createTestMenu utility called with location "${menuLocation}". ` +
		`This function is currently a non-operational placeholder and needs full reimplementation for Playwright. ` +
		`It does not interact with the page:`, page !== undefined // Basic check to ensure page is passed if used later
	);

	// await deleteAllMenus(); // WP e2e util - Needs Playwright equivalent.
	// await createMenu( // WP e2e util - Needs Playwright equivalent.
	// 	{
	// 		name: 'Test Menu 1',
	// 		locations: [menuLocation],
	// 	},
	// 	[
	// 		{
	// 			title: 'WordPress.org',
	// 			url: 'https://wordpress.org',
	// 			menu_order: 1,
	// 		},
	// 		{
	// 			title: 'Wikipedia.org',
	// 			url: 'https://wikipedia.org',
	// 			menu_order: 2,
	// 		},
	// 		{
	// 			title: 'Google',
	// 			url: 'https://google.com',
	// 			menu_order: 3,
	// 			parent: 1, // Assuming parent refers to the menu_order of the parent.
	// 		},
	// 	]
	// );

	// Example of what a Playwright implementation might start with:
	// await page.goto('/wp-admin/nav-menus.php');
	// ... more UI interactions or API calls to delete existing menus ...
	// await page.locator('#menu-name').fill('Test Menu 1');
	// await page.locator('#save_menu_footer').click();
	// ... more UI interactions or API calls to add items and assign location ...
}
