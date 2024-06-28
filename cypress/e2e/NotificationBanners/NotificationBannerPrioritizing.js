import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a free user with credit limit reached and incomplete profile', function () {
  return 'pending';
});

When('the user navigates to the "Premium Courses" page', function () {
  cy.visit('/premium-courses');
});

Then(
  'Then the page should display a banner prompting the user to upgrade to premium with the text "Upgrade to premium to unlock unlimited access to all premium courses."',
  function (expectedNotificationText) {
    cy.find('.notification-banner-container').text().should('include', expectedNotificationText);
  },
);
