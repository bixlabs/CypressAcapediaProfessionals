describe('TakeQuiz', () => {
  before(function () {
    cy.fixture('/auth/credentialsLogin')
      .as('credentials')
      .then(cy.loginAccount)
  })

  it('Can take a Quiz', () => {
    cy.contains('Get CME').click();
    cy.contains('Agree and start').click();
    cy.contains('Take quiz').click();

    // loop in a recursive way, it is easier to stop the loop
    // when the quiz is completed or failed, because of the async nature of Cypress
    answerQuestion({ questionNumber: 1, totalFailed: 0 });

    function answerQuestion({ questionNumber, totalFailed }) {
      // check that the question number is correct
      // TODO: we need a test-id here as we cannot get it by text value
      cy.get('.question-number').contains(questionNumber).should('be.visible');
    
      // select a choice
      // TODO: we need a test-id here as we cannot get it by text value
      cy.get('.v-input--radio-group__input > :nth-child(1)').click();
    
      // we want to intercept the answer api call to get the backend result
      cy.intercept('POST', '/api/article/quiz/question/answer').as('answerQuestion');
      cy.contains('Confirm answer').click();
      
      let isCorrectAnswer;
      cy.wait('@answerQuestion').then((interception) => {
        cy.log('Answer API response:', interception.response.body.success);
        const isCorrectAnswer = interception.response.body.success === 1;
    
        if (isCorrectAnswer) {
          cy.contains("That's correct").should('be.visible');
        } else {
          cy.contains("That's incorrect").should('be.visible');
        }

        if (questionNumber === 5) {
          cy.contains('Finish quiz').click();
        } else {
          cy.contains('Next question').click();
        }
    
        const newTotalFailed = isCorrectAnswer ? totalFailed : totalFailed + 1;
        const isFailed = newTotalFailed === 2;
        const isCompleted = newTotalFailed < 2 && questionNumber === 5;
    
        if (isFailed) {
          cy.contains('You did not pass').should('be.visible');
        } else if (isCompleted) {
          cy.contains('PASSED!').should('be.visible');
        } else {
          // we continue the loop recursively until the quiz is completed or failed
          // using the new question number, and tracking the new totalFailed count
          answerQuestion({ questionNumber: questionNumber + 1, totalFailed: newTotalFailed });
        }
      });
    }
  });
});
