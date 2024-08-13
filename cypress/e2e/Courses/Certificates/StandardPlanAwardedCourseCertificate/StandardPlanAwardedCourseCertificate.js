import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

Before(function () {
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

  cy.intercept('/api/subscription/user', (req) => {
    req.continue((res) => {
      res.body.hasActivePaidSubscription = true;
      res.body.planName = 'Pro';
      res.body.status = 'active';
      res.body.endAt = '2030/03/12';
    });
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

Given('a standard plan user in the "Course overview" page', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
  cy.wait('@completedCourses').then((interception) => {
    interception.response.body.data.forEach((course, index) => {
      if (course.isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('Review course').click();
      }
    });
  });
  cy.url().should('match', /\/premium-courses\/.+\/overview/);
});

Given('the call to action "Download certificate" is displayed to the user', () => {
  cy.contains('Download certificate').should('exist');
});

Given('the "Course overview" page has been navigated to', () => {
  cy.visit('/premium-courses/63/overview');
});

Given('the certificate was requested to be downloaded', () => {
  cy.visit('/premium-courses/63/overview');
  cy.contains('Download certificate').click();
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

Then('the "Course overview" page is still displayed in the background', () => {
  cy.url().should('match', /\/premium-courses\/.+\/overview/);
});

Then('the "Course overview" page is still displayed', () => {
  cy.url().should('match', /\/premium-courses\/.+\/overview/);
});

Then('the user will need to click again to download the certificate', () => {
  const filePath = './cypress/downloads/Testing_The_greatest_activity_of_all_the_time_2024.pdf';
  cy.readFile(filePath).should('not.exist');

  cy.contains('Download certificate').click();
  cy.getByTestId('complete-profile-dialog').should('not.exist');
  cy.readFile(filePath).should('exist');
});
