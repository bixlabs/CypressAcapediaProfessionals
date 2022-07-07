describe('TakeQuiz', () => {
  before(() => {
    cy.fixture('/auth/credentials')
      .as('credentials')
      .then(cy.loginAccount)
  });

  it('Can take a quiz', function() {
      cy.get('[aria-selected="false"]').click()
      cy.get(':nth-child(1) > .v-card__actions > .primary--text > .v-btn__content').as('getCME')
      cy.get('@getCME').click({ force: true })
  
      cy.getByTestId('questionChipList').each( ($el, index, $list) => {
  
        cy.wrap($el).click({ force: true }).then( () => {

          cy.intercept({
            method: 'POST',
            url: '/api/article/quiz/question/answer',
          }).as('answer')
        
          cy.getByTestId('answerOption').its('length').then( (optionsLength) => {
          cy.getByTestId('answerOption').eq(Math.floor(Math.random()*optionsLength)).click({ force: true })
          })
  
          cy.wait('@answer')
            .its('response.statusCode')
            .should('equal', 200)
            .then( () => {
              cy.getByTestId('feedbackAnswer').then( $element => {
                let feedback = $element.text().trim()
                if (feedback === "It's correct") {
                  cy.getByTestId('quizPanel').click('topLeft', {force: true})
                } else {
                  cy.getByTestId('nextQuestion').click()
                }
              })
            })
          
        })
      })
  
  })
})
 
