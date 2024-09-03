// https://app.clickup.com/t/865cwxz4q

describe(
  'Regression Bug: Pre-test "End" screen without having done the pre-test yet',
  { tags: ['@article-quiz', '@pretest', '@regression', '@business:high-impact', '@low-likely'] },
  () => {
    beforeEach(() => {
      cy.registerAccount();
    });

    it('should redirect to pretest when the user access to the article pdf page', () => {
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

      const articleSlugs = ['tumor-immune-contexture-car-t-cell-efficacy-lbcl'];

      cy.visit(`/article/${articleSlugs[0]}`);
      cy.contains('Get CME').click();
      cy.url().should('include', '/pretest/onboarding');
    });

    it('should not redirect to pretest when the api returns showPretest: false', () => {
      // Intercept the request to always show the pretest
      cy.intercept(
        {
          method: 'GET',
          url: '/api/user/pretest/show',
        },
        {
          showPretest: false,
        },
      ).as('showPretest');

      const articleSlugs = ['tumor-immune-contexture-car-t-cell-efficacy-lbcl'];

      cy.visit(`/article/${articleSlugs[0]}`);
      cy.contains('Get CME').click();
      cy.url().should('include', '/pdf');
    });

    it('should not redirect to pretest when the article doest not have pretest questions', () => {
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

      const articleSlugs = ['ivermectin-covid19-treatment-prevention'];

      cy.visit(`/article/${articleSlugs[0]}`);
      cy.contains('Get CME').click();
      cy.url().should('include', '/pdf');
    });
  },
);
