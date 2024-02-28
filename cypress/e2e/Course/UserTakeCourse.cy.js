describe('UserTakeCourse', () => {
  before(() => {
    cy.fixture('/auth/credentialsLogin').then((users) => {
      cy.loginAccountFromFixture(users.standard.email, users.standard.password);
    });
    cy.wait(2000); // wait for login
  });

  it('Can start a Course', () => {
    cy.visit('/premium-courses/66');
    cy.contains('Agree and start').click();
    cy.contains('Start course').click();
    cy.contains('Completed modules').should('be.visible');
  });

  it('Can take a pre-test', () => {
    cy.contains('Take pre-test').click();
    cy.contains('Next').click();
    cy.contains('Start pre-test').click();
    cy.contains('Select the best answer').should('exist');
  });

  it('Can answer a pretest', () => {
    cy.contains('True').click();
    cy.contains('D').click();
    cy.contains('True').click();
    cy.contains('True').click();
    cy.contains('True').click();
    cy.contains('Go to course').should('be.visible');;
  });

  it('Can take a course module', () => {
    cy.contains('Go to course').click();
    cy.contains('Open Content').should('be.visible');;
  });

  it('Can browse the content', () => {
    cy.contains('Open Content').click();

    while (
      Array.from(document.querySelectorAll('button')).find(
        (el) => el.textContent === 'NEXT' && el.disabled === false,
      ) !== undefined
    ) {
      cy.contains('NEXT').click();
    }
    cy.contains('Back to Overview').click();
    cy.contains('Open Content').should('be.visible');;
  });

  it('Can take a course quiz and pass it', () => {
    cy.contains('Take quiz').click();

    cy.contains('True').click();
    cy.contains('Next question').click();

    cy.contains('False').click();
    cy.contains('Next question').click();

    cy.contains('True').click();
    cy.contains('Next question').click();

    cy.contains('PASSED!').should('be.visible');
  });

  it('Can take an evaluation', () => {
    cy.contains('Go to Overview').click();

    cy.contains('Start evaluation').click();
   
    cy.get('button').contains('Next').click();

    cy.contains('Yes').click();
    cy.get('button').contains('Next').click();

    cy.contains('Yes').click();
    cy.get('button').contains('Next').click();

    cy.contains('26-50%').click();
    cy.get('button').contains('Next').click();

    cy.contains('No').click();
    cy.get('button').contains('Finish evaluation').click();

    cy.contains('Thank you!').should('be.visible');
  });

});
