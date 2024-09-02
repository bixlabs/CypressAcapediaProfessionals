describe(
  'Email CTA Checkout Upgrade Flow',
  { tags: ['@email', '@campaign', '@purchase', '@business:high-impact', '@high-likely'] },
  () => {
    it('should log in a user and redirect to the checkout page with the Pro plan preselected', () => {
      cy.visit('/email-cta/upgrade/pro');

      cy.fixture('common/credentials.json').then((credentials) => {
        cy.loginAccount(credentials.incompleteProfile, {
          hasToVisitUrl: false,
          hasToReuseSession: false,
          hasToAssertLoginResult: false,
        });
      });

      cy.url().should('include', '/checkout');
      cy.get('.selected-card').contains('Pro');
    });

    it('should log in a user and redirect to the checkout page with the Lifetime plan preselected', () => {
      cy.visit('/email-cta/upgrade/lifetime');

      cy.fixture('common/credentials.json').then((credentials) => {
        cy.loginAccount(credentials.incompleteProfile, {
          hasToVisitUrl: false,
          hasToReuseSession: false,
          hasToAssertLoginResult: false,
        });
      });

      cy.url().should('include', '/checkout');
      cy.get('.selected-card').contains('Lifetime');
    });

    it('should redirect an already logged-in user to the checkout page with the Pro plan preselected', () => {
      cy.fixture('common/credentials.json').then((credentials) => {
        cy.loginAccount(credentials.incompleteProfile, {
          hasToReuseSession: false,
        });
      });

      cy.visit('/email-cta/upgrade/pro');
      cy.url().should('include', '/checkout');
      cy.get('.selected-card').contains('Pro');
    });

    it('should redirect an already logged-in user to the checkout page with the Lifetime plan preselected', () => {
      cy.fixture('common/credentials.json').then((credentials) => {
        cy.loginAccount(credentials.incompleteProfile, {
          hasToReuseSession: false,
        });
      });

      cy.visit('/email-cta/upgrade/lifetime');
      cy.url().should('include', '/checkout');
      cy.get('.selected-card').contains('Lifetime');
    });
  },
);
