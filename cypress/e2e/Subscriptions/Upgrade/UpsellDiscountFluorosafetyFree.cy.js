import { faker } from '@faker-js/faker';

describe(
  'Handling Upsell Discounts for FluoroSafety Free Users',
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

    const toTimestamp = (date) => Math.floor(date.getTime() / 1000);
    const enableFluoroSafetyDiscount = ({ discountStartDate, discountEndDate }) => {
      const requestUrl = `${Cypress.env('API_BASE_URL')}/testing/db/enable-fluoro-safety-former-discount`;
      cy.request({
        method: 'POST',
        url: requestUrl,
        body: {
          couponCode: 'E2EFLUORO50OFF',
          discountStartDate: discountStartDate ? toTimestamp(discountStartDate) : null,
          discountEndDate: discountStartDate ? toTimestamp(discountEndDate) : null,
        },
      });
    };

    it('should display the discount during the valid discount period', () => {
      const discountStartDate = new Date();
      discountStartDate.setDate(discountStartDate.getDate() - 2);

      const discountEndDate = new Date();
      discountEndDate.setDate(discountEndDate.getDate() + 3);

      enableFluoroSafetyDiscount({ discountStartDate, discountEndDate });

      cy.fixture('/FluoroSafety/credentials').then((credentials) => {
        cy.loginAccount(credentials.downgradedFree);
      });

      cy.visit('/checkout');

      cy.get('.selected-card > .row > .text-right > .heading-l-small > [data-testid="discount-crossed-price"]').should(
        'have.text',
        ' $17 ',
      );
      cy.get('.selected-card > .row > .text-right > .heading-l-small > [data-testid="discount-crossed-price"]').should(
        'have.class',
        'fluorosafety-discount-crossed-price',
      );
      cy.get(':nth-child(2) > .row > .text-right > .heading-l-small > [data-testid="discount-crossed-price"]').should(
        'have.text',
        ' $998 ',
      );
      cy.get(':nth-child(2) > .row > .text-right > .heading-l-small > [data-testid="discount-crossed-price"]').should(
        'have.class',
        'fluorosafety-discount-crossed-price',
      );

      const formattedEndDate = discountEndDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'America/Los_Angeles',
      });
      cy.getByTestId('discount-expiration-section').should('have.text', `Discount expires on ${formattedEndDate} `);

      // TODO: improve this selector to be less brittle
      cy.get('.mt-2').should('have.text', ' (E2E) FluoroSafety 50% off  -$102.00 ');

      cy.getByTestId('discount-code-section').should('not.exist');
    });

    it('should not display any discount outside of the discount period', () => {
      const discountStartDate = new Date();
      discountStartDate.setDate(discountStartDate.getDate() - 5);

      const discountEndDate = new Date();
      discountEndDate.setDate(discountEndDate.getDate() - 3);

      enableFluoroSafetyDiscount({ discountStartDate, discountEndDate });

      cy.fixture('/FluoroSafety/credentials').then((credentials) => {
        cy.loginAccount(credentials.downgradedFree);
      });
      cy.visit('/checkout');

      cy.wait(5000);
      cy.getByTestId('discount-crossed-price').should('not.exist');
      cy.getByTestId('discount-expiration-section').should('not.exist');
      cy.getByTestId('discount-code-section').should('exist');
    });

    it('should not display the discount if the coupon has already been redeemed', () => {
      const discountStartDate = new Date();
      discountStartDate.setDate(discountStartDate.getDate() - 2);

      const discountEndDate = new Date();
      discountEndDate.setDate(discountEndDate.getDate() + 3);

      enableFluoroSafetyDiscount({ discountStartDate, discountEndDate });

      cy.fixture('/FluoroSafety/credentials').then((credentials) => {
        cy.loginAccount(credentials.downgradedFree);

        cy.request({
          method: 'POST',
          url: `${Cypress.env('API_BASE_URL')}/testing/db/create-fluoro-safety-coupon-redemption`,
          body: {
            userEmail: credentials.downgradedFree.email,
          },
        });
      });

      cy.visit('/checkout');
      cy.wait(5000);
      cy.getByTestId('discount-crossed-price').should('not.exist');
      cy.getByTestId('discount-expiration-section').should('not.exist');
      cy.getByTestId('discount-code-section').should('exist');
    });

    it('should not display the discount for free users who are not FluoroSafety', () => {
      cy.intercept('/api/user', (req) => {
        req.continue((res) => {
          res.body.acquisition_source = null;
        });
      });

      const discountStartDate = new Date();
      discountStartDate.setDate(discountStartDate.getDate() - 2);

      const discountEndDate = new Date();
      discountEndDate.setDate(discountEndDate.getDate() + 3);

      enableFluoroSafetyDiscount({ discountStartDate, discountEndDate });

      cy.fixture('/FluoroSafety/credentials').then((credentials) => {
        cy.loginAccount(credentials.downgradedFree);

        cy.request({
          method: 'POST',
          url: `${Cypress.env('API_BASE_URL')}/testing/db/revert-fluoro-safety-user`,
          body: {
            userEmail: credentials.downgradedFree.email,
          },
        });
      });
      cy.visit('/checkout');

      cy.wait(5000);
      cy.getByTestId('discount-crossed-price').should('not.exist');
      cy.getByTestId('discount-expiration-section').should('not.exist');
      cy.getByTestId('discount-code-section').should('exist');
    });

    it('should allow a pro purchase at a discounted price when within the discount period', () => {
      const discountStartDate = new Date();
      discountStartDate.setDate(discountStartDate.getDate() - 2);

      const discountEndDate = new Date();
      discountEndDate.setDate(discountEndDate.getDate() + 3);

      enableFluoroSafetyDiscount({ discountStartDate, discountEndDate });

      const email = faker.internet.email();
      cy.registerAccount({
        email,
      });

      cy.request({
        method: 'POST',
        url: `${Cypress.env('API_BASE_URL')}/testing/db/convert-fluoro-safety-user`,
        body: {
          userEmail: email,
        },
      });

      cy.visit('/checkout/pro');

      cy.getByTestId('discount-expiration-section').should('exist');

      cy.fillBillingForm();
      cy.fillPaymentForm();

      cy.contains('Confirm payment').click();

      cy.url().should('include', '/payment-success');
      cy.contains('Review billing').click();

      cy.get('tbody > tr > :nth-child(2)').should('have.text', '$102.00');
    });

    it('should allow a lifetime purchase at a discounted price when within the discount period', () => {
      const discountStartDate = new Date();
      discountStartDate.setDate(discountStartDate.getDate() - 2);

      const discountEndDate = new Date();
      discountEndDate.setDate(discountEndDate.getDate() + 3);

      enableFluoroSafetyDiscount({ discountStartDate, discountEndDate });

      const email = faker.internet.email();
      cy.registerAccount({
        email,
      });

      cy.request({
        method: 'POST',
        url: `${Cypress.env('API_BASE_URL')}/testing/db/convert-fluoro-safety-user`,
        body: {
          userEmail: email,
        },
      });

      cy.visit('/checkout/lifetime');

      cy.getByTestId('discount-expiration-section').should('exist');

      cy.fillBillingForm();
      cy.fillPaymentForm();

      cy.contains('Confirm payment').click();

      cy.url().should('include', '/payment-success');
      cy.contains('Review billing').click();

      cy.get('tbody > tr > :nth-child(2)').should('have.text', '$499.00');
    });
  },
);
