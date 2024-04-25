import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a lifetime plan user has some completed awarded special requirements', () => {
  cy.fixture('/SpecialRequirements/Certificates/credentials').then((credentials) => {
    cy.loginAccount(credentials.lifetime);
  });
});

Given('the special requirements page has been navigated to', () => {
  cy.visit('/special-requirements');
});

Given('an iOS mobile device is not being used', () => {
  this.userAgent = undefined;
});

Given('the "Completed" tab is selected', () => {
  cy.contains('Completed').click();

  // There is a weird situation that only happens in the e2e tests where
  // after clicking the first time the tab is moved quickly to the Topics tab
  // so we need to re-click the Completed tab
  cy.wait(100);
  cy.contains('Completed').click();
});

Given('the call to action "Download certificate" is displayed to the user', () => {
  cy.contains('Download certificate').should('exist');
});

Given('an iOS mobile device is being used', () => {
  const userAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.6312.52 Mobile/15E148 Safari/604.1';
  cy.viewport('iphone-6');

  // Cypress necessitates visiting a page to set a custom user agent. Given that our Gherkin background
  // includes navigating to the premium courses page, we employ a workaround by revisiting the same page.
  // This approach allows us to simulate the background navigation with the desired user agent in place,
  // ensuring the user agent is effectively set for subsequent tests.
  cy.visit('/special-requirements', {
    onBeforeLoad: (win) => {
      Object.defineProperty(win.navigator, 'userAgent', {
        value: userAgent,
      });
    },
  });
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

When('the user requests to "Download certificate"', () => {
  cy.contains('Download certificate').click();
});

Then('the certificate should be downloaded successfully', () => {
  const filePath = './cypress/downloads/Lifetime_Controlled_Substances_Alaska_2024.pdf';

  cy.contains('Download certificate').click();
  cy.readFile(filePath).should('exist');

  // delete created files after run to avoid false positives
  cy.task('deleteFile', filePath).then(result => {
    expect(result).to.be.null;
  });
});

Then('the user should see a success style for awarded special requirements', () => {
  cy.wait('@completedSpecialRequirements').then((interception) => {
    interception.response.body.data.forEach((specialRequirement, index) => {
      // There is a bug in the value of the api response
      const isAwarded = !specialRequirement.wasCompletedWithAllCreditsAwarded;

      if (isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('Download certificate').should('exist');

        const successStyleColor = 'rgb(19, 181, 119)';

        cy.getByTestId('status-completed').eq(index).contains('2/2').should('have.css', 'color', successStyleColor);

        cy.getByTestId('progress-bar-success').eq(index).should('exist');
      }
    });
  });
});

Then('the user should see the call to action "Download certificate" for awarded special requirements', () => {
  cy.getByTestId('status-completed').eq(0).contains('Download certificate').should('exist');
});

Then('the user should be advised to download the certificate from desktop', () => {
  cy.contains('Download certificate from your desktop').should('exist');
});

Then('should not see the call to action to "Download certificate"', () => {
  cy.contains(/^Download certificate$/).should('not.exist');
});
