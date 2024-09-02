// In case you want to slow down a particular test, you can use the following snippet at the top:
// import { slowCypressDown } from 'cypress-slow-down';
// slowCypressDown();

import { getFeatureFlagProvider } from '../../featureFlagProvider';

const exactText = (_chai) => {
  _chai.Assertion.addMethod('exactText', function (expectedText) {
    const actualText = this._obj.trim();

    this.assert(
      actualText === expectedText,
      'expected #{this} to have exact text #{exp} but got #{act}',
      'expected #{this} not to have exact text #{act}',
      expectedText,
      actualText,
    );
  });
};

chai.use(exactText);

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
  return cy.get(`[data-testid=${testId}]`, { timeout: 5000, ...args });
});

Cypress.Commands.add('cleanUpDB', () => {
  cy.request('POST', '/api/testing/db/clean-up', { timeout: 15000 });
});

Cypress.Commands.add('seedDB', () => {
  cy.request('POST', '/api/testing/db/seed', { timeout: 15000 });
});

Cypress.Commands.add('deleteTestingReferrals', () => {
  const backendUrl = `${Cypress.env('API_BASE_URL')}/testing/db/delete-referral-test-users`;

  cy.request({
    method: 'POST',
    url: backendUrl,
    timeout: 15000,
  });
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

Cypress.Commands.add('isFeatureFlagEnabled', (featureFlag) => {
  return cy.wrap(getFeatureFlagProvider().isFeatureEnabled(featureFlag));
});

Cypress.Commands.add('getSidebarMenuByText', (menuText) => {
  return cy.getByTestId('sidebar').contains(menuText);
});

Cypress.Commands.add(
  'fillBillingForm',
  (
    billingForm = {
      chn: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
    },
  ) => {
    cy.get('#chn').type(billingForm.chn);
    cy.get('#card-holder-address').type(billingForm.address);
    cy.get('#card-holder-city').type(billingForm.city);
    cy.get('#card-holder-state').type(billingForm.state);
    cy.get('#card-holder-postalcode').type(billingForm.postalCode);
  },
);

Cypress.Commands.add('fillPaymentForm', () => {
  cy.getWithinIframe('[name="number"]').type('4242424242424242');
  cy.getWithinIframe('[name="expiry"]').type('1235');
  cy.getWithinIframe('[name="cvc"]').type('244');
});

Cypress.Commands.add('fillPaymentFormWithInvalidCard', () => {
  const invalidCardNumber = '4000000000000002';

  cy.getWithinIframe('[name="number"]').type(invalidCardNumber);
  cy.getWithinIframe('[name="expiry"]').type('1235');
  cy.getWithinIframe('[name="cvc"]').type('244');
});

Cypress.Commands.add('fillValidCheckoutForm', () => {
  cy.fillBillingForm();
  cy.fillPaymentForm();
});
