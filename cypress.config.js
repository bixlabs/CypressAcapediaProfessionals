const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
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
    baseUrl: 'http://localhost:8081',
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    async setupNodeEvents(on, config) {
      require('@cypress/grep/src/plugin')(config);
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
          }

          return null;
        },
      });

      on('task', {
        deleteAllFilesInFolder(folderPath) {
          const dirPath = path.resolve(__dirname, folderPath);

          if (!fs.existsSync(dirPath)) return null;

          const files = fs.readdirSync(dirPath);

          files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });

          return null;
        },
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
  video: true,
  viewportWidth: 1440,
  viewportHeight: 900,
});
