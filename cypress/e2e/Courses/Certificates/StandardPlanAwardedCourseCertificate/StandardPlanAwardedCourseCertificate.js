import { Given, When, Then, BeforeAll } from '@badeball/cypress-cucumber-preprocessor';

BeforeAll(function () {
  const folderPath = './cypress/downloads/';
  // delete created any files before run to avoid false positives
  cy.task('deleteAllFilesInFolder', folderPath).then((result) => {
    expect(result).to.be.null;
  });
});

Given('a standard plan user has some completed awarded premium courses', () => {
  cy.fixture('/Courses/Certificates/credentials').then((credentials) => {
    cy.loginAccount(credentials.standard);
  });
});

Given('the premium courses page has been navigated to', () => {
  cy.visit('/premium-courses');
});

Given('the "Completed" tab is selected', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
});

Given('the call to action "Review course" is displayed to the user', () => {
  cy.wait('@completedCourses').then((interception) => {
    interception.response.body.data.forEach((course, index) => {
      if (course.isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('Review course').should('exist');
      }
    });
  });
});

Given('the call to action "Download certificate" is displayed to the user', () => {
  cy.contains('Download certificate').should('exist');
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

Given('the "Course overview" page has been navigated to', () => {
  cy.visit('/premium-courses/63/overview');
});

When('the user selects the "Completed" tab', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
});

When('the user requests to "Review course"', () => {
  cy.getByTestId('status-completed').eq(1).contains('Review course').click();
});

When('the user requests to "Download certificate"', () => {
  cy.contains('Download certificate').click();
});

Then('the user should be navigated to "Course overview" page', () => {
  cy.url().should('match', /\/premium-courses\/.+\/overview/);
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

Then('the certificate should be downloaded successfully', () => {
  const filePath = './cypress/downloads/Testing_The_greatest_activity_of_all_the_time_2024.pdf';

  cy.readFile(filePath).should('exist');
});

Then('a modal is shown requiring the user to fill the missing profile details', () => {
  cy.contains('Complete profile to get your credits').should('exist');
});
