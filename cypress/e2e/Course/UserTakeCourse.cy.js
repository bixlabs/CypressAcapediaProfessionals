describe('UserTakeCourse', () => {
  before(() => {
    cy.fixture('/auth/credentialsLogin').as('credentials');
    cy.loginAccount('@credentials');
  });

  it('Can start a Course', () => {
    cy.visit('/premium-courses');
    cy.contains('Go to course').click();
    cy.contains('Agree and start').click();
    cy.contains('Start course').click();
    cy.contains('Completed modules');
  });
});
