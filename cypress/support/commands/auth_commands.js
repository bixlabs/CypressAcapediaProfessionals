Cypress.Commands.add(
  'registerAccount',
  ({
    email = 'lguedes+600@bixlabs.com',
    password = 'Ab1234567-',
    firstName = 'Leonardo',
    lastName = 'Guedes',
    phoneNumber = '5612023378',
  } = {}) => {
    cy.visit('/register');
    cy.getByTestId('email').type(email);
    cy.getByTestId('password').type(password);

    cy.contains('Sign up').click();

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('[name=firstName]').type(firstName);
    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('[name=lastName]').type(lastName);
    cy.contains('Continue').click();

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('#input-66').as('phone');
    cy.get('@phone').type(phoneNumber);
    cy.contains('Send SMS').click();

    cy.intercept({
      method: 'POST',
      url: '/api/register',
    }).as('register');

    cy.getByTestId('phoneCode').first().type('375736');
    // TODO: we need a test-id here as we cannot get it by text value
    cy.get(':nth-child(1) > .actions > :nth-child(1) > .heading').as('continue');
    cy.get('@continue').click();

    cy.wait('@register').its('response.statusCode').should('equal', 200);

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('.onboarding-panel').should('exist');
  },
);

Cypress.Commands.add('loginAccount', () => {
  cy.visit('/login');
  cy.getByTestId('email').type('lguedes+031@bixlabs.com');
  cy.getByTestId('password').type('Ab1234567-');

  cy.intercept({
    method: 'POST',
    url: '/api/login',
  }).as('login');

  cy.contains('Log in').click();

  cy.wait('@login').its('response.statusCode').should('equal', 200);

  // TODO: we need a test-id here as we cannot get it by text value
  cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');
});
