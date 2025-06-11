/**
 * WordPress dependencies
 */
// import { visitAdminPage } from '@wordpress/e2e-test-utils'; // Replaced with page.goto

/**
 * Playwright dependencies
 */
import { test, expect } from '@playwright/test';

/**
 * Internal dependencies
 */
import { DEFAULT_MOBILE_BREAKPOINT } from '../../../../assets/src/common/constants';

test.describe('Close button placement', () => {
	test.beforeEach(async ({ page }) => {
		// await visitAdminPage('admin.php', 'page=amp-onboarding-wizard'); // Original
		await page.goto('/wp-admin/admin.php?page=amp-onboarding-wizard');
		await expect(page.locator('.amp-settings-nav__prev-next')).toBeVisible();
	});

	test('should show in footer above breakpoint, in sidebar below breakpoint', async ({ page }) => {
		await expect(page.locator('.welcome')).toBeVisible();

		const viewport = page.viewportSize();
		if (!viewport) {
			throw new Error('Viewport size is not available');
		}
		const { height } = viewport;

		await page.setViewportSize({ width: DEFAULT_MOBILE_BREAKPOINT, height });

		await expect(page.locator('.amp-settings-nav .is-link').filter({ hasText: /Close/ })).toBeVisible();
		await expect(page.locator('.amp-stepper-container__header .is-link').filter({ hasText: /Close/ })).toBeHidden();

		await page.setViewportSize({
			width: DEFAULT_MOBILE_BREAKPOINT - 1,
			height,
		});

		await expect(page.locator('.amp-settings-nav .is-link').filter({ hasText: /Close/ })).toBeHidden();
		await expect(page.locator('.amp-stepper-container__header .is-link').filter({ hasText: /Close/ })).toBeVisible();
	});
});
