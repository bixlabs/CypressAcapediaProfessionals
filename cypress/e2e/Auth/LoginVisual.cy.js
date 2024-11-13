describe('Integration test with visual testing', function () {
  it('Loads the homepage', function () {
    // Load the page or perform any other interactions with the app.
    cy.visit('/login');
    cy.wait(5000);
    // Take a snapshot for visual diffing
    cy.percySnapshot('login-desktop');
  });
});
