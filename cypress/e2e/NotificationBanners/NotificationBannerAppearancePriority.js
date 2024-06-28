import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
  cy.fixture('/common/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
  });
});

Given('the authenticated user has a free account', function () {
  cy.intercept('/api/subscription/user', (req) => {
    req.continue((res) => {
      res.body.hasActivePaidSubscription = false;
    });
  });

  cy.fixture('/common/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
  });
});

Given('the user has reached their credit limit', function () {
  cy.intercept('/api/user', (req) => {
    req.continue((res) => {
      res.body.unawardedCredits = 1;
    });
  });
});

Given('the user has not completed their profile', function () {
  cy.intercept('/api/user/profile', (req) => {
    req.continue((res) => {
      res.body.boardId = 1;
      res.body.boardNumber = '';
      res.body.dateOfBirth = '';
      res.body.degree = 'M.D.';
    });
  });
});

Given('the authenticated user has a paid account', function () {
  cy.intercept('/api/subscription/user', (req) => {
    req.continue((res) => {
      res.body.hasActivePaidSubscription = true;
      res.body.planName = 'Pro';
      res.body.status = 'active';
      res.body.endAt = '2030/03/12';
    });
  });

  cy.fixture('/common/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
  });
});

Given('the user is not authenticated', function () {
  return 'skip';
});

Given('the user has completed their profile', function () {
  cy.intercept('/api/user/profile', (req) => {
    req.continue((res) => {
      res.body.medicalBoard.board_id = 1;
      res.body.medicalBoard.board_number = '12345';
      res.body.dateOfBirth = '1990-01-31';
      res.body.degree = 'M.D.';
    });
  });
});

Given('the user has not reached their credit limit', function () {
  cy.intercept('/api/user', (req) => {
    req.continue((res) => {
      res.body.unawardedCredits = 0;
    });
  });
});

When('the user navigates to the "Premium Courses" page', function () {
  cy.visit('/premium-courses');
});

When('the user navigates to the "Main Feed" page', function () {
  cy.visit('/');
});

// the user navigates to the "Premium Course Abstract" page
When('the user navigates to the "Premium Course Abstract" page', function () {
  cy.visit('/premium-courses/decimal-course-65/abstract');
});

const shouldMatchBannerText = (expectedNotificationText) =>
  cy.get('.notification-banner-container').invoke('text').should('match', new RegExp(expectedNotificationText));

Then(
  'the page should display a banner prompting the user to upgrade to premium with the text {string}',
  function (expectedNotificationText) {
    shouldMatchBannerText(expectedNotificationText);
  },
);

Then(
  'the page should display a banner prompting the user to complete their profile to manage MOC and CME credits with the text {string}',
  function (expectedNotificationText) {
    shouldMatchBannerText(expectedNotificationText);
  },
);

Then(
  'the page should display a banner prompting the user that they have reached their credit limit with the text {string}',
  function (expectedNotificationText) {
    shouldMatchBannerText(expectedNotificationText);
  },
);

Then('the page should not display a notification banner', function () {
  cy.get('.notification-banner-container').should('not.exist');
});
