describe('Certificates for Free Plan Users in Completed Courses', () => {
  beforeEach(() => {
    cy.fixture('/Certificate/CourseCertificate/credentials').then((credentials) => {
      cy.log(credentials);
      cy.loginAccount(credentials.free);
    });
  });

  it('should display the correct action for each completed course based on the CME award status, offering "Download certificate" for awarded courses and "Upgrade for certificate" for others', () => {
    cy.intercept('GET', '/api/feed/premium-courses?enrollmentStatus=completed').as('completedCourses');

    cy.visit('/premium-courses');
    cy.contains('Completed').click();

    cy.wait('@completedCourses').then((interception) => {
      const completedCourses = interception.response.body.data;

      completedCourses.forEach((course, index) => {
        cy.getByTestId('status-completed')
          .eq(index)
          .then(($courseCard) => {
            cy.wrap($courseCard).contains(course.title);
            if (course.isAwarded) {
              cy.wrap($courseCard).contains('Download certificate').should('exist');
            } else {
              cy.wrap($courseCard).contains('Upgrade for certificate').should('exist');
            }
          });
      });
    });
  });

  it('should navigate to my plan page when clicking on "Upgrade for certificate"', () => {
    cy.visit('/premium-courses');
    cy.contains('Completed').click();
    cy.contains('Upgrade for certificate').click();
    cy.url().should('include', '/my-plan');
  });

  it('should download the certificate when clicking on "Download certificate"', () => {
    cy.visit('/premium-courses');
    cy.contains('Completed').click();
    cy.contains('Download certificate').click();
    cy.readFile('./cypress/downloads/user_Course_Activity_Test_2_2024.pdf').should('exist');
  });

  it('should advise iOS users to download certificates on desktop due to mobile restrictions', () => {
    cy.viewport('iphone-6');
    cy.visit('/premium-courses', {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, 'userAgent', {
          value:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.6312.52 Mobile/15E148 Safari/604.1',
        });
      },
    });
    cy.contains('Completed').click();
    cy.contains('Download the certificate from desktop').should('exist');
    cy.contains('Download certificate').should('not.exist');
  });
});
