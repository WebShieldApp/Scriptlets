/* eslint-disable no-console */
import path from 'node:path';
import fs from 'node:fs';
import { runQunitPuppeteer, printFailedTests, printResultSummary } from 'node-qunit-puppeteer';
import { fileURLToPath } from 'node:url';

import {
    server,
    port,
    start,
    stop,
} from './server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TESTS_RUN_TIMEOUT = 30000;
const TESTS_DIST = './dist';
const TEST_FILE_NAME_MARKER = '.html';

/**
 * Returns false if test failed and true if test passed
 *
 * @param {string} indexFile
 * @returns {Promise<boolean>}
 */
const runQunit = async (indexFile) => {
    const qunitArgs = {
        targetUrl: `http://localhost:${port}/${indexFile}?test`,
        timeout: TESTS_RUN_TIMEOUT,
        // needed for logging to console while testing run via `pnpm test`
        // redirectConsole: true,
        puppeteerArgs: ['--no-sandbox', '--allow-file-access-from-files'],
    };

    const result = await runQunitPuppeteer(qunitArgs);
    printResultSummary(result, console);
    if (result.stats.failed > 0) {
        printFailedTests(result, console);
        return false;
    }
    return true;
};

const runQunitTests = async () => {
    const testServer = server.init();

    await start(testServer, port);

    const dirPath = path.resolve(__dirname, TESTS_DIST);
    const testFiles = fs.readdirSync(dirPath, { encoding: 'utf8' })
        .filter((el) => el.includes(TEST_FILE_NAME_MARKER));

    let errorOccurred = false;
    let testsPassed = true;

    try {
        console.log('Running tests..');

        // eslint-disable-next-line no-restricted-syntax
        for (const fileName of testFiles) {
            // \n is needed to divide logging
            console.log(`\nTesting ${fileName}:`);
            // eslint-disable-next-line no-await-in-loop
            const testPassed = await runQunit(fileName);
            testsPassed = testsPassed && testPassed;
        }
    } catch (e) {
        console.log(e);
        await stop(testServer);
        // do not fail all tests run if some test failed
        errorOccurred = true;
    }

    if (errorOccurred || !testsPassed) {
        process.exit(1);
    }

    await stop(testServer);
};

export {
    runQunitTests,
};
