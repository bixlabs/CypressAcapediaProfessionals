import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const PAYMENT_FAILURE_URL = '/payment-failure';

Given('the user has a free plan', () => {
  cy.registerAccount();
});

Given('the user is authenticated', () => {
  cy.fixture('common/credentials.json').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
  });
});

Given('the failure payment page has been navigated to', () => {
  cy.url().should(`eq`, `${Cypress.config().baseUrl}${PAYMENT_FAILURE_URL}`);
});

Given('the user has been navigated to the checkout page', () => {
  cy.url().should('include', '/checkout');
});

Given('the user has clicked on the primary action {string}', (primaryAction) => {
  cy.contains(primaryAction).click();
});

When('the user clicks on the primary action {string}', (primaryAction) => {
  cy.contains(primaryAction).click();
});

When('the user clicks on the secondary action {string}', (secondaryAction) => {
  cy.contains(secondaryAction).click();
});

When('the user tries to navigate to the failure payment page using the url directly', () => {
  cy.visit(PAYMENT_FAILURE_URL);
});

When('the user fills a valid payment method', () => {
  // TODO: I didn't find a way to wait for the iframe to be loaded
  cy.wait(5000);

  cy.fillPaymentForm();
});

When('the user confirms the payment', () => {
  cy.contains('Confirm payment').click();
});

Then('the failure payment page should be shown', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}${PAYMENT_FAILURE_URL}`);
});

Then('the page should show a failure animation', () => {
  cy.wait('@failureAnimation').its('response.statusCode').should('be.oneOf', [200, 304]);
  cy.getByTestId('lottie-animation').should('be.visible');
});

Then('the page should show the title {string}', (title) => {
  cy.contains(title).should('have.class', 'text-grey-darken-1');
});

Then('the page should show the success title {string}', (title) => {
  cy.contains(title).should('have.class', 'text-success');
});

Then('the page should show the description {string}', (description) => {
  cy.contains(description).should('be.visible');
});

Then('the page should show the primary action {string}', (callToAction) => {
  const primaryClass = 'aca-button--variant-primary';

  cy.contains(callToAction).should('have.class', primaryClass);
});

Then('the page should show the secondary action {string}', (secondaryAction) => {
  const secondaryClass = 'aca-button--variant-secondary';

  cy.contains(secondaryAction).should('have.class', secondaryClass);
});

Then('the user should be navigated to the checkout page', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/checkout`);
});

Then('the user should be navigated to the feed page', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/`);
});

Then('the {string} plan should be still selected', (planName) => {
  cy.get('.selected-card').contains(planName);
});

Then('the previously used payment method should be cleared', () => {
  // TODO: I didn't find a way to wait for the iframe to be loaded
  cy.wait(8000);

  cy.getWithinIframe('[name="number"]').should('have.value', '');
  cy.getWithinIframe('[name="expiry"]').should('have.value', '');
  cy.getWithinIframe('[name="cvc"]').should('have.value', '');
});

Then('the user should be navigated to the billing page', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/billing`);
});
