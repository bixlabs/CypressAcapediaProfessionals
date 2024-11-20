describe('Integration test with visual testing', function () {
  it('Loads the checkout new referrals', function () {
    cy.fixture('common/credentials').then((credentials) => {
      cy.loginAccount(credentials.incompleteProfile);
    });

    cy.intercept('GET', 'api/subscription/change/preview?item=*', (req) => {
      req.continue((res) => {
        res.body.couponDiscount = 0;
        res.body.paidReferralDiscount = 900;
        res.body.paidReferralDiscountRemainingAfterPurchase = 23;
        res.body.planOriginalBasePrice = 998;
        res.body.totalToPaid = 0;
        res.body.upgradeDiscount = 204;
      });
    });

    // Load the page or perform any other interactions with the app.
    cy.viewport('samsung-s10');
    cy.visit('/checkout');
    cy.wait(10000);
    // Take a snapshot for visual diffing
    cy.percySnapshot('payment-details-referrals', {
      widths: [360],
      scope: '.payment-details',
    });
  });
});
