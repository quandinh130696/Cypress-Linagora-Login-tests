const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const marge = require('mochawesome-report-generator');
const mochawesomeMerge = require('mochawesome-merge');
const merge = mochawesomeMerge.merge || mochawesomeMerge.default || mochawesomeMerge;

const execAsync = promisify(exec);

(async () => {
    try {
        // === Define key paths ===
        const testDir = path.join(__dirname, '../tests');
        const jsonDir = path.join(__dirname, '../results/.jsons');
        const screenshotsDir = path.join(__dirname, '../results/screenshots');

        // Ensure JSON output directory exists
        if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });

        // === 1. Collect all spec files ===
        const files = fs.readdirSync(testDir).filter(f => f.endsWith('.spec.js'));
        if (files.length === 0) {
            console.log('No .spec.js test files found.');
            process.exit(0);
        }

        // === 2. Build Cypress run commands ===
        const commands = files.map(
            file => `npx cypress run --spec "cypress/tests/${file}" --browser chrome --headed`
        );

        console.log('Running Cypress specs in parallel:\n', commands.join('\n'));

        // Run all specs concurrently
        await execAsync(`npx concurrently "${commands.join('" "')}"`, {
            stdio: 'inherit',
            shell: true
        });

        console.log('All Cypress tests finished.');
        console.log('Waiting 5 seconds to ensure all JSON files are written...');
        await new Promise(r => setTimeout(r, 5000));

        // === 3. Gather JSON files ===
        const jsonFiles = fs.readdirSync(jsonDir)
            .filter(f => f.endsWith('.json'))
            .map(f => path.join(jsonDir, f));

        if (jsonFiles.length === 0) {
            console.log('No JSON report files found to merge.');
            process.exit(0);
        }

        console.log('Merging the following JSON files:');
        jsonFiles.forEach(f => console.log('  ', f));

        const mergedReport = await merge({ files: jsonFiles });

        // === 4. Fix screenshot paths for correct relative references ===
        const toPosix = p => p.replace(/\\/g, '/');
        const encodePathSegments = p =>
            p.split('/')
                .map(seg => encodeURIComponent(seg))
                .join('/');

        mergedReport.results.forEach(result => {
            result.suites?.forEach(suite => {
                suite.tests?.forEach(test => {
                    if (test.context && typeof test.context === 'string') {
                        try {
                            const ctx = JSON.parse(test.context);
                            if (ctx.title === 'cypress-mochawesome-reporter-screenshots' && Array.isArray(ctx.value)) {
                                ctx.value = ctx.value.map(v => {
                                    let raw = String(v[0] || '');

                                    // Convert all backslashes to forward slashes
                                    raw = toPosix(raw);

                                    // Remove leading slashes
                                    raw = raw.replace(/^\/+/, '');

                                    // Remove redundant "screenshots/" prefix (will re-add below)
                                    raw = raw.replace(/^screenshots\//i, '');

                                    // Clean duplicate slashes
                                    raw = raw.replace(/\/+/g, '/').trim();

                                    // Encode path segments safely
                                    const encoded = encodePathSegments(raw);

                                    // Correct prefix (since final-report.html is inside .jsons)
                                    const fixedPath = `../screenshots/${encoded}`;

                                    return [fixedPath];
                                });

                                test.context = JSON.stringify(ctx, null, 2);
                            }
                        } catch {
                            // ignore malformed JSON contexts
                        }
                    }
                });
            });
        });

        // === 5. Write merged JSON ===
        const outputJsonPath = path.join(jsonDir, 'final-report.json');
        fs.writeFileSync(outputJsonPath, JSON.stringify(mergedReport, null, 2));
        console.log(`Merged JSON written to: ${outputJsonPath}`);

        // === 6. Generate final HTML report in the same folder ===
        await marge.create(mergedReport, {
            reportDir: jsonDir,
            reportFilename: 'final-report',
            inline: true,
            inlineAssets: true,
            embeddedScreenshots: true,
            assetsDir: screenshotsDir
        });

        console.log(`Final HTML report generated at: ${path.join(jsonDir, 'final-report.html')}`);
    } catch (err) {
        console.error('Error during parallel run:', err);
        if (err.stdout) console.error('stdout:', err.stdout.toString());
        if (err.stderr) console.error('stderr:', err.stderr.toString());
        process.exit(1);
    }
})();

