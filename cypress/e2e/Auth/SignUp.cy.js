describe('SignUp E2E Test', () => {
  before(function () {
    cy.visit('/register');

    cy.fixture('auth/credentialsSignup').as('credentials');
  });

  it('SignUp', function () {
    cy.getByTestId('email').type(this.credentials.email);
    cy.getByTestId('password').type(this.credentials.password);

    cy.contains('Sign up').click();
    cy.get('[name=firstName]').type(this.credentials.firstName);
    cy.get('[name=lastName]').type(this.credentials.lastName);
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
  });
});
