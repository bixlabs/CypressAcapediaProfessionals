import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a standard plan user has some completed unawarded special requirements', () => {
  cy.fixture('/SpecialRequirements/Certificates/credentials').then((credentials) => {
    cy.loginAccount(credentials.standard);
  });
});

Given('the special requirements page has been navigated to', () => {
  cy.visit('/special-requirements');
});

When('the user selects the "Completed" tab', () => {
  cy.intercept('GET', '/api/special-requirements/feed/completed').as('completedSpecialRequirements');
  cy.contains('Completed').click();
});

Then('the user should see a warning style for unawarded special requirements', () => {
  cy.wait('@completedSpecialRequirements').then((interception) => {
    interception.response.body.data.forEach((specialRequirement, index) => {
      // There is a bug in the value of the api response
      const isAwarded = !specialRequirement.wasCompletedWithAllCreditsAwarded;

      if (!isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('Contact support').should('exist');
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
          .contains('Contact support')
          .should('have.css', 'background-color', warningStyleColor);
      }
    });
  });
});

Then('the user should see the call to action "Contact support" for unawarded special requirements', () => {
  cy.contains('Contact support').should('exist');
});

Then('the user should see the "Contact support" with a link to the external page', () => {
  // we can't test external pages thus only making sure that the link is correct should be enough
  cy.getByTestId('status-completed')
    .eq(0)
    .find('a')
    .contains('Contact support')
    .parent()
    .should('have.attr', 'href', 'https://acapedia.zendesk.com/hc/en-us/requests/new');
});
