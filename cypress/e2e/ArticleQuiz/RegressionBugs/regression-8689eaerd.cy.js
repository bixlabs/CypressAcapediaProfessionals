// https://app.clickup.com/t/8689eaerd

describe(
  'Regression Bug: Guest users getting "Unauthenticated" error when starting an SR quiz',
  { tags: ['@guest', '@article-quiz', '@regression', '@business:high-impact', '@low-likely'] },
  () => {
    it('should keep the user logged in after starting an SR quiz', () => {
      cy.clearAllCookies();
      cy.visit('/');
      cy.getSidebarMenuByText('Special requirements').click();
      cy.contains('Explore content').click();
      cy.contains('Alaska').click();
      cy.getByTestId('submit').click();
      cy.contains('Go to article').click();
      cy.contains('Read article').click();
      cy.contains('Agree and start').click();
      cy.contains('Take quiz').click();

      // I know it is not a good practice to use a hardcoded timeout,
      // but was the easiest way to check that the url is not changed
      cy.wait(3000);
      cy.url({ timeout: 1000 }).should('not.include', '/login');
    });
  },
);
