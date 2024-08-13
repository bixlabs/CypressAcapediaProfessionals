import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a standard plan user has some completed unawarded premium courses', () => {
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

Given('should see the call to action "Review course"', () => {
  cy.getByTestId('status-completed').eq(0).contains('Review course').should('exist');
});

Given('a standard plan user in the "Course overview" page', () => {
  cy.contains('Completed').click();
  cy.getByTestId('status-completed').eq(0).contains('Review course').click();
});

Given('the call to action "Download certificate" is not displayed to the user', () => {
  cy.contains('Download certificate').should('not.exist');
});

Given('the call to action "contact support" is displayed to the user', () => {
  cy.get('a').contains('contact support').should('exist');
});

Given('shows a copy text encouraging to the user to contact support', () => {
  cy.contains(
    'You have reached your CME limit. By completing this course, you are over the limit and cannot download the certificate until the next billing cycle. You can read articles, take another course or contact support to have your limit increased.',
  ).should('exist');
});

When('the user selects the "Completed" tab', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
});

When('the "Completed" tab is selected', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.contains('Completed').click();
});

When('the user requests to "Review course"', () => {
  cy.getByTestId('status-completed').eq(0).contains('Review course').click();
});

When('a standard plan user access the "Course overview" page', () => {
  cy.contains('Completed').click();
  cy.getByTestId('status-completed').eq(0).contains('Review course').click();
});

Then('the user should see a warning style for unawarded courses', () => {
  cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');
  cy.wait('@completedCourses').then((interception) => {
    interception.response.body.data.forEach((course, index) => {
      if (!course.isAwarded) {
        cy.getByTestId('status-completed').eq(index).contains('1/1').should('have.css', 'color', 'rgb(234, 120, 14)');

        cy.getByTestId('progress-bar-warning').eq(index).should('exist');

        cy.getByTestId('status-completed')
          .eq(index)
          .contains('Review course')
          .should('have.css', 'background-color', 'rgb(234, 120, 14)');
      }
    });
  });
});

Then('the user should be navigated to "Course overview" page', () => {
  cy.url().should('match', /\/premium-courses\/.+\/overview/);
});

Then('the user should see the "contact support" with a link to the external page', () => {
  // we can't test external pages thus only making sure that the link is correct should be enough
  cy.get('a')
    .contains('contact support')
    .should('have.attr', 'href', 'https://acapedia.zendesk.com/hc/en-us/requests/new');
});
