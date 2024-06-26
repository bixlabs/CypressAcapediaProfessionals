import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('the user has an incomplete profile', () => {
  cy.window().then((window) => {
    cy.request({
      method: 'PUT',
      url: `${Cypress.env('API_BASE_URL')}/user/boards`,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        authorization: `Bearer ${window.localStorage.getItem('authToken')}`,
      },
      body: {
        boardId: 1,
        boardNumber: '',
        dateOfBirth: '',
        degree: 'M.D.',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

Given('the user has a complete profile', () => {
  cy.window().then((window) => {
    cy.request({
      method: 'PUT',
      url: `${Cypress.env('API_BASE_URL')}/user/boards`,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        authorization: `Bearer ${window.localStorage.getItem('authToken')}`,
      },
      body: {
        boardId: 1,
        boardNumber: '12345',
        dateOfBirth: '1990-01-31',
        degree: 'M.D.',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

Given('the complete profile dialogue is displayed', () => {
  cy.isFeatureFlagEnabled('MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED').then((isEnabled) => {
    if (isEnabled) {
      cy.contains('Complete profile to get your credits').should('exist');
    } else {
      cy.log('Feature flag MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED is disabled, skipping');
    }
  });
});

When('the user completes the profile from the complete profile dialogue', () => {
  cy.isFeatureFlagEnabled('MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED').then((isEnabled) => {
    if (isEnabled) {
      cy.contains('Board ID').parents('.v-input').find('input').type('12345');

      cy.contains('Date of Birth').parents('.v-input').find('input').click();
      cy.get('.v-date-picker-years').contains('1990').click();
      cy.get('.v-date-picker-table').contains('Jan').click();
      cy.get('.v-date-picker-table').contains('31').click();

      cy.contains('Confirm information').click();
    } else {
      cy.log('Feature flag MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED is disabled, skipping');
    }
  });
});

Then('the complete profile dialog is shown requiring the user to fill the missing profile details', () => {
  cy.isFeatureFlagEnabled('MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED').then((isEnabled) => {
    if (isEnabled) {
      cy.contains('Complete profile to get your credits').should('exist');
    } else {
      cy.log('Feature flag MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED is disabled, skipping');
    }
  });
});

Then('the complete profile dialogue is closed', () => {
  cy.contains('Complete profile to get your credits').should('not.exist');
});
