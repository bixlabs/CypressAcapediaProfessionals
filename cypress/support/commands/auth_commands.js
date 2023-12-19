import { faker } from '@faker-js/faker';

Cypress.Commands.add(
  'registerAccount',
  (
    {
      email = faker.internet.email(),
      password = 'Ab1234567-',
      firstName = faker.name.firstName(),
      lastName = faker.name.lastName(),
      phoneNumber = faker.phone.number('6#########'),
    } = {},
    { hasToVisitUrl = true } = {},
  ) => {
    if (hasToVisitUrl) {
      cy.visit('/register');
    }

    cy.getByTestId('email').type(email);
    cy.getByTestId('password').type(password);
    cy.contains('Sign up').click();

    cy.get('[name=firstName]').type(firstName);
    cy.get('[name=lastName]').type(lastName);
    cy.get('[name=degree]').parent().click();
    cy.contains('M.D').click();
    cy.contains('Continue').click();

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get(
      '.text-left > .v-text-field--single-line > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections',
    )
      .as('selectMedicalBoard')
      .click();
    cy.contains('American Board of Anesthesia').click();
    cy.get('#boardId').type('123456');
    cy.getByTestId('boardDateOfBirdInput').click();
    cy.contains('1991').click();
    cy.contains('May').click();
    cy.contains('10').click();

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get(
      '.v-window-item--active > .mt-5 > :nth-child(1) > :nth-child(1) > :nth-child(2) > .container-actions > :nth-child(1) > .heading',
    )
      .as('Continue')
      .click();

    cy.intercept({
      method: 'POST',
      url: '/api/register',
    }).as('register');

    cy.wait('@register').its('response.statusCode').should('equal', 200);

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('.onboarding-panel').should('exist');
    cy.contains('Go to feed').click();
    cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');
  },
);

Cypress.Commands.add('loginAccount', () => {
  cy.visit('/login');
  cy.getByTestId('email').type('fresh-e2e-user@example.com');
  cy.getByTestId('password').type('ew6nnwRc!s');

  cy.intercept({
    method: 'POST',
    url: '/api/login',
  }).as('login');

  cy.contains('Log in').click();

  cy.wait('@login').its('response.statusCode').should('equal', 200);

  // TODO: we need a test-id here as we cannot get it by text value
  cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');
});
