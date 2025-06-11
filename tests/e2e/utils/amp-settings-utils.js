/**
 * External dependencies
 */
import path from 'path'; // This should still work

/**
 * Playwright helpers
 */
// It's good practice to pass page fixture to utility functions
// import type { Page } from '@playwright/test';

/**
 * WordPress dependencies
 */
// import {
// 	activatePlugin as _activatePlugin, // WP e2e util, needs Playwright equivalent or porting
// 	deactivatePlugin as _deactivatePlugin, // WP e2e util, needs Playwright equivalent or porting
// 	installPlugin as _installPlugin, // WP e2e util, needs Playwright equivalent or porting
// 	switchUserToAdmin, // WP e2e util, needs Playwright equivalent or porting for user context switching
// 	switchUserToTest, // WP e2e util, needs Playwright equivalent or porting for user context switching
// 	uninstallPlugin as _uninstallPlugin, // WP e2e util, needs Playwright equivalent or porting
// 	visitAdminPage as __visitAdminPage, // WP e2e util, replaced by direct page.goto()
// } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
// import { scrollToElement as _scrollToElement } from './onboarding-wizard-utils'; // This util also needs migration

// Placeholder for scrollToElement if not yet migrated
async function scrollToElement(page, selector, click = false) {
	console.warn(`scrollToElement used for selector "${selector}", ensure this utility is fully migrated.`);
	const locator = page.locator(selector);
	await locator.scrollIntoViewIfNeeded();
	if (click) {
		await locator.click();
	}
}


export async function saveSettings(page) { // Added page argument
	// await expect(page).toClick('button', { text: 'Save' }); // Original
	await page.locator('button').filter({ hasText: 'Save' }).click();
	// await expect(page).toMatchElement('button[disabled]', { // Original
	// 	text: 'Save',
	// 	timeout: 10000,
	// });
	await expect(page.locator('button[disabled]').filter({ hasText: 'Save' })).toBeVisible({ timeout: 10000 });
	// await expect(page).toMatchElement('.amp-save-success-notice', { // Original
	// 	text: 'Saved',
	// });
	await expect(page.locator('.amp-save-success-notice').filter({ hasText: 'Saved' })).toBeVisible();
}

export async function setTemplateMode(page, mode) { // Added page argument
	// await _scrollToElement({ selector: `#template-mode-${mode}`, click: true }); // Original, uses local util
	await scrollToElement(page, `#template-mode-${mode}`, true); // Using placeholder
	await saveSettings(page);
}

export async function isPluginInstalled(page, slug, settings) { // Added page argument
	console.warn('isPluginInstalled: Relies on user switching (switchUserToAdmin, switchUserToTest) which needs a Playwright-compatible migration.');
	// await switchUserToAdmin(); // WP e2e util
	// await __visitAdminPage('plugins.php', ''); // Original, uses WP e2e util
	await page.goto('/wp-admin/plugins.php');
	// await page.waitForSelector('h1', { text: 'Plugins' }); // Original
	await expect(page.locator('h1').filter({ hasText: 'Plugins' })).toBeVisible();


	// const found = await page.$( // Original
	// 	`tr${settings?.checkIsActivated ? '.active' : ''}[data-slug="${slug}"]`
	// );
	const locator = page.locator(`tr${settings?.checkIsActivated ? '.active' : ''}[data-slug="${slug}"]`);
	const count = await locator.count();

	// await switchUserToTest(); // WP e2e util
	return count > 0; // Boolean(found)
}

export function isPluginActivated(page, slug) { // Added page argument
	return isPluginInstalled(page, slug, { checkIsActivated: true });
}

export async function installPlugin(page, slug) { // Added page argument
	console.warn('installPlugin: Relies on _installPlugin (WP e2e util) which needs a Playwright-compatible migration.');
	if (!(await isPluginInstalled(page, slug))) {
		// await _installPlugin(slug); // WP e2e util
		throw new Error(`installPlugin: _installPlugin for '${slug}' needs migration. Plugin not installed.`);
	}
}

