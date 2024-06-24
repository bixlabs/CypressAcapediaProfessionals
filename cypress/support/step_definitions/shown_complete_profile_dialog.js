import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('a modal is shown requiring the user to fill the missing profile details', () => {
  cy.isFeatureFlagEnabled('MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED').then((isEnabled) => {
    if (isEnabled) {
      cy.contains('Complete profile to get your credits').should('exist');
    } else {
      cy.log('Feature flag MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED is disabled, skipping assertion');
    }
  });
});
