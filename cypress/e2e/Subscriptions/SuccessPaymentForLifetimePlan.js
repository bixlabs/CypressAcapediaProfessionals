import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

const PAYMENT_SUCCESS_URL = '/subscription/lifetime/payment-success';

Before(() => {
  cy.intercept('GET', '/lottie-animations/payment-success-lifetime.json').as('lifetimeAnimation');
});

Given('the user has a free plan', () => {
  cy.registerAccount();
});

Given('the lifetime plan has been successfully purchased', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Upgrade to Lifetime').click();

  cy.get('#chn').type('John Doe');
  cy.get('#card-holder-address').type('123 Main St');
  cy.get('#card-holder-city').type('New York');
  cy.get('#card-holder-state').type('NY');
  cy.get('#card-holder-postalcode').type('10001');
  cy.getWithinIframe('[name="number"]').type('4242424242424242');
  cy.getWithinIframe('[name="expiry"]').type('1235');
  cy.getWithinIframe('[name="cvc"]').type('244');

  cy.contains('Confirm payment').click();
});

Given('the success payment page has been navigated to', () => {
  cy.url().should('include', '/payment-success');
});

When('the user successfully purchases the Lifetime plan', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Upgrade to Lifetime').click();

  cy.get('#chn').type('John Doe');
  cy.get('#card-holder-address').type('123 Main St');
  cy.get('#card-holder-city').type('New York');
  cy.get('#card-holder-state').type('NY');
  cy.get('#card-holder-postalcode').type('10001');
  cy.getWithinIframe('[name="number"]').type('4242424242424242');
  cy.getWithinIframe('[name="expiry"]').type('1235');
  cy.getWithinIframe('[name="cvc"]').type('244');

  cy.contains('Confirm payment').click();
});

When('the user clicks on the primary action {string}', (primaryAction) => {
  cy.contains(primaryAction).click();
});

When('the user clicks on the secondary action {string}', (secondaryAction) => {
  cy.contains(secondaryAction).click();
});

When('the user tries to navigate to the success payment page using the url directly', () => {
  cy.visit(PAYMENT_SUCCESS_URL);
});

Then('the success payment page for the lifetime plan should be shown', () => {
  cy.url().should(`eq`, `${Cypress.config().baseUrl}${PAYMENT_SUCCESS_URL}`);
});

Then('the page should show an animation for the lifetime plan', () => {
  cy.wait('@lifetimeAnimation').its('response.statusCode').should('be.oneOf', [200, 304]);
  cy.getByTestId('lottie-animation').should('be.visible');
});

Then('the page should show the title {string}', (title) => {
  cy.contains(title).should('have.class', 'success--text');
});

Then('the page should show the description {string}', (description) => {
  cy.contains(description).should('be.visible');
});

Then('the page should show the primary action {string}', (callToAction) => {
  const primaryClass = 'primary';

  cy.contains(callToAction).should('have.attr', 'href', '/').should('have.class', primaryClass);
});

Then('the page should show the secondary action {string}', (secondaryAction) => {
  const secondaryClass = 'grey';

  cy.contains(secondaryAction).should('have.attr', 'href', '/billing').should('have.class', secondaryClass);
});

Then('the user should be navigated to the feed page', () => {
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

Then('the user should be navigated to the billing page', () => {
  cy.url().should('eq', Cypress.config().baseUrl + '/billing');
});
