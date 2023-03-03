describe('TakeQuiz', () => {
  let testPassed = true; // flag variable to track pass/fail status
  before(() => {
    cy.fixture('/auth/credentialsLogin')
      .as('credentials')
      .then(cy.loginAccount)
  })

  it('Can take a quiz', function () {
    cy.get('.feed-0 > :nth-child(2) > .card-shadow > .v-card__actions > .primary--text').as('getCME')
    cy.get('@getCME').click({ force: true })
    cy.contains('Agree and start').click()
    cy.contains('Take quiz').click()

    let incorrectCount = 0; // counter for incorrect answers

    cy.get('body').then(($body) => {
      // synchronously ask for the body's text
      // and do something based on whether it includes
      // another string
      if ($body.text().includes('See results')) {
        // Quiz completed
      } else {
        // Quiz not completed
        cy.getByTestId('questionChipList').each(($el, index, $list) => {
          cy.wrap($el).then(() => {
            cy.get('body').then((body) => {
              if (body.find(`[data-test-id=answerOption]`).length > 0) {
                cy.getByTestId('answerOption').its('length').then((optionsLength) => {
                  cy.getByTestId('answerOption').eq(Math.floor(Math.random() * optionsLength)).click({force: true})
    
                  if (incorrectCount === 2) {
                    cy.log(incorrectCount)
                    cy.log('Two incorrect answers given. Stopping the test.')
                    testPassed = true; // set flag to false if test fails
                  } else {
                    cy.log(incorrectCount)
                    cy.contains('Confirm answer').click();
                    cy.wait(1000);

                    // check if answer is incorrect
                    cy.get('.col-sm-8 > div > .heading').then(($heading) => {
                      const text = $heading.text();
                      if (text.includes('incorrect')) {
                        incorrectCount++;
                        cy.log(incorrectCount)
                      }
                    });

                    // handle Finish Quiz button or Next question button
                    try {
                      cy.contains('Next question').should('be.visible').click();
                    } catch (error) {
                      cy.contains('Finish Quiz').click();
                    }
                  }
                })
              }
            })
          })
        })
      }
    })
  })
})