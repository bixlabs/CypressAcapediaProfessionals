import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

Before(function () {
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

Given('the call to action "Download certificate" is displayed to the user', () => {
  cy.contains('Download certificate').should('exist');
});

When('the user requests to "Download certificate"', () => {
  cy.contains('Download certificate').click();
});

Given('the premium courses page has been navigated to', () => {
  cy.visit('/premium-courses');
});

Given('the "Completed" tab is selected', () => {
  cy.contains('Completed').click();
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
  cy.visit('/premium-courses');
});

Then('the user should be advised to download the certificate from desktop', () => {
  cy.contains('Download the certificate from desktop').should('exist');
});

Then('should not see the call to action to "Download certificate"', () => {
  cy.contains('Download certificate').should('not.exist');
});

Then('the premium courses page is still displayed in the background', () => {
  cy.url().should('match', /\/premium-courses/);
});

Given('the certificate was requested to be downloaded', () => {
  cy.visit('/premium-courses');
  cy.contains('Completed').click();
  cy.contains('Download certificate').click();
});

Then('the premium courses page is still displayed', () => {
  cy.url().should('match', /\/premium-courses/);
});

Then('the user will need to click again to download the certificate', () => {
  const filePath = './cypress/downloads/user_Course_Activity_Test_2_2024.pdf';
  cy.readFile(filePath).should('not.exist');

  cy.contains('Download certificate').click();
  cy.getByTestId('complete-profile-dialog').should('not.exist');
  cy.readFile(filePath).should('exist');
});
