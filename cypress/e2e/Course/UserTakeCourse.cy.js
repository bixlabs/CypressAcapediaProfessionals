describe('UserTakeCourse', () => {
  before(() => {
    cy.fixture('/auth/credentialsLogin').as('credentials');
    cy.loginAccount('@credentials');
  });

  it('Can start a Course', () => {
    cy.visit('/premium-courses');
    cy.contains('Go to course').click();
    //cy.contains('Agree and start').click();
    cy.contains('Start course').click();
    cy.contains('Completed modules');
  });

  it('Can take a pre-test', () => {
    cy.contains('Take pre-test').click();
    cy.contains('Next').click();
    cy.contains('Start pre-test').click();
    cy.contains('Select the best answer').should('exist');

    cy.get('.completion-ratio-display').then(($value) => {
      const numberOfQuestionsText = $value.text();
      console.log(numberOfQuestionsText, 'numberOfQuestionsText');
      const numberOfQuestions = numberOfQuestionsText.split('/')[1];

      for (let i = 0; i < numberOfQuestions; i++) {
        cy.contains('[role=radiogroup] .v-radio').click();
      }

      cy.contains('Go to course').click();

      cy.contains('DONE');
      cy.log(creditBalance);
    });
  });

  it('Can take a course module', () => {
    cy.contains('Open Content').click();
    cy.get();

    while (
      Array.from(document.querySelectorAll('button')).find(
        (el) => el.textContent === 'NEXT' && el.disabled === false,
      ) !== undefined
    ) {
      cy.contains('NEXT').click();
    }

    cy.contains('Back to Overview').click();

    cy.contains('Open Content');
  });
});
