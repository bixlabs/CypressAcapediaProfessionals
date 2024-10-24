import { faker } from '@faker-js/faker';

Cypress.Commands.add(
  'registerAccount',
  (
    {
      email = faker.internet.email(),
      password = 'Ab1234567-',
      firstName = faker.name.firstName(),
      lastName = faker.name.lastName(),
    } = {},
    { hasToVisitUrl = true, hasToCompleteOnboarding = true } = {},
  ) => {
    cy.intercept({
      method: 'POST',
      url: '/api/register',
    }).as('register');

    if (hasToVisitUrl) {
      cy.visit('/register');
    }

    cy.getByTestId('email').type(email);
    cy.getByTestId('password').type(password);
    cy.contains('Sign up').click();

    cy.getByTestId('firstName').type(firstName);
    cy.getByTestId('lastName').type(lastName);
    cy.get('[name=degree]').parent().click();
    cy.contains('M.D').click();
    cy.contains('Continue').click();

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('#medical-board').parent().click();
    cy.contains('American Board of Anesthesia').click();
    cy.get('#boardId').type('123456');
    cy.getByTestId('boardDateOfBirdInput').click();
    cy.selectDate({ year: '1991', month: 'Oct', day: '10' });

    // TODO: we need a test-id here as we cannot get it by text value
    cy.contains('Continue').click({ force: true });

    cy.wait('@register').its('response.statusCode').should('equal', 200);

    if (hasToCompleteOnboarding) {
      // TODO: we need a test-id here as we cannot get it by text value
      cy.get('.onboarding-panel').should('exist');
      cy.contains('Go to feed').click();
      cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');
    }
  },
);

Cypress.Commands.add(
  'loginAccount',
  (
    { email, password } = {},
    { hasToVisitUrl = true, hasToReuseSession = true, hasToAssertLoginResult = true } = {},
  ) => {
    function login() {
      if (hasToVisitUrl) {
        cy.visit('/login');
      }

      cy.getByTestId('email').type(email);
      cy.getByTestId('password').type(password);

      cy.intercept({
        method: 'POST',
        url: '/api/login',
      }).as('login');

      cy.contains('Log in').click();

      cy.wait('@login').its('response.statusCode').should('equal', 200);

      if (hasToAssertLoginResult) {
        // TODO: we need a test-id here as we cannot get it by text value
        cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');
      }
    }

    hasToReuseSession
      ? cy.session(email, () => {
          login();
        })
      : login();
  },
);
