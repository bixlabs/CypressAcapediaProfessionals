import { Given, When, Then, BeforeAll } from '@badeball/cypress-cucumber-preprocessor';

BeforeAll(function () {
  // we need to reset to the initial status this test before everything
  cy.intercept('GET', '/api/user').as('getUser');

  cy.fixture('/Transcripts/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
  });

  cy.visit('/');
  cy.wait('@getUser');

  cy.window().then((window) => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8080/api/user/boards',
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

Given('a registered user', () => {
  cy.fixture('/Transcripts/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
  });
  cy.visit('/');
});

Given('they did not provide the required <MedicalBoardInformation>', () => {
  cy.contains('Provide your medical board to report your MOC and CME credits.').should('exist');
  cy.contains('Complete profile').should('exist');
});

Given('a user does not fill the board details required by their board selection', () => {
  cy.contains('Provide your medical board to report your MOC and CME credits.').should('exist');
  cy.contains('Complete profile').should('exist');
});

Given('the modal to fill the board details is shown', () => {
  cy.visit('/transcripts');
  cy.contains('Complete profile to get your credits').should('be.visible');
  cy.contains('Board ID').parents('.v-input').find('input').invoke('val').then((inputValue) => {
    expect(inputValue).to.be.equal('');
  });
  cy.contains('Date of Birth').parents('.v-input').find('input').invoke('val').then((inputValue) => {
    // this is the empty value for that dob plugin we are using
    expect(inputValue).to.be.equal('undefined/undefined/wn');
  });
  cy.contains('Confirm information').parent().parent().find('.v-btn--disabled').should('exist');
});

When('the user tries to access the transcripts page', () => {
  cy.visit('/transcripts');
});

When('the user submits the missing board details', () => {
  cy.contains('Board ID').parents('.v-input').find('input').type('12345');

  cy.contains('Date of Birth').parents('.v-input').find('input').click();
  cy.contains('1990').click();
  cy.contains('Jan').click();
  cy.get('.v-date-picker-header.theme--light').parent()
  .find('.v-date-picker-table')
  .contains('31').parent().click();

  cy.contains('Confirm information').parent().parent().click();
});

Then('a modal showns requiring to the user fill the missing board details', () => {
  cy.get('.aca-dialog-container').should('be.visible');
});

Given('the modal is blocking the transcript page behind', () => {
  cy.getByTestId('veil').should('be.visible');
});

Then('the modal is automatically closed and the transcript page is not blocked', () => {
  cy.getByTestId('veil').should('not.be.visible');
  cy.get('.aca-dialog-container').should('not.exist');
});
