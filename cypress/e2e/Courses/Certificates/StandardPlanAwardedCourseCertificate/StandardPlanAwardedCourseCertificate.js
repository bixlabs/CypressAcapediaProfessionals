import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a standard plan user has some completed awarded premium courses', () => {
  cy.fixture('/Certificate/CourseCertificate/credentials').then((credentials) => {
    cy.log(credentials);
    cy.loginAccount(credentials.standard);
  });
});

Given('the premium courses page has been navigated to', () => {
  cy.visit('/premium-courses');
});

Given('an iOS mobile device is not being used', () => {
  this.userAgent = undefined;
});

When('the user selects the "Completed" tab', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
});

Then('the user should see the call to action "Review course" for awarded courses', () => {
  cy.wait('@completedCourses').then((interception) => {
    interception.response.body.data.forEach((course, index) => {
      if (course.isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('Review course').should('exist');
      }
    });
  });
});

// START Scenario: Standard plan users can successfully go to "Review course"
Given('an iOS mobile device is not used', () => {
  this.userAgent = undefined;
});

When('the "Completed" tab is selected', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
  cy.getByTestId('Completed').should('have.class', 'v-tab--active');
});

When('the call to action "Review course" is displayed to the user', () => {
  cy.wait('@completedCourses').then((interception) => {
    interception.response.body.data.forEach((course, index) => {
      if (course.isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('Review course').should('exist');
      }
    });
  });
});

When('the user click to "Review course"', () => {
  cy.contains('Review course').click();
});

Then('the user should be taken to "Review course"', () => {
  // due that we are targeting specific users it doesn't matter we hardcoded the URL
  cy.url().should('include', '/premium-courses/63/overview');
});
// END Scenario

// START Scenario: Standard plan users can successfully download certificate
Given('a standard plan users in the review course page', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
  cy.contains('Review course').click();
  cy.url().should('include', '/premium-courses/63/overview');
});
Given('the call to action "Download certificate" is displayed to the user', () => {
  cy.contains('Download certificate').should('exist');
});
When('the user requests to "Download certificate"', () => {
  cy.contains('Download certificate').click();
});
Then('the certificate should be downloaded successfully', () => {
  cy.readFile('./cypress/downloads/Testing_The_greatest_activity_of_all_the_time_2024.pdf').should('exist');
});
// END Scenario
