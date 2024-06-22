import { Given, When, Then, BeforeAll } from '@badeball/cypress-cucumber-preprocessor';

BeforeAll(function () {
  const filePath = './cypress/downloads/user_Course_Activity_Test_2_2024.pdf';
  // delete created any files before run to avoid false positives
  cy.task('deleteFile', filePath).then((result) => {
    expect(result).to.be.null;
  });
});

Given('a free plan user has some completed awarded premium courses', () => {
  cy.fixture('/Courses/Certificates/credentials').then((credentials) => {
    cy.loginAccount(credentials.free);
  });
});

Given('an iOS mobile device is not being used', () => {
  this.userAgent = undefined;
});

Given('an iOS mobile device is being used', () => {
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

Given('the call to action "Download certificate" is displayed to the user', () => {
  cy.contains('Download certificate').should('exist');
});

When('the user requests to "Download certificate"', () => {
  cy.contains('Download certificate').click();
});

Given('the premium courses page has been navigated to', () => {
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

Given('the "Completed" tab is selected', () => {
  cy.contains('Completed').click();
});

Given('the user has an incomplete profile', () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/api/user/profile',
    },
    {
      boardId: 1,
      boardNumber: '',
      dateOfBirth: '',
      degree: 'M.D.',
    },
  );
});

When('the user selects the "Completed" tab', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
});

Then('the user should see the call to action "Download certificate" for awarded courses', () => {
  cy.wait('@completedCourses').then((interception) => {
    interception.response.body.data.forEach((course, index) => {
      if (course.isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('Download certificate').should('exist');
      }
    });
  });
});

Then('the certificate should be downloaded successfully', () => {
  const filePath = './cypress/downloads/user_Course_Activity_Test_2_2024.pdf';
  cy.contains('Download certificate').click();
  cy.readFile(filePath).should('exist');
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

Then('the user should be advised to download the certificate from desktop', () => {
  cy.contains('Download the certificate from desktop').should('exist');
});

Then('should not see the call to action to "Download certificate"', () => {
  cy.contains('Download certificate').should('not.exist');
});

Then('a modal is shown requiring the user to fill the missing profile details', () => {
  cy.contains('Complete profile to get your credits').should('exist');
});
