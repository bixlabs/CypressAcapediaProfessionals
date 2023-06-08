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
    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('#boardId').type('123456');
    // TODO: we need a test-id here as we cannot get it by text value
    cy.getByTestId('boardDateOfBirdInput').click();
    cy.contains('2023').click();
    cy.contains('2023').click();
    cy.contains('1952').click();
    cy.contains('May').click();

    cy.get('.fade-transition-enter-active > .v-date-picker-table').as('datePickerTable');
    cy.get('@datePickerTable').contains('20').click();

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get(
      '.v-window-item--active > .mt-5 > :nth-child(1) > :nth-child(1) > :nth-child(2) > .container-actions > :nth-child(1) > .heading',
    )
      .as('Continue')
      .click();

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('.field-background-white > .v-input__control > .v-input__slot > .v-text-field__slot > input').as('phone');
    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('@phone').type(this.credentials.phoneNumber);
    cy.contains('Send SMS').click();

    cy.intercept({
      method: 'POST',
      url: '/api/register',
    }).as('register');

    cy.getByTestId('phoneCode').first().type('429866');
    // TODO: we need a test-id here as we cannot get it by text value
    cy.get(':nth-child(3) > .row > .container-actions > :nth-child(1) > .heading').as('continue');
    cy.get('@continue').click();

    cy.wait('@register').its('response.statusCode').should('equal', 200);

    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('.onboarding-panel').should('exist');
  });
});
