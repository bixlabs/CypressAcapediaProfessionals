import { faker } from '@faker-js/faker';

describe('Free referred E2E Test', () => {

  before( () => {
    cy.deleteReferrals();
  });

  beforeEach(function () {
    cy.visit('/register');

    cy.fixture('Referrals/credentials').as('credentials');
  });

  it(`SignUp Free referred and make Free referrer`, function () {

    const email = this.credentials.freeReferred.email;
    const password = this.credentials.freeReferred.password;
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

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get(
      '.text-left > .v-text-field--single-line > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections',
    )
      .as('selectMedicalBoard')
      .click();
    cy.contains('American Board of Anesthesia').click();
    cy.getByTestId('boardDateOfBirdInput').click();
    cy.contains('1991').click();
    cy.contains('May').click();
    cy.contains('10').click();

    // TODO: we need a test-id here as we cannot get it by text value
    cy.contains('Continue').click({ force: true });

    cy.intercept({
      method: 'POST',
      url: '/api/register',
    }).as('register');

    cy.wait('@register').its('response.statusCode').should('equal', 200);

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('.onboarding-panel').should('exist');
    cy.contains('Go to feed').click();
    cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');

    // go to the referral page and click make referral button, grab that link and make a referrer
  });

});
