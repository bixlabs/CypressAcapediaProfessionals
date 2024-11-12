// https://app.clickup.com/t/9011059859/ACA-1682?comment=90110094091304

describe(
  'Regression Bug: Backdrop behavior after completing SR evaluation',
  { tags: ['@special-requirements', '@evaluation', '@regression', '@business:high-impact', '@low-likely'] },
  () => {
    it('should not display the backdrop after completing a SR CME evaluation', () => {
      cy.intercept('GET', '/api/user/evaluation/show', {
        showEvaluation: true,
      });

      cy.loginAccount({
        email: 'acabrera+g976@bixlabs.com',
        password: 'Abc12345-',
      });

      cy.visit(
        '/special-requirements/topics/controlled-substances/states/alaska/cme-experiences/articles/ebv-hhv6-subtypes-hiv-burkinafaso/quiz/277',
      );

      cy.contains('Start CME evaluation').click();

      // Question 1
      cy.contains('Next').click();

      // Question 2
      cy.getByTestId('answerOption-0').click();
      cy.contains('Next').click();

      // Question 3
      cy.getByTestId('answerOption-0').click();
      cy.contains('Next').click();

      // Question 4
      cy.getByTestId('answerOption-0').click();
      cy.contains('Next').click();

      // Question 5
      cy.getByTestId('answerOption-1').click();
      cy.contains('Finish evaluation').click();

      cy.contains('Go to topic').click();

      cy.getByTestId('veil').should('have.css', 'display', 'none');
    });
  },
);
