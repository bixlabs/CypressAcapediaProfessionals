import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a free plan user has some completed awarded premium courses', () => {
  cy.fixture('/Certificate/CourseCertificate/credentials').then((credentials) => {
    cy.log(credentials);
    cy.loginAccount(credentials.free);
  });
});

Given('the user is not on an iOS mobile device', () => {
  this.userAgent = undefined;
});

Given('the user is on an iOS mobile device', () => {
  const userAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.6312.52 Mobile/15E148 Safari/604.1';
  cy.viewport('iphone-6');

  // Cypress necessitates visiting a page to set a custom user agent. Given that our Gherkin background
  // includes navigating to the premium courses page, we employ a workaround by revisiting the same page.
  // This approach allows us to simulate the background navigation with the desired user agent in place,
  // ensuring the user agent is effectively set for subsequent tests.
  cy.visit('/premium-courses', {
    onBeforeLoad: (win) => {
      Object.defineProperty(win.navigator, 'userAgent', {
        value: userAgent,
      });
    },
  });
});

Given('the user sees {string} for awarded courses', (awardedCallToActionText) => {
  cy.contains(awardedCallToActionText).should('exist');
});

When('the user clicks on "Download certificate"', () => {
  cy.contains('Download certificate').click();
});

When('the user clicks on "Upgrade for certificate"', () => {
  cy.contains('Upgrade for certificate').click();
});

Given('the user has navigated to the premium courses page', () => {
  const options = this.userAgent
    ? {
        onBeforeLoad: (win) => {
          Object.defineProperty(win.navigator, 'userAgent', {
            value: this.userAgent,
          });
        },
      }
    : {};

  cy.visit('/premium-courses', options);
});

When('the user selects the Completed tab', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
});

Then('the user should see {string} for awarded courses', (awardedCallToActionText) => {
  cy.wait('@completedCourses').then((interception) => {
    interception.response.body.data.forEach((course, index) => {
      if (course.isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains(awardedCallToActionText).should('exist');
      }
    });
  });
});

Then('the certificate should be downloaded successfully', () => {
  cy.contains('Download certificate').click();
  cy.readFile('./cypress/downloads/user_Course_Activity_Test_2_2024.pdf').should('exist');
});

Then('the user should be redirected to the my-plan page', () => {
  cy.url().should('include', '/my-plan');
});

Given('the user navigates to the premium courses page', () => {
  cy.visit('/premium-courses', {
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'userAgent', {
        value: this.userAgent,
      });
    },
  });
});

Then('the user should be advised to "Download the certificate from desktop"', () => {
  cy.contains('Download the certificate from desktop').should('exist');
});

Then('should not see the option to "Download certificate"', () => {
  cy.contains('Download certificate').should('not.exist');
});
