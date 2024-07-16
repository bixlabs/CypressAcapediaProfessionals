import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('the user is authenticated', () => {
  cy.fixture('/Transcripts/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
  });
});

Given('the Main Feed page has been navigated to', () => {
  cy.visit('/');
});

Given('the Transcripts page has been navigated to', () => cy.visit('/transcripts'));

When('the user tries to access the Transcripts page via the CME counter link', () => {
  cy.getByTestId('app-bar-cme-counter').click();
});

When('the user tries to access the Transcripts page via the sidebar navigation', () => {
  cy.getSidebarMenuByText('Account').click();
  cy.getSidebarMenuByText('Transcript').click();
});

When('the user tries to access the Transcripts page via the URL', () => {
  cy.visit('/transcripts');
});

Then('the user should be in the Transcripts page', () => {
  cy.url().should('include', '/transcripts');
});
