import { faker } from '@faker-js/faker';

describe('GuestEarnCredits', { tags: ['@article-quiz', '@guest', '@business:medium-impact'] }, () => {
  it('should add the ability to earn credits after sign up', () => {
    cy.visit('/');

    const articleSlugs = ['firefighers-pfas-donations-trial', 'eif4e-aldh1b1-ferroptosis-lipid-peroxidation'];

    articleSlugs.forEach((slug, index) => {
      const isLastArticle = index === articleSlugs.length - 1;
      cy.visit(`/article/${slug}`);
      cy.contains('Get CME').click();
      cy.contains('Agree and start').click();
      cy.contains('Take quiz').click();

      let firstOptionSelector = '.v-input--radio-group__input > :nth-child(1)';
      for (let i = 0; i < 4; i++) {
        cy.get(firstOptionSelector).click();
        cy.contains('Next question').click();
      }
      // the last question does not have a "Next question" button
      cy.get(firstOptionSelector).click();

      if (!isLastArticle) {
        cy.contains('Go to feed').click();
        cy.contains("I don't want free CME").click();
      }
    });
    cy.contains('Sign up to claim credit').click();

    cy.registerAccount(
      {
        email: faker.internet.email().toLowerCase(),
      },
      {
        hasToVisitUrl: false,
      },
    );

    cy.contains('2.0 CME credits');
  });
});