export async function installLocalPlugin(page, slug) { // Added page argument
	console.warn('installLocalPlugin: Relies on user switching and may need adjustments for Playwright.');
	if (await isPluginInstalled(page, slug)) {
		return;
	}

	// await switchUserToAdmin(); // WP e2e util
	// await __visitAdminPage('plugin-install.php', ''); // Original
	await page.goto('/wp-admin/plugin-install.php');
	// await page.waitForSelector('h1', { text: /Add Plugins/ }); // Original
	await expect(page.locator('h1').filter({ hasText: /Add Plugins/ })).toBeVisible();


	// await page.click('.upload-view-toggle'); // Original
	await page.locator('.upload-view-toggle').click();
	// await page.waitForSelector('#pluginzip'); // Original
	await expect(page.locator('#pluginzip')).toBeVisible();


	const pluginPath = path.join(__dirname, '..', 'plugins', `${slug}.zip`);

	// await expect(page).toUploadFile('#pluginzip', pluginPath); // Original
	await page.locator('#pluginzip').setInputFiles(pluginPath);

	// await page.waitForSelector('#install-plugin-submit:not([disabled])'); // Original
	await expect(page.locator('#install-plugin-submit:not([disabled])')).toBeVisible();
	// await page.click('#install-plugin-submit'); // Original
	await page.locator('#install-plugin-submit').click();
	// await page.waitForSelector('p', { text: /Plugin installed successfully/ }); // Original
	await expect(page.locator('p').filter({ hasText: /Plugin installed successfully/ })).toBeVisible({ timeout: 30000 }); // Increased timeout for plugin install

	// await switchUserToTest(); // WP e2e util
}

export async function activatePlugin(page, slug) { // Added page argument
	console.warn('activatePlugin: Relies on _activatePlugin (WP e2e util) which needs a Playwright-compatible migration.');
	await installPlugin(page, slug); // This now also warns if _installPlugin is hit

	if (!(await isPluginActivated(page, slug))) {
		// await _activatePlugin(slug); // WP e2e util
		throw new Error(`activatePlugin: _activatePlugin for '${slug}' needs migration. Plugin not activated.`);
	}
}

export async function deactivatePlugin(page, slug) { // Added page argument
	console.warn('deactivatePlugin: Relies on _deactivatePlugin (WP e2e util) which needs a Playwright-compatible migration.');
	if (await isPluginActivated(page, slug)) {
		// await _deactivatePlugin(slug); // WP e2e util
		throw new Error(`deactivatePlugin: _deactivatePlugin for '${slug}' needs migration. Plugin not deactivated.`);
	}
}

export async function uninstallPlugin(page, slug) { // Added page argument
	console.warn('uninstallPlugin: Relies on _uninstallPlugin (WP e2e util) which needs a Playwright-compatible migration.');
	await deactivatePlugin(page, slug); // This now also warns

	if (await isPluginInstalled(page, slug)) {
		// await _uninstallPlugin(slug); // WP e2e util
		throw new Error(`uninstallPlugin: _uninstallPlugin for '${slug}' needs migration. Plugin not uninstalled.`);
	}
}

export async function cleanUpValidatedUrls(page) { // Added page argument
	console.warn('cleanUpValidatedUrls: Relies on user switching and complex UI interaction, needs careful review for Playwright.');
	// await switchUserToAdmin(); // WP e2e util
	// await __visitAdminPage('edit.php', 'post_type=amp_validated_url'); // Original
	await page.goto('/wp-admin/edit.php?post_type=amp_validated_url');
	// await page.waitForSelector('h1'); // Original
	await expect(page.locator('h1').first()).toBeVisible(); // Wait for a H1

	const bulkSelectorLocator = page.locator('#bulk-action-selector-top');
	// const bulkSelector = await page.$('#bulk-action-selector-top'); // Original
	// if (!bulkSelector) { // Original
	// 	return;
	// }
	if (await bulkSelectorLocator.count() === 0) {
		// await switchUserToTest(); // WP e2e util (ensure this runs if we return early)
		return;
	}


	// await page.waitForSelector('[id^=cb-select-all-]'); // Original
	await expect(page.locator('[id^=cb-select-all-]')).toBeVisible();
	// await page.click('[id^=cb-select-all-]'); // Original
	await page.locator('[id^=cb-select-all-]').click();

	// await page.select('#bulk-action-selector-top', 'delete'); // Original
	await bulkSelectorLocator.selectOption('delete');

	// await page.click('#doaction'); // Original
	await page.locator('#doaction').click();

	// await page.waitForXPath( // Original
	// 	'//*[contains(@class, "notice") and contains(@class, "updated")]/p[contains(text(), "forgotten")]'
	// );
	await expect(page.locator('xpath=//*[contains(@class, "notice") and contains(@class, "updated")]/p[contains(text(), "forgotten")]')).toBeVisible();
	// await switchUserToTest(); // WP e2e util
}
