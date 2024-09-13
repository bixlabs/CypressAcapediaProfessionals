describe(
  'Handling Upsell Discounts Specifically for FluoroSafety Users in Trial Period',
  { tags: ['@purchase', '@business:medium-impact', '@high-likely'] },
  () => {
    beforeEach(() => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('API_BASE_URL')}/testing/db/disable-fluoro-safety-former-discount`,
      });

      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('API_BASE_URL')}/testing/db/reset-coupon-redemptions`,
      });

      cy.fixture('/FluoroSafety/credentials').then((credentials) => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('API_BASE_URL')}/testing/db/convert-fluoro-safety-user`,
          body: {
            userEmail: credentials.downgradedFree.email,
          },
        });
      });
    });

    it('should display the discount for trialing users regardless of the discount period', () => {
      cy.fixture('/FluoroSafety/credentials').then((credentials) => {
        cy.loginAccount(credentials.trialing);
      });

      const requestUrl = `${Cypress.env('API_BASE_URL')}/testing/db/enable-fluoro-safety-former-discount`;
      cy.request({
        method: 'POST',
        url: requestUrl,
        body: {
          couponCode: 'E2EFLUORO50OFF',
          // In case of creating new tests with date, then use Math.floor(date.getTime() / 1000);
          discountStartDate: null,
          discountEndDate: null,
        },
      });

      cy.visit('/checkout/lifetime');

      cy.get(':nth-child(1) > .row > .text-right > .heading-l-small > [data-testid="discount-crossed-price"]').should(
        'have.text',
        ' $17 ',
      );
      cy.get(':nth-child(1) > .row > .text-right > .heading-l-small > [data-testid="discount-crossed-price"]').should(
        'have.class',
        'fluorosafety-discount-crossed-price',
      );
      cy.get('.selected-card > .row > .text-right > .heading-l-small > [data-testid="discount-crossed-price"]').should(
        'have.text',
        ' $998 ',
      );
      cy.get('.selected-card > .row > .text-right > .heading-l-small > [data-testid="discount-crossed-price"]').should(
        'have.class',
        'fluorosafety-discount-crossed-price',
      );

      cy.getByTestId('discount-expiration-section').should('not.exist');
      cy.getByTestId('discount-code-section').should('not.exist');
    });
  },
);
