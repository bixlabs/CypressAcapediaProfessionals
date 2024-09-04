// The bug was found while doing QA to this ticket https://app.clickup.com/t/8687y5u5t

describe(
  'Regression Bug: Pre-test results page not redirecting to the article pdf page',
  { tags: ['@article-quiz', '@pretest', '@regression', '@business:high-impact', '@low-likely'] },
  () => {
    beforeEach(() => {
      cy.registerAccount();
    });

    it('should redirect to the article pdf when the user finishes the pretest', () => {
      cy.intercept(
        {
          method: 'GET',
          url: '/api/user/pretest/show',
        },
        {
          showPretest: true,
        },
      ).as('showPretest');

      cy.visit(`/article/tumor-immune-contexture-car-t-cell-efficacy-lbcl`);
      cy.contains('Get CME').click();

      cy.url().should('include', '/pretest/onboarding');

      cy.contains('Next').click();
      cy.contains('Start pre-test').click();

      cy.url().should('not.include', '/pretest/onboarding');

      // Selecting the pretest options
      cy.get(':nth-child(1) > .v-label').click();
      cy.get('.v-item--active').click();
      cy.get('.v-item--active').click();

      // Now that the pretest is finished, we delete the mock so the pretest is not shown again
      cy.intercept('GET', '/api/user/pretest/show', (req) => {
        req.continue();
      });

      cy.url().should('include', '/pretest/results');
      cy.contains('Read article and take quiz').click();

      cy.url().should('include', '/article/242/pdf');
    });
  },
);
