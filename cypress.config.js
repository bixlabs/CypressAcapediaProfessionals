const { defineConfig } = require('cypress');
const fs = require('fs');
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';

module.exports = defineConfig({
  projectId: 'c1jrzq',
  reporter: 'cypress-mochawesome-reporter',
  chromeWebSecurity: false,
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
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      );

      on('task', {
        deleteFile(filePath) {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return null;
          } else {
            throw new Error('File does not exist');
          }
        }
      });

      return config;
    },
    specPattern: 'cypress/e2e/**/*{cy.js,feature}',
    experimentalStudio: true,
    watchForFileChanges: false,
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
