import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a free plan user has some completed unawarded special requirements', () => {
  cy.fixture('/SpecialRequirements/Certificates/credentials').then((credentials) => {
    cy.loginAccount(credentials.free);
  });
});

Given('the special requirements page has been navigated to', () => {
  cy.visit('/special-requirements');
});

Given('the "Completed" tab is selected', () => {
  cy.contains('Completed').click();
  cy.wait(100);
  cy.contains('Completed').click();
});

When('the user selects the "Completed" tab', () => {
  cy.contains('Completed').click();

  // There is a weird situation that only happens in the e2e tests where
  // after clicking the first time the tab is moved quickly to the Topics tab
  // so we need to re-click the Completed tab
  cy.wait(100);
  cy.contains('Completed').click();
});

When('the user requests to "Upgrade for certificate"', () => {
  cy.contains('Upgrade for certificate').click();
});

Then('the user should see  the call to action "Upgrade for certificate" for unawarded special requirements', () => {
  cy.contains('Upgrade for certificate').should('exist');
});

Then('the user should be navigated to "My Plan" page to review upgrade options', () => {
  cy.url().should('include', '/my-plan');
});
