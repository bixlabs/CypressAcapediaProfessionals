import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a logged in user having an incomplete profile', function () {
  cy.fixture('/common/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
    this.notificationAppearanceResultPerPage = [];
  });
});

const addResultPerPage = (pageName) => {
  cy.get('main[data-booted="true"]').then(function ($main) {
    const notificationText = $main.find('.notification-banner-container').text();
    this.notificationAppearanceResultPerPage.push({ pageName, notificationText });
  });
};

When('the user navigates to the Main Feed page', function (pageName) {
  const pagePath = '/';

  cy.visit(pagePath).then(() => addResultPerPage(pageName));
});

When('the user navigates to the Premium Courses Feed page', function (pageName) {
  const pagePath = '/premium-courses';

  cy.visit(pagePath).then(() => addResultPerPage(pageName));
});

When('the user navigates to the Topics page', function (pageName) {
  const pagePath = '/special-requirements';

  cy.visit(pagePath).then(() => addResultPerPage(pageName));
});

When('the user navigates to the Special Requirement Feed page', function (pageName) {
  const pagePath = '/special-requirements/topics/controlled-substances/states/alaska/feed';

  cy.visit(pagePath).then(() => addResultPerPage(pageName));
});

Then(
  'the page should display a banner prompting the user to complete their profile to manage MOC and CME credits with the text {string}',
  function (expectedNotificationText) {
    cy.wrap(this.notificationAppearanceResultPerPage).each((notificationAppearance) => {
      expect(
        notificationAppearance.notificationText,
        `Expecting the Profile Completion Notification Banner to be shown on the page: ${notificationAppearance.pageName}`,
      ).to.include(expectedNotificationText);
    });
  },
);
