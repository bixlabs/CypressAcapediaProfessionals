import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a standard plan user has some completed unawarded special requirements', () => {
  cy.fixture('/SpecialRequirements/Certificates/credentials').then((credentials) => {
    cy.loginAccount(credentials.standard);
  });

  cy.intercept('/api/subscription/user', (req) => {
    req.continue((res) => {
      res.body.hasActivePaidSubscription = true;
      res.body.planName = 'Pro';
      res.body.status = 'active';
      res.body.endAt = '2030/03/12';
    });
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
        cy.getByTestId('status-completed').eq(index).contains('Upgrade for certificate').should('exist');

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

Then('the user should see the call to action "Upgrade for certificate" for unawarded special requirements', () => {
  cy.contains('Upgrade for certificate').should('exist');
});

Then('the user should see able to click the "Upgrade for certificate" button', () => {
  cy.getByTestId('status-completed')
    .eq(0)
    .find('a')
    .contains('Upgrade for certificate')
    .click();
});
