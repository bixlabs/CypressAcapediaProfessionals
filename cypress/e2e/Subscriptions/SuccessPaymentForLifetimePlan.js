import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

const PAYMENT_SUCCESS_URL = '/subscription/lifetime/payment-success';

Before(() => {
  cy.intercept('GET', '/lottie-animations/payment-success-lifetime.json').as('lifetimeAnimation');
});

Given('the lifetime plan has been successfully purchased', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Upgrade to Lifetime').click();

  cy.fillValidCheckoutForm();

  cy.contains('Confirm payment').click();
});

Given('the success payment page has been navigated to', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}${PAYMENT_SUCCESS_URL}`);
});

When('the user successfully purchases the Lifetime plan', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Upgrade to Lifetime').click();

  cy.fillValidCheckoutForm();

  cy.contains('Confirm payment').click();
});

When('the user tries to navigate to the success payment page using the url directly', () => {
  cy.visit(PAYMENT_SUCCESS_URL);
});

Then('the success payment page for the Lifetime plan should be shown', () => {
  cy.url().should(`eq`, `${Cypress.config().baseUrl}${PAYMENT_SUCCESS_URL}`);
});

Then('the page should show an animation for the Lifetime plan', () => {
  cy.wait('@lifetimeAnimation').its('response.statusCode').should('be.oneOf', [200, 304]);
  cy.getByTestId('lottie-animation').should('be.visible');
});
