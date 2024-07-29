import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

const PAYMENT_FAILURE_URL = '/payment-failure';

Before(() => {
  cy.intercept('GET', '/lottie-animations/payment-failure.json').as('failureAnimation');
});

const billingFormData = {
  chn: 'John Doe',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
};

Given('the pro plan has been failed to purchase', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Upgrade to Pro').click();

  cy.fillBillingForm(billingFormData);
  cy.fillPaymentFormWithInvalidCard();

  cy.contains('Confirm payment').click();
});

When('the user fails to purchase the Pro plan', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Upgrade to Pro').click();

  cy.fillBillingForm(billingFormData);
  cy.fillPaymentFormWithInvalidCard();

  cy.contains('Confirm payment').click();
});

When('the user tries to navigate to the success payment page using the url directly', () => {
  cy.visit(PAYMENT_FAILURE_URL);
});

Then('the billing information should be still filled', () => {
  cy.get('#chn').should('have.value', billingFormData.chn);
  cy.get('#card-holder-address').should('have.value', billingFormData.address);
  cy.get('#card-holder-city').should('have.value', billingFormData.city);
  cy.get('#card-holder-state').should('have.value', billingFormData.state);
  cy.get('#card-holder-postalcode').should('have.value', billingFormData.postalCode);
});

Then('the user should be navigated to the success page for the pro plan', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/plan/pro/payment-success`);
});
