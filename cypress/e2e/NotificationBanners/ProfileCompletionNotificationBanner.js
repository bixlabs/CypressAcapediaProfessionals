import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('a logged in user having an incomplete profile', function () {
  cy.fixture('/common/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
    this.notificationAppearanceResultPerPage = [];
  });
});

When('the user navigates to one of the following pages:', function (table) {
  const rows = table.hashes();

  cy.wrap(rows).each((row) => {
    cy.visit(row['Page Path']).then(() => {
      cy.get('main[data-booted="true"]').then(($main) => {
        const notificationText = $main.find('.notification-banner-container').text();
        const pageName = row['Page Name'];

        this.notificationAppearanceResultPerPage.push({ pageName, notificationText });
      });
    });
  });
});

Then(
  'each page should display a banner prompting the user to complete their profile to manage MOC and CME credits with the text {string}',
  function (expectedNotificationText) {
    cy.wrap(this.notificationAppearanceResultPerPage).each((notificationAppearance) => {
      expect(
        notificationAppearance.notificationText,
        `Expecting the Profile Completion Notification Banner to be shown on the page: ${notificationAppearance.pageName}`,
      ).to.include(expectedNotificationText);
    });
  },
);
