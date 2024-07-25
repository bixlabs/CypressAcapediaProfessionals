import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

const PAYMENT_FAILURE_URL = '/subscription/payment-failure';

Before(() => {
  cy.intercept('GET', '/lottie-animations/payment-failure.json').as('failureAnimation');
});

Given('the user has a free plan', () => {
  cy.registerAccount();
});

Given('the pro plan has been failed to purchase', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Upgrade to Pro').click();

  cy.get('#chn').type('John Doe');
  cy.get('#card-holder-address').type('123 Main St');
  cy.get('#card-holder-city').type('New York');
  cy.get('#card-holder-state').type('NY');
  cy.get('#card-holder-postalcode').type('10001');
  cy.getWithinIframe('[name="number"]').type('4000000000000002'); // invalid number
  cy.getWithinIframe('[name="expiry"]').type('1235');
  cy.getWithinIframe('[name="cvc"]').type('244');

  cy.contains('Confirm payment').click();
});

Given('the failure payment page has been navigated to', () => {
  cy.url().should(`eq`, `${Cypress.config().baseUrl}${PAYMENT_FAILURE_URL}`);
});

Given('the user has clicked on the primary action {string}', (primaryAction) => {
  cy.contains(primaryAction).click();
});

Given('the user has been navigated to the checkout page', () => {
  cy.url().should('include', '/checkout');
});

When('the user fails to purchase the Pro plan', () => {
  // TODO: REUSE as a command ?
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Upgrade to Pro').click();

  cy.get('#chn').type('John Doe');
  cy.get('#card-holder-address').type('123 Main St');
  cy.get('#card-holder-city').type('New York');
  cy.get('#card-holder-state').type('NY');
  cy.get('#card-holder-postalcode').type('10001');

  cy.getWithinIframe('[name="number"]').type('4000000000000002');
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
  cy.visit(PAYMENT_FAILURE_URL);
});

When('the user tries to navigate to the failure payment page using the url directly', () => {
  cy.visit(PAYMENT_FAILURE_URL);
});

When('the user successfully purchases the Pro plan filling with a valid payment method', () => {
  // NOW: fix this
  cy.wait(5000);

  cy.getWithinIframe('[name="number"]').type('4242424242424242');
  cy.getWithinIframe('[name="expiry"]').type('1235');
  cy.getWithinIframe('[name="cvc"]').type('244');

  cy.contains('Confirm payment').click();
});

Then('the failure payment page for the pro plan should be shown', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}${PAYMENT_FAILURE_URL}`);
});

Then('the page should show a failure animation', () => {
  cy.wait('@failureAnimation').its('response.statusCode').should('be.oneOf', [200, 304]);
  cy.getByTestId('lottie-animation').should('be.visible');
});

Then('the page should show the title {string}', (title) => {
  cy.contains(title).should('have.class', 'grey--text');
});

Then('the page should show the description {string}', (description) => {
  cy.contains(description).should('be.visible');
});

Then('the page should show the primary action {string}', (callToAction) => {
  const primaryClass = 'primary';

  cy.contains(callToAction).should('have.attr', 'href', '/checkout').should('have.class', primaryClass);
});

Then('the page should show the secondary action {string}', (secondaryAction) => {
  const secondaryClass = 'grey';

  cy.contains(secondaryAction).should('have.attr', 'href', '/').should('have.class', secondaryClass);
});

Then('the user should be navigated to the checkout page', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/checkout`);
});

Then('the user should be navigated to the feed page', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/`);
});

Then('the Pro plan should be still selected', () => {
  // cy.get('.selected-card').should('have.text', 'Pro');
  // contain the text "Pro" in the selected card
  cy.get('.selected-card').contains('Pro');
});

Then('the billing information should be still filled', () => {
  // NOW: reuse from filing commands
  cy.get('#chn').should('have.value', 'John Doe');
  cy.get('#card-holder-address').should('have.value', '123 Main St');
  cy.get('#card-holder-city').should('have.value', 'New York');
  cy.get('#card-holder-state').should('have.value', 'NY');
  cy.get('#card-holder-postalcode').should('have.value', '10001');
});

Then('the previously used payment method should be cleared', () => {
  // NOW: IMPROVE THIS
  cy.wait(8000);

  cy.getWithinIframe('[name="number"]').should('have.value', '');
  cy.getWithinIframe('[name="expiry"]').should('have.value', '');
  cy.getWithinIframe('[name="cvc"]').should('have.value', '');
});

Then('the user should be navigated to the billing page', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/billing`);
});

Then('the user should be navigated to the success page for the pro plan', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/subscription/pro/payment-success`);
});
