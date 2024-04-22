import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a registered user', () => {
  cy.fixture('/Transcripts/credentials').then((credentials) => {
    cy.loginAccount(credentials.completeProfile);
  });
  cy.visit('/');
});

Given('they provided the required <MedicalBoardInformation> if any', () => {
  cy.contains('Provide your medical board to report your MOC and CME credits.').should('not.exist');
  cy.contains('Complete profile').should('not.exist');
});

Given('the user has complete board details in its profile', () => {
  cy.get('body').then($body => {
    if ($body.find(':contains("Account")').is(':visible')) {
      cy.contains('Account').parents('.menu-item').parent().click();
      cy.contains('Profile').parents('.menu-item').click();
    } else {
      cy.getByTestId('menu-drawer-btn').click();
      cy.contains('Account').parents('.menu-item').parent().click();
      cy.contains('Profile').parents('.menu-item').click();
    }
  });

  cy.contains('Board ID').parents('.v-input').find('input').invoke('val').then((inputValue) => {
    expect(inputValue).to.not.be.null;
    expect(inputValue).to.not.equal('');
  });
  cy.contains('Date of Birth').parents('.v-input').find('input').invoke('val').then((inputValue) => {
    expect(inputValue).to.not.be.null;
    expect(inputValue).to.not.equal('');
  });
  // once we double check board details and that we can actually go to profile page then we go back to main page
  cy.visit('/');
});

When('the user attempt to access the transcripts', () => {
  cy.visit('/transcripts');
});

Then('the user should be navigated to the transcript page', () => {
  cy.url().should('include', '/transcripts');
});

Given('no modal blocking and requiring to fill missing details is shown', () => {
  cy.getByTestId('veil').should('not.be.visible');
  cy.get('.aca-dialog-container').should('not.exist');
});
