import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

const PAYMENT_SUCCESS_URL = '/plan/pro/payment-success';

Before(() => {
  cy.intercept('GET', '/lottie-animations/payment-success-pro.json').as('proAnimation');
});

Given('the pro plan has been successfully purchased', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Upgrade to Pro').click();

  cy.fillValidCheckoutForm();

  cy.contains('Confirm payment').click();
});

Given('the success payment page has been navigated to', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}${PAYMENT_SUCCESS_URL}`);
});

When('the user successfully purchases the Pro plan', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Upgrade to Pro').click();

  cy.fillValidCheckoutForm();

  cy.contains('Confirm payment').click();
});

When('the user tries to navigate to the success payment page using the url directly', () => {
  cy.visit(PAYMENT_SUCCESS_URL);
});

Then('the success payment page for the Pro plan should be shown', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}${PAYMENT_SUCCESS_URL}`);
});

Then('the page should show an animation for the Pro plan', () => {
  cy.wait('@proAnimation').its('response.statusCode').should('be.oneOf', [200, 304]);
  cy.getByTestId('lottie-animation').should('be.visible');
});
