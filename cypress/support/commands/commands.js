// In case you want to slow down a particular test, you can use the following snippet at the top:
// import { slowCypressDown } from 'cypress-slow-down';
// slowCypressDown();

// import { getFeatureFlagProvider } from '../../featureFlagProvider';

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

// Iframe commands taken from
// https://www.mikefettes.com/blog/cypress-and-stripe-payments-testing
Cypress.Commands.add('iframeLoaded', { prevSubject: 'element' }, ($iframe) => {
  const contentWindow = $iframe.prop('contentWindow');
  return new Promise((resolve) => {
    if (contentWindow && contentWindow.document.readyState === 'complete') {
      resolve(contentWindow);
    } else {
      $iframe.on('load', () => {
        resolve(contentWindow);
      });
    }
  });
});

Cypress.Commands.add('getInDocument', { prevSubject: 'document' }, (document, selector) =>
  Cypress.$(selector, document),
);

Cypress.Commands.add('getWithinIframe', (targetElement) => {
  return cy.get('iframe').iframeLoaded().its('document').getInDocument(targetElement);
});

// Cypress.Commands.add('isFeatureFlagEnabled', (featureFlag) => {
//   return cy.wrap(getFeatureFlagProvider().isFeatureEnabled(featureFlag));
// });
