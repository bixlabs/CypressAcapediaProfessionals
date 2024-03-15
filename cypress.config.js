const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'c1jrzq',
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'Test Suite',
    embeddedScreenshots: true,
    inlineAssets: true,
  },

  e2e: {
    baseUrl: 'https://develop-professionals.acapedia.com',
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    experimentalStudio: true,
    watchForFileChanges: false,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
