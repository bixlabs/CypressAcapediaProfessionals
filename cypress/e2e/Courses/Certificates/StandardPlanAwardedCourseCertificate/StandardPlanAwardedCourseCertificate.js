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
