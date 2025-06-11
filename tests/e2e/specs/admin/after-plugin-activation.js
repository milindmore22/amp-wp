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
// import { completeWizard } from '../../utils/onboarding-wizard-utils'; // Needs migration

test.describe('After plugin activation', () => {
	const timeout = 30000;

	async function deactivate(page, slug) { // Added page argument
		await page.locator(`tr[data-slug="${slug}"] .deactivate a`).click();
		await expect(page.locator(`tr[data-slug="${slug}"] .delete a`)).toBeVisible();
	}

	async function activate(page, slug) { // Added page argument
		await page.locator(`tr[data-slug="${slug}"] .activate a`).click();
		await expect(page.locator(`tr[data-slug="${slug}"] .deactivate a`)).toBeVisible();
	}

	test.beforeAll(async ({ page }) => { // Added page argument
		// await completeWizard({ mode: 'transitional' }); // Needs migration
		console.warn('Test suite "After plugin activation" is partially disabled due to completeWizard dependency.');
		// await visitAdminPage('plugins.php', ''); // Original
		await page.goto('/wp-admin/plugins.php');
	});

	test('site scan is triggered automatically and displays no validation issues for AMP-compatible plugin', async ({ page }) => { // Added page
		await deactivate(page, 'gutenberg');

		await expect(page.locator('#amp-site-scan-notice')).toBeHidden();

		await activate(page, 'gutenberg');

		await expect(page.locator('#amp-site-scan-notice')).toBeVisible();
		// await expect(page).toMatchElement('#amp-site-scan-notice p', { // Original
		// 	text: /Checking your site for AMP compatibility issues/,
		// });
		await expect(page.locator('#amp-site-scan-notice p').filter({ hasText: /Checking your site for AMP compatibility issues/ })).toBeVisible();

		// await expect(page).toMatchElement('#amp-site-scan-notice p', { // Original
		// 	text: /No AMP compatibility issues detected/,
		// 	timeout,
		// });
		await expect(page.locator('#amp-site-scan-notice p').filter({ hasText: /No AMP compatibility issues detected/ })).toBeVisible({ timeout });

		// await expect(page).toMatchElement('#amp-site-scan-notice .amp-admin-notice--success'); // Original
		await expect(page.locator('#amp-site-scan-notice .amp-admin-notice--success')).toBeVisible();
		await expect(page.locator('#amp-site-scan-notice summary')).toBeHidden();
		// await expect(page).not.toMatchElement('#amp-site-scan-notice .amp-site-scan-notice__cta'); // Original
		await expect(page.locator('#amp-site-scan-notice .amp-site-scan-notice__cta')).toBeHidden();
	});

	test('site scan is not triggered if the user has no validation capability', async ({ page }) => { // Added page
		// This test might need a utility to set user capabilities or use a pre-configured user.
		// Assuming 'do-not-allow-amp-validate-capability' is a plugin that alters current user's caps.
		console.warn('Test "site scan is not triggered if the user has no validation capability" might require "do-not-allow-amp-validate-capability" plugin to be active or specific user setup.');
		await activate(page, 'do-not-allow-amp-validate-capability'); // This plugin needs to exist and be installable/activatable by Playwright if not pre-set

		await expect(page.locator('#amp-site-scan-notice')).toBeHidden();

		await deactivate(page, 'do-not-allow-amp-validate-capability');
	});

	// Handling it.each by creating a loop
	const testCases = ['with Gutenberg active', 'without Gutenberg active'];
	for (const title of testCases) {
		test(`site scan is triggered automatically and displays validation issues for AMP-incompatible plugin ${title}`, async ({ page }) => { // Added page
			const withoutGutenberg = title.startsWith('without');

			//eslint-disable-next-line jest/no-conditional-in-test
			if (withoutGutenberg) {
				await deactivate(page, 'gutenberg');
			}

			// Assuming 'e2e-tests-demo-plugin' is an AMP-incompatible plugin for testing purposes.
			console.warn('Test "site scan ... AMP-incompatible plugin" might require "e2e-tests-demo-plugin" to be active or specific user setup.');
			await activate(page, 'e2e-tests-demo-plugin');

			await expect(page.locator('#amp-site-scan-notice')).toBeVisible();
			// await expect(page).toMatchElement('#amp-site-scan-notice p', { // Original
			// 	text: /Checking your site for AMP compatibility issues/,
			// });
			await expect(page.locator('#amp-site-scan-notice p').filter({ hasText: /Checking your site for AMP compatibility issues/ })).toBeVisible();
			// await expect(page).toMatchElement('#amp-site-scan-notice p', { // Original
			// 	text: /AMP compatibility issue\(s\) discovered with the following plugin:/,
			// 	timeout,
			// });
			await expect(page.locator('#amp-site-scan-notice p').filter({ hasText: /AMP compatibility issue\(s\) discovered with the following plugin:/ })).toBeVisible({ timeout });
			// await expect(page).toMatchElement('#amp-site-scan-notice .amp-admin-notice--warning'); // Original
			await expect(page.locator('#amp-site-scan-notice .amp-admin-notice--warning')).toBeVisible();
			// await expect(page).toMatchElement('#amp-site-scan-notice summary', { // Original
			// 	text: /E2E Tests Demo Plugin/,
			// });
			await expect(page.locator('#amp-site-scan-notice summary').filter({ hasText: /E2E Tests Demo Plugin/ })).toBeVisible();
			// await expect(page).toMatchElement('#amp-site-scan-notice .button', { // Original
			// 	text: /Review Plugin Suppression/,
			// });
			await expect(page.locator('#amp-site-scan-notice .button').filter({ hasText: /Review Plugin Suppression/ })).toBeVisible();
			// await expect(page).toMatchElement('#amp-site-scan-notice .button', { // Original
			// 	text: /View AMP-Compatible Plugins/,
			// });
			await expect(page.locator('#amp-site-scan-notice .button').filter({ hasText: /View AMP-Compatible Plugins/ })).toBeVisible();

			await deactivate(page, 'e2e-tests-demo-plugin');

			await expect(page.locator('#amp-site-scan-notice')).toBeHidden();

			//eslint-disable-next-line jest/no-conditional-in-test
			if (withoutGutenberg) {
				await activate(page, 'gutenberg');
			}
		});
	}
});
