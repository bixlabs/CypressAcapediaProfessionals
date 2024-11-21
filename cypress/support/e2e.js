// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import '@chromatic-com/cypress/support';
import '@percy/cypress';

import registerCypressGrep from '@cypress/grep/src/support';

// Import commands.js using ES2015 syntax:
import './commands/commands';
import './commands/auth_commands';
import 'cypress-file-upload';
import 'cypress-mochawesome-reporter/register';

registerCypressGrep();

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false have prevents Cypress from
  // failing the test
  return false;
});

require('cypress-xpath');

// Alternatively you can use CommonJS syntax:
// require('./commands')
