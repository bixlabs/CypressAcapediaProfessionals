describe('GuestTakeQuiz', () => {
  it('should add the ability to take the quiz as a guest user', () => {
    cy.visit('/');
    cy.contains('Get CME').click();
    cy.contains('Agree and start').click();
    cy.contains('Take quiz').click();

    const firstOptionSelector = '.v-input--radio-group__input > :nth-child(1)';
    for (let i = 0; i < 4; i++) {
      cy.get(firstOptionSelector).click();
      cy.contains('Next question').click();
    }

    // the last question does not have a "Next question" button
    cy.get(firstOptionSelector).click();

    cy.get('.result-actions-container > :nth-child(1) > .heading').should('have.text', ' Sign up to claim credit ');
  });
});
