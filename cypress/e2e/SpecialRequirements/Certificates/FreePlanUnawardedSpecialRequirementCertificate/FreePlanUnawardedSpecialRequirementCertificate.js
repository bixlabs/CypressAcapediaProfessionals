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
  cy.intercept('GET', '/api/special-requirements/feed/completed').as('completedSpecialRequirements');
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

Then('the user should see a warning style for unawarded special requirements', () => {
  cy.wait('@completedSpecialRequirements').then((interception) => {
    interception.response.body.data.forEach((specialRequirement, index) => {
      // There is a bug in the value of the api response
      const isAwarded = !specialRequirement.wasCompletedWithAllCreditsAwarded;

      if (isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('Download certificate').should('exist');
      }
    });
  });

  cy.wait('@completedSpecialRequirements').then((interception) => {
    interception.response.body.data.forEach((specialRequirement, index) => {
      // There is a bug in the value of the api response
      const isAwarded = !specialRequirement.wasCompletedWithAllCreditsAwarded;

      if (!isAwarded) {
        const warningStyleColor = 'rgb(234, 120, 14)';

        cy.getByTestId('status-completed').eq(index).contains('1/1').should('have.css', 'color', warningStyleColor);

        cy.getByTestId('progress-bar-warning').eq(index).should('exist');

        cy.getByTestId('status-completed')
          .eq(index)
          .contains('Upgrade for certificate')
          .should('have.css', 'background-color', warningStyleColor);
      }
    });
  });
});

Then('the user should see  the call to action "Upgrade for certificate" for unawarded special requirements', () => {
  cy.contains('Upgrade for certificate').should('exist');
});

Then('the user should be navigated to "My Plan" page to review upgrade options', () => {
  cy.url().should('include', '/my-plan');
});
