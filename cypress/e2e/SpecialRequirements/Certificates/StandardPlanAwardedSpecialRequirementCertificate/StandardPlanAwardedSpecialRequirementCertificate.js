import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

Before(function () {
  const folderPath = './cypress/downloads/';
  // delete created any files before run to avoid false positives
  cy.task('deleteAllFilesInFolder', folderPath).then((result) => {
    expect(result).to.be.null;
  });
});

Given('a standard plan user has some completed awarded special requirements', () => {
  cy.fixture('/SpecialRequirements/Certificates/credentials').then((credentials) => {
    cy.loginAccount(credentials.standard);
  });
});

Given('the special requirements page has been navigated to', () => {
  cy.visit('/special-requirements');
});

Given('the "Completed" tab is selected', () => {
  cy.contains('Completed').click();
});

Given('the call to action "Download certificate" is displayed to the user', () => {
  cy.contains('Download certificate').should('exist');
});

Given('the certificate was requested to be downloaded', () => {
  cy.visit('/special-requirements');
  cy.contains('Completed').click();
  cy.contains('Download certificate').click();
});

When('the user selects the "Completed" tab', () => {
  cy.intercept('GET', '/api/special-requirements/feed/completed').as('completedSpecialRequirements');
  cy.contains('Completed').click();
});

When('the user requests to "Download certificate"', () => {
  cy.contains('Download certificate').click();
});

Then('the certificate should be downloaded successfully', () => {
  const filePath = './cypress/downloads/SR_standard_Controlled_Substances_Alaska_2024.pdf';

  cy.contains('Download certificate').click();
  cy.readFile(filePath).should('exist');
});

Then('the user should see the call to action "Download certificate" for awarded special requirements', () => {
  cy.wait('@completedSpecialRequirements').then((interception) => {
    interception.response.body.data.forEach((specialRequirement, index) => {
      // There is a bug in the value of the api response
      const isAwarded = !specialRequirement.wasCompletedWithAllCreditsAwarded;

      if (isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('Download certificate').should('exist');
      }
    });
  });
});

Then('the user should be advised to download the certificate from desktop', () => {
  cy.contains('Download certificate from your desktop').should('exist');
});

Then('should not see the call to action to "Download certificate"', () => {
  cy.contains(/^Download certificate$/).should('not.exist');
});

Then('the special requirements page is still displayed in the background', () => {
  cy.url().should('match', /\/special-requirements/);
});

Then('the special requirements page is still displayed', () => {
  cy.url().should('match', /\/special-requirements/);
});

Then('the user will need to click again to download the certificate', () => {
  const filePath = './cypress/downloads/SR_standard_Controlled_Substances_Alaska_2024.pdf';
  cy.readFile(filePath).should('not.exist');

  cy.contains('Download certificate').click();
  cy.getByTestId('complete-profile-dialog').should('not.exist');
  cy.readFile(filePath).should('exist');
});
