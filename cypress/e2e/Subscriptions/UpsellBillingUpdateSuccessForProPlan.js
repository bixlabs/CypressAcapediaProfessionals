import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

import { faker } from '@faker-js/faker';

const UPSELL_BILLING_UPDATE__SUCCESS_URL = '/plan/pro/billing-update-success';

Before(() => {
  cy.intercept('GET', '/lottie-animations/upsell-billing-update-success.json').as('billingAnimation');
});

Given('the user is a FluoroSafety Pro plan trial member', () => {
  cy.intercept('/api/subscription/user', (req) => {
    req.continue((res) => {
      res.body.hasActivePaidSubscription = true;
      res.body.planName = 'Pro';
      res.body.status = 'trialing';
      res.body.endAt = '2130/03/12';
    });
  });

  cy.intercept('/api/user', (req) => {
    req.continue((res) => {
      res.body.is_promo_user = true;
      res.body.acquisition_source = 'FluoroSafety';
    });
  });

  cy.intercept('/api/feed/onboarding', (req) => {
    req.continue((res) => {
      res.body.onboarding = 'done';
    });
  });

  cy.registerAccount(undefined, { hasToCompleteOnboarding: false });
});

Given('the subscriptions has successfuly updated for the pro plan', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Update subscription').click();

  cy.fillValidCheckoutForm();

  cy.contains('Update subscription').click();
});

Given('the upsell billing update success page has been navigated to', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}${UPSELL_BILLING_UPDATE__SUCCESS_URL}`);
});

When('the user successfully updates their billing for the Pro plan', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('My Plan').click();
  cy.contains('Upgrade plan').click();
  cy.contains('Update subscription').click();

  cy.fillValidCheckoutForm();

  cy.contains('Update subscription').click();
});

When('the user tries to navigate to the upsell billing update success page using the url directly', () => {
  cy.visit(UPSELL_BILLING_UPDATE__SUCCESS_URL);
});

Then('the success upsell billing update success page for the Pro plan should be shown', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}${UPSELL_BILLING_UPDATE__SUCCESS_URL}`);
});

Then('the page should show an animation for the Pro plan', () => {
  cy.wait('@billingAnimation').its('response.statusCode').should('be.oneOf', [200, 304]);
  cy.getByTestId('lottie-animation').should('be.visible');
});

Then('the user should be navigated to My plan page', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/my-plan`);
});
