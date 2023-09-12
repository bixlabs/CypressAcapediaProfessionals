// In case you want to slow down a particular test, you can use the following snippet at the top:
// import { slowCypressDown } from 'cypress-slow-down';
// slowCypressDown();

Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, selector) => {
  Cypress.log({
    name: 'iframe',
    consoloreProps() {
      return {
        iframe: $iframe,
      };
    },
  });
  return new Cypress.Promise((resolve) => {
    resolve($iframe.contents().find(selector));
  });
});

Cypress.Commands.add('getByTestId', (testId, ...args) => {
  return cy.get(`[data-test-id=${testId}]`, { timeout: 15000, ...args });
});

Cypress.Commands.add('cleanUpDB', () => {
  cy.request('POST', '/api/testing/db/clean-up', { timeout: 15000 });
});

Cypress.Commands.add('seedDB', () => {
  cy.request('POST', '/api/testing/db/seed', { timeout: 15000 });
});
