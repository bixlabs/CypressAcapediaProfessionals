// https://app.clickup.com/t/865cwxz4q

describe('Regression Bug: Pre-test "End" screen without having done the pre-test yet', () => {
  before(() => {
    cy.fixture('/auth/credentialsLogin').as('credentials');
    cy.loginAccount('@credentials');
  });

  it('should not show the "End" screen after completing a pre-test and starting a new one', () => {
    // Intercept the request to always show the pretest
    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/pretest/show',
      },
      {
        showPretest: true,
      },
    ).as('showPretest');

    const articlesWithPretest = ['Production of single cell protein from manure', 'Effectiveness of COVID-19'];

    cy.get('[name="search"]').type(`${articlesWithPretest[0]}{enter}`);
    cy.contains('Get CME').click();
    cy.contains('Next').click();
    cy.contains('Start pre-test').click();

    const firstOptionSelector = '.v-input--radio-group__input > :nth-child(1)';
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.contains('Read article and take quiz').click();
    cy.contains('Back to Feed').click();
    cy.get('[name="search"]').type(`${articlesWithPretest[1]}{enter}`);
    cy.contains('Get CME').click();
    cy.get('.align-center > .heading').should('have.text', ' What is a pre-test? ');
  });
});
