// TODO: enable this when enabling the MILESTONE_FREE_AND_LIFETIME_UPDATES_V2_ENABLED FF
describe('Lifetime plan upgrade', () => {
  before(() => {
    cy.registerAccount();
  });

  it('should allow to upgrade from Free plan to Lifetime plan', () => {
    cy.visit('/my-plan');
    cy.contains('Upgrade plan').click();
    cy.contains('Upgrade to Lifetime').click();
    cy.getByTestId('upgrade-downgrade-button').click();

    cy.get('#chn').type('John Doe');
    cy.get('#card-holder-address').type('123 Main St');
    cy.get('#card-holder-city').type('New York');
    cy.get('#card-holder-state').type('NY');
    cy.get('#card-holder-postalcode').type('10001');
    cy.getWithinIframe('[name="number"]').type('4242424242424242');
    cy.getWithinIframe('[name="expiry"]').type('1235');
    cy.getWithinIframe('[name="cvc"]').type('244');

    cy.contains('Confirm payment').click();

    cy.get('h1').should('have.text', ' Lifetime plan ');
  });
});
