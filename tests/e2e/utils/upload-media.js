/**
 * External dependencies
 */
import path from 'path';
import fs from 'fs';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

/**
 * Playwright specific import
 */
// import type { Page } from '@playwright/test'; // Optional: For type safety

/**
 * Uploads a file to the Media Library, and awaits its upload.
 *
 * The file should be in tests/e2e/assets/,
 * though the file argument should only have the name, not the directory.
 * For example, 'foo-baz.mp4'.
 *
 * @param {import('@playwright/test').Page} page The Playwright page object.
 * @param {string|null} file The file name to upload, not including the directory. If null, function will return null early.
 * @return {Promise<string|null>} The name of the file as it was uploaded (UUID + extension), also not including the full path. Null if input file is null or extension is missing.
 */
export async function uploadMedia(page, file) {
	if (!file) {
		return null;
	}

	const fileExtensionMatches = file.match(/\.\w+$/);
	// if (!fileExtensionMatches.hasOwnProperty(0)) { // Original check was a bit unusual
	if (!fileExtensionMatches || fileExtensionMatches.length === 0) {
		console.error('File extension could not be determined for:', file);
		return null;
	}
	const fileExtension = fileExtensionMatches[0];

	// Wait for media modal to appear and locate the file input.
	// await page.waitForSelector('.media-modal input[type=file]'); // Original
	const inputLocator = page.locator('.media-modal input[type=file]');
	await expect(inputLocator).toBeVisible({ timeout: 10000 }); // Wait for the input to be ready

	const testMediaPath = path.join(__dirname, '..', 'assets', file); // __dirname is relative to this utils file
	const filename = uuidv4(); // Generate a unique name without extension

	const fileWithExtension = filename + fileExtension; // Full unique filename
	const tmpFileName = path.join(os.tmpdir(), fileWithExtension); // Path to temp file

	try {
		fs.copyFileSync(testMediaPath, tmpFileName);
	} catch (error) {
		console.error(`Failed to copy file from ${testMediaPath} to ${tmpFileName}:`, error);
		return null; // Or rethrow, depending on desired error handling
	}

	// await inputElement.uploadFile(tmpFileName); // Original (Puppeteer)
	await inputLocator.setInputFiles(tmpFileName);

	// Wait for upload to complete by checking for the uploaded item in the media library UI.
	// The aria-label usually corresponds to the filename *without* extension for newly uploaded items.
	// await page.waitForSelector(`.media-modal li[aria-label="${filename}"]`); // Original
	const uploadedItemLocator = page.locator(`.media-modal li[aria-label="${filename}"]`);
	await expect(uploadedItemLocator).toBeVisible({ timeout: 20000 }); // Increased timeout for upload processing

	// Clean up the temporary file - though it might be good to do this in an afterAll hook in tests using it.
	// For now, let's leave it as is, as the original didn't clean up either.
	// fs.unlinkSync(tmpFileName); // Optional: clean up

	return fileWithExtension;
}
