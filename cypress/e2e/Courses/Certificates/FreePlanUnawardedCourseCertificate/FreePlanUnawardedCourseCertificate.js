import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a free plan user has some completed unawarded premium courses', () => {
  cy.fixture('/Courses/Certificates/credentials').then((credentials) => {
    cy.log(credentials);
    cy.loginAccount(credentials.free);
  });
});

Given('the premium courses page has been navigated to', () => {
  cy.visit('/premium-courses');
});

When('the user selects the "Completed" tab', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
});

Then('the user should see  the call to action "Upgrade for certificate" for unawarded courses', () => {
  cy.wait('@completedCourses').then((interception) => {
    interception.response.body.data.forEach((course, index) => {
      if (!course.isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('Upgrade for certificate').should('exist');
      }
    });
  });
});

Given('the "Completed" tab is selected', () => {
  cy.contains('Completed').click();
});

When('the user requests to "Upgrade for certificate"', () => {
  cy.contains('Upgrade for certificate').click();
});

Then('the user should be navigated to "My Plan" page to review upgrade options', () => {
  cy.url().should('include', '/my-plan');
});
