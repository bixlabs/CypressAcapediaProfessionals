import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// TODO: improve this selector to be less brittle
const profileSelector = '.v-list-group__items > :nth-child(3)';

Given('the user is authenticated', function () {
  cy.fixture('/common/credentials').then((credentials) => {
    cy.loginAccount(credentials.incompleteProfile);
  });
});

Given('the {string} has been clicked from the sidebar', function (callToActionText) {
  cy.getSidebarMenuByText(callToActionText).click();
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

When('the user clicks on {string} from the sidebar', function (sidebarText) {
  cy.getSidebarMenuByText(sidebarText).click();
});

Then('the sidebar should display the text {string}', function (expectedSidebarText) {
  cy.get(profileSelector).invoke('text').should('have.exactText', expectedSidebarText);
});

Then('the Main Feed page is still displayed in the background', function () {
  cy.url().should('include', '/');
});

Then('the Premium Courses Feed page is still displayed in the background', function () {
  cy.url().should('include', '/premium-courses');
});

Then('the Topics page is still displayed in the background', function () {
  cy.url().should('include', '/special-requirements');
});

Then('the Main Feed page is still displayed', function () {
  cy.url().should('include', '/');
});

Then('the Premium Courses Feed page is still displayed', function () {
  cy.url().should('include', '/premium-courses');
});

Then('the Topics page is still displayed', function () {
  cy.url().should('include', '/special-requirements');
});

Then('the sidebar should not display the text {string}', function (expectedSidebarText) {
  cy.get(profileSelector).invoke('text').should('not.have.exactText', expectedSidebarText);
});
