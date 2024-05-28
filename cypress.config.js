const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1600,
  viewportHeight: 900,
  screenshotOnRunFailure: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: true,
    html: true,
    json: false,
    embeddedScreenshots: true,
    inlineAssets: true
  },
  screenshotsFolder: "cypress/screenshots",
  projectId: 'test',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
