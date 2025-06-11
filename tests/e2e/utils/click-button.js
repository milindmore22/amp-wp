/**
 * Playwright specific import
 */
// import type { Page } from '@playwright/test'; // Optional: For type safety

/**
 * Clicks a button based on the text on the button.
 *
 * Migrated from a Puppeteer utility. Playwright's click is generally robust.
 *
 * @param {import('@playwright/test').Page} page The Playwright page object.
 * @param {string} buttonText The text that appears on the button to click.
 */
export async function clickButton(page, buttonText) {
	// Original: const button = await page.waitForXPath(`//button[contains(text(), '${buttonText}')]`);
	// Using Playwright locator with XPath. Auto-waits by default.
	const buttonLocator = page.locator(`xpath=//button[contains(text(), '${buttonText}')]`);

	// Original: await page.evaluate((btn) => { btn.click(); }, button);
	// Using Playwright's standard click method.
	await buttonLocator.click();
}
