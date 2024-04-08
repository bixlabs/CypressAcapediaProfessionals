import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a standard plan user has some completed unawarded premium courses', () => {
  cy.fixture('/Certificate/CourseCertificate/credentials').then((credentials) => {
    cy.log(credentials);
    cy.loginAccount(credentials.standard_unawarded);
  });
});

// START Scenario: Standard plan users should see the call to action "Review course" for completed and unawarded premium courses
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

Then('the user should see for unawarded courses cards the warning style', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.wait('@completedCourses').then((interception) => {
    interception.response.body.data.forEach((course, index) => {
      if (!course.isAwarded) {
        cy.getByTestId('status-completed').eq(index)
        .contains('1/1')
        .should('have.css', 'color', 'rgb(234, 120, 14)');

        cy.getByTestId('progress-bar-warning').eq(index)
        .should('exist');

        cy.getByTestId('status-completed').eq(index)
        .contains('Review course')
        .should('have.css', 'background-color', 'rgb(234, 120, 14)');
      }
    });
  });
});

Given('should see the call to action "Review course"', () => {
  cy.contains('Review course').should('exist');
});
// END Scenario

// START Scenario: Standard plan users can successfully go to "Review course"
Given('an iOS mobile device is not used', () => {
  this.userAgent = undefined;
});

When('the "Completed" tab is selected', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
});

Given('the call to action "Review course" is displayed to the user', () => {
  cy.contains('Review course').should('exist');
});

When('the user click to "Review course"', () => {
  cy.contains('Review course').click();
});

Then('the user should be taken to "Review course"', () => {
  // due that we are targeting specific users it doesn't matter we hardcoded the URL
  cy.url().should('include', '/premium-courses/65/overview');
});
// END Scenario

// START Scenario: Standard plan users with unawarded course credits can not download certificate
Given('a standard plan users in the review course page', () => {
  // due that we are targeting specific users it doesn't matter we hardcoded the URL
  cy.contains('Completed').click();
  cy.contains('Review course').click();
  cy.url().should('include', '/premium-courses/65/overview');
});

Given('the call to action "Download certificate" is not displayed to the user', () => {
  cy.contains('Download certificate').should('not.exist');
});

Given('the call to action "Upgrade" is displayed to the user', () => {
  cy.contains('Upgrade').should('exist');
});

Given('shows a copy text alert explaining the situation to the user', () => {
  cy.contains('By completing this course, you are over the limit and cannot download the certificate until the next billing cycle. Upgrade to increase your credit limit.').should('exist');
});

When('the user requests to "Upgrade"', () => {
  cy.getByTestId('aca-alert-cta')
  .contains('Upgrade').click();
});

Then('the user should be taken to plans page', () => {
  cy.url().should('include', '/my-plan');
  cy.contains('Upgrade to').should('exist');
});
// END Scenario