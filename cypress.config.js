const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    baseUrl: 'https://sso.linagora.com',
    specPattern: 'cypress/tests/**/*.{js,jsx,ts,tsx}',
  },
  viewportWidth: 1600,
  viewportHeight: 900,
  screenshotOnRunFailure: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: "cypress/results",
    overwrite: false,
    html: false,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true
  },
  screenshotsFolder: "cypress/results/screenshots",
  projectId: 'test',
  pageLoadTimeout: 120000,
})
