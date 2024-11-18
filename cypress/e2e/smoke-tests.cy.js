describe('Smoke Tests', { tags: ['@smoke', '@business:critical'] }, () => {
  const pages = [
    { url: '/', element: 'Fast. Relevant. All in one place' },
    { url: '/premium-courses', element: 'Fast. Relevant. All in one place' },
    { url: '/special-requirements', element: 'Fast. Relevant. All in one place' },
    { url: '/login', element: 'Continue earning CME and MOC credits' },
    { url: '/register', element: 'Join our brilliant medical community' },
    { url: '/terms', element: 'Terms of Use' },
    { url: '/privacy', element: 'Privacy Policy' },
    { url: '/article/firefighers-pfas-donations-trial', element: 'Get CME' },
    {
      url: '/premium-courses/the-original-advanced-training-program-on-the-safe-of-use-of-fluoroscopy/abstract',
      element: 'You need a paid account to access premium courses',
    },
  ];

  pages.forEach((page) => {
    it(`should load ${page.url} correctly`, () => {
      cy.visit(page.url);

      // Check if the main identifying element of the page is present
      // This ensures the page has loaded and is displaying its main content
      cy.contains(page.element).should('be.visible');

      cy.percySnapshot(page.url);
    });
  });
});
