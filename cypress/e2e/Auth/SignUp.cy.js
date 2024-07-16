import { faker } from '@faker-js/faker';

const presets = ['iphone-x', 'macbook-13'];

describe('SignUp E2E Test', () => {
  beforeEach(function () {
    cy.visit('/register');

    cy.fixture('auth/credentialsSignup').as('credentials');
  });

  presets.forEach((preset) => {
    it(`SignUp in device ${preset}`, function () {
      cy.intercept({
        method: 'POST',
        url: '/api/register',
      }).as('register');

      cy.viewport(preset);

      const email = faker.internet.email();
      const password = `Abc12345-`;
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      cy.getByTestId('email').type(email);
      cy.getByTestId('password').type(password);

      cy.contains('Sign up').click();
      cy.get('[name=firstName]').type(firstName);
      cy.get('[name=lastName]').type(lastName);
      cy.get('[name=degree]').parent().click();
      cy.contains('M.D').click();

      cy.contains('Continue').click();

      cy.get('#medical-board').click();
      cy.contains('American Board of Anesthesia').click();
      cy.getByTestId('boardDateOfBirdInput').click();
      cy.contains('1991').click();
      cy.contains('May').click();
      cy.contains('10').click();

      // TODO: we need a test-id here as we cannot get it by text value
      cy.contains('Continue').click({ force: true });

      cy.wait('@register').its('response.statusCode').should('equal', 200);

      // TODO: we need a test-id here as we cannot get it by text value
      cy.get('.onboarding-panel').should('exist');
      cy.contains('Go to feed').click();
      cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');
    });
  });
});
