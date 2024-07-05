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
      cy.getByTestId('complete-profile-dialog').should('exist');
    } else {
      cy.log('Feature flag MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED is disabled, skipping');
    }
  });
});

Given('the Complete Profile dialog is shown', function () {
  cy.getByTestId('complete-profile-dialog').should('be.visible');
});

When('the user completes the profile from the complete profile dialogue', () => {
  cy.isFeatureFlagEnabled('MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED').then((isEnabled) => {
    if (isEnabled) {
      cy.get('#boardId').type('12345');

      cy.get('#dateOfBirth').click();
      cy.get('.v-date-picker-years').contains('1990').click();
      cy.get('.v-date-picker-table').contains('Jan').click();
      cy.get('.v-date-picker-table').contains('31').click();

      cy.contains('Confirm information').click();
    } else {
      cy.log('Feature flag MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED is disabled, skipping');
    }
  });
});

When('the user completes the profile from the complete profile dialogue opened from the sidebar', () => {
  cy.get('#boardId').type('12345');

  cy.get('#dateOfBirth').click();
  cy.get('.v-date-picker-years').contains('1990').click();
  cy.get('.v-date-picker-table').contains('Jan').click();
  cy.get('.v-date-picker-table').contains('31').click();

  cy.contains('Confirm information').click();
});

When('the user completes the profile via the Complete Profile dialog', () => {
  cy.get('#boardId').type('12345');

  cy.get('#dateOfBirth').click();
  cy.get('.v-date-picker-years').contains('1990').click();
  cy.get('.v-date-picker-table').contains('Jan').click();
  cy.get('.v-date-picker-table').contains('31').click();

  cy.contains('Confirm information').click();
});

Then('the complete profile dialog is shown requiring the user to fill the missing profile details', () => {
  cy.isFeatureFlagEnabled('MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED').then((isEnabled) => {
    if (isEnabled) {
      cy.getByTestId('complete-profile-dialog').should('be.visible');
    } else {
      cy.log('Feature flag MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED is disabled, skipping');
    }
  });
});

Then('the Complete Profile dialog should be closed', () => {
  cy.getByTestId('complete-profile-dialog').should('not.exist');
});

Then('the Complete Profile dialog should be shown', function () {
  cy.getByTestId('complete-profile-dialog').should('be.visible');
});
