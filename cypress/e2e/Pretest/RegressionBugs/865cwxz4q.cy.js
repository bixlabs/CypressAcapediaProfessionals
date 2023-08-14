// https://app.clickup.com/t/865cwxz4q

describe('Regression Bug: Pre-test "End" screen without having done the pre-test yet', () => {
  beforeEach(() => {
    cy.fixture('/auth/credentialsLogin').as('credentials');
    cy.loginAccount('@credentials');
  });

  it('should not show the "End" screen after completing a pre-test and starting a new one', () => {
    // Intercept the request to always show the pretest
    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/pretest/show',
      },
      {
        showPretest: true,
      },
    ).as('showPretest');

    // we need to get the specialties in place before searching, otherwise concurrency issues will happen
    // it was not possible to intercept the request to get the specialties, so we wait for the feed instead
    cy.intercept('/api/feed?sort=newest').as('feed');

    const articleSlugs = [
      'tumor-immune-contexture-car-t-cell-efficacy-lbcl',
      'synthetic-embryos-gastrulation-neurulation-organogenesis',
    ];

    cy.visit(`/article/${articleSlugs[0]}`);
    cy.contains('Get CME').click();
    cy.contains('Next').click();
    cy.contains('Start pre-test').click();

    const firstOptionSelector = '.v-input--radio-group__input > :nth-child(1)';
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.contains('Read article and take quiz').click();
    cy.contains('Back to Feed').click();

    cy.visit(`/article/${articleSlugs[1]}`);
    cy.contains('Get CME').click();
    cy.get('.align-center > .heading').should('have.text', ' What is a pre-test? ');
  });

  it('should now show the initial step of the pretest onboarding, after completing the second pretest', () => {
    // Intercept the request to always show the pretest
    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/pretest/show',
      },
      {
        showPretest: true,
      },
    ).as('showPretest');

    const articleSlugs = [
      'tumor-immune-contexture-car-t-cell-efficacy-lbcl',
      'synthetic-embryos-gastrulation-neurulation-organogenesis',
    ];

    cy.visit(`/article/${articleSlugs[0]}`);
    cy.contains('Get CME').click();
    cy.contains('Next').click();
    cy.contains('Start pre-test').click();

    const firstOptionSelector = '.v-input--radio-group__input > :nth-child(1)';
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.contains('Read article and take quiz').click();
    cy.contains('Back to Feed').click();

    cy.visit(`/article/${articleSlugs[0]}`);
    cy.contains('Get CME').click();
    cy.contains('Next').click();
    cy.contains('Start pre-test').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();

    cy.url().should('include', `/article/${articleSlugs[0]}`);
    // wait for the url change to happen

    // cy.get('.align-center > .heading').should('have.text', ' Thank you! ');
    // cy.get('.descriptions').should(
    //   'have.text',
    //   'Now you can read the article, complete the post-test and get CME credit.',
    // );
  });

  it('should show the overlay when returning to the results step of the pretest', () => {
    // Intercept the request to always show the pretest
    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/pretest/show',
      },
      {
        showPretest: true,
      },
    ).as('showPretest');

    const articleSlugs = ['tumor-immune-contexture-car-t-cell-efficacy-lbcl'];

    cy.visit(`/article/${articleSlugs[0]}`);
    cy.contains('Get CME').click();
    cy.contains('Next').click();
    cy.contains('Start pre-test').click();

    const firstOptionSelector = '.v-input--radio-group__input > :nth-child(1)';
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();
    cy.get(firstOptionSelector).click();
    cy.contains('Confirm answer').click();

    cy.url().should('include', `/article/${articleSlugs[0]}`);
    cy.get('.align-center > .heading').should('have.text', ' Thank you! ');
    cy.getByTestId('veil').should('be.visible');
  });
});
