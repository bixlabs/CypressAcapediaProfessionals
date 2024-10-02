import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('the user is authenticated', function () {
  cy.fixture('/common/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
  });

  cy.intercept('/api/subscription/user', (req) => {
    req.continue((res) => {
      // we need a paid user otherwise the upgrade banner is shown for premium courses
      res.body.hasActivePaidSubscription = true;
    });
  });
});

Given('a logged in user having an incomplete profile', function () {
  cy.fixture('/common/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
  });
});

Given('the Main Feed page has been navigated to', function () {
  const pagePath = '/';

  cy.visit(pagePath);
});

Given('the Premium Courses Feed page has been navigated to', function () {
  const pagePath = '/premium-courses';
  cy.visit(pagePath);
});

Given('the Topics page has been navigated to', function () {
  const pagePath = '/special-requirements';
  cy.visit(pagePath);
});

Given('the Special Requirement Feed page has been navigated to', function () {
  const pagePath = '/special-requirements/topics/controlled-substances/states/alaska/feed';

  cy.visit(pagePath);
});

When('the "Complete profile" has been clicked from the banner', function () {
  cy.getByTestId('notification-banner-complete-profile-button').click();
});

When('the user navigates to the Main Feed page', function () {
  const pagePath = '/';

  cy.visit(pagePath);
});

When('the user navigates to the Premium Courses Feed page', function () {
  // we need a paid user otherwise the upgrade banner is shown
  cy.intercept('/api/subscription/user', (req) => {
    req.continue((res) => {
      res.body.hasActivePaidSubscription = true;
      res.body.planName = 'Pro';
      res.body.status = 'active';
      res.body.endAt = '2030/03/12';
    });
  });

  const pagePath = '/premium-courses';
  cy.visit(pagePath);
});

When('the user navigates to the Topics page', function () {
  const pagePath = '/special-requirements';

  cy.visit(pagePath);
});

When('the user navigates to the Special Requirement Feed page', function () {
  const pagePath = '/special-requirements/topics/controlled-substances/states/alaska/feed';

  cy.visit(pagePath);
});

When('the user clicks on "Complete profile" from the banner', function () {
  cy.getByTestId('notification-banner-complete-profile-button').click();
});

Then(
  'the page should display a banner prompting the user to complete their profile to manage MOC and CME credits with the text {string}',
  function (expectedNotificationText) {
    cy.getByTestId('notification-banner-complete-profile').invoke('text').should('include', expectedNotificationText);
  },
);

Then('the banner should display a call to action with the text {string}', function (expectedCallToActionText) {
  cy.getByTestId('notification-banner-complete-profile-button')
    .invoke('text')
    .should('have.exactText', expectedCallToActionText);
});

Then('the Main Feed page should remain visible in the background', function () {
  cy.url().should('include', '/');
});

Then('the Premium Courses Feed page should remain visible in the background', function () {
  cy.url().should('include', '/premium-courses');
});

Then('the Topics page should remain visible in the background', function () {
  cy.url().should('include', '/special-requirements');
});

Then('the Special Requirement Feed page should remain visible in the background', function () {
  cy.url().should('include', '/special-requirements/topics/controlled-substances/states/alaska/feed');
});

Then('the Main Feed page should remain visible', function () {
  cy.url().should('include', '/');
});

Then('the Premium Courses Feed page should remain visible', function () {
  cy.url().should('include', '/premium-courses');
});

Then('the Topics page should remain visible', function () {
  cy.url().should('include', '/special-requirements');
});

Then('the Special Requirement Feed page should remain visible', function () {
  cy.url().should('include', '/special-requirements/topics/controlled-substances/states/alaska/feed');
});

Then('the banner should disappear', function () {
  cy.getByTestId('notification-banner-complete-profile').should('not.exist');
});
