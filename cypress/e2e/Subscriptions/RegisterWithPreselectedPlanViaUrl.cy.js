describe(
  'Registration with a Preselected Plan via URL',
  { tags: ['@register', '@purchase', '@business:high-impact', '@high-likely'] },
  () => {
    it('should register a user with the Pro plan preselected', () => {
      cy.visit('/register?checkoutPlan=pro');

      cy.registerAccount(undefined, {
        hasToVisitUrl: false,
        hasToCompleteOnboarding: false,
      });

      cy.url().should('include', '/checkout');
      cy.get('.selected-card').contains('Pro');
    });

    it('should register a user with the Lifetime plan preselected', () => {
      cy.visit('/register?checkoutPlan=lifetime');
      cy.registerAccount(undefined, {
        hasToVisitUrl: false,
        hasToCompleteOnboarding: false,
      });

      cy.url().should('include', '/checkout');
      cy.get('.selected-card').contains('Lifetime');
    });
  },
);
