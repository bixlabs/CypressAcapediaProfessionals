// Test Suite for Validating Copy on Transcript Page for Different User Types
// https://app.clickup.com/t/8687rxezx

describe('Transcript Page Copy Validation for Different User Types - Task 8687rxezx', () => {
  beforeEach(() => {
    cy.fixture('/auth/credentialsLogin').then((credentials) => {
      cy.loginAccount(credentials);
    });
  });

  describe('When User is on a Free Plan', () => {
    it('should display the correct message for users without pending credits', () => {
      cy.visit('/transcripts');
      cy.contains('Free Trial');
      cy.contains(
        ' Free trials start with 5 FREE credits. You can earn additional FREE credits up to a maximum of 20 credits by making referrals. For each successful referral, you will earn an additional 5 FREE credits. ',
      );
    });

    it('should inform users with available referrals but pending credits to refer more for extra credits', () => {
      cy.intercept('/api/user', (req) => {
        req.continue((res) => {
          // less than the referral limit (20)
          res.body.awardedCredits = 10;
          res.body.unawardedCredits = 5;
        });
      }).as('user');

      cy.visit('/transcripts');
      cy.contains('Free Trial');
      cy.contains(
        'You’ve hit your credit limit. You can get up to 20 credits with the Free Trial through referrals, or you can upgrade your plan.',
      );
    });

    it('should advise users with no referrals left to upgrade for more credits', () => {
      cy.intercept('/api/user', (req) => {
        req.continue((res) => {
          // more than the referral limit (20)
          res.body.awardedCredits = 23;
          res.body.unawardedCredits = 10;
        });
      }).as('user');

      cy.visit('/transcripts');
      cy.contains('Free Trial');
      cy.contains(
        'You have reached the limit of 20 total credits on the Free Trial. To enable access to more credits, upgrade to the Standard Plan.',
      );
    });
  });

  describe('When User is on a Standard Plan', () => {
    it('should show available credits for users without pending credits', () => {
      cy.intercept('/api/subscription/user', (req) => {
        req.continue((res) => {
          res.body.hasActivePaidSubscription = true;
          res.body.planName = 'Standard';
          res.body.status = 'active';
          res.body.endAt = '2030/03/12';
        });
      }).as('user');

      cy.visit('/transcripts');
      cy.contains('Standard');
      cy.contains('Up to 50 CME credits until Mar 12, 2030');
    });

    it('alert users who have reached their credit limits to upgrade for more', () => {
      cy.intercept('/api/user', (req) => {
        req.continue((res) => {
          res.body.awardedCredits = 46;
          res.body.unawardedCredits = 5;
        });
      }).as('user');

      cy.intercept('/api/subscription/user', (req) => {
        req.continue((res) => {
          res.body.hasActivePaidSubscription = true;
          res.body.planName = 'Standard';
          res.body.status = 'active';
          res.body.endAt = '2030/03/12';
        });
      }).as('user');

      cy.visit('/transcripts');
      cy.get('h2.warning--text').contains('Standard').should('exist');
      cy.contains(
        'You have reached the limit of 50 credits for this academic year. To enable access to more credits, upgrade to the Professional Plan.',
      );
    });
  });

  describe('When User is on a Professional Plan', () => {
    it('should indicate the total available credits for users without pending credits', () => {
      cy.intercept('/api/subscription/user', (req) => {
        req.continue((res) => {
          res.body.hasActivePaidSubscription = true;
          res.body.planName = 'Professional';
          res.body.status = 'active';
          res.body.endAt = '2032/03/12';
        });
      }).as('user');

      cy.visit('/transcripts');
      cy.contains('Professional');
      cy.contains('Up to 100 CME credits until Mar 12, 2032');
    });

    it('should notify users at their credit cap that they have reached the annual limit', () => {
      cy.intercept('/api/user', (req) => {
        req.continue((res) => {
          res.body.awardedCredits = 97;
          res.body.unawardedCredits = 5;
        });
      }).as('user');

      cy.intercept('/api/subscription/user', (req) => {
        req.continue((res) => {
          res.body.hasActivePaidSubscription = true;
          res.body.planName = 'Professional';
          res.body.status = 'active';
          res.body.endAt = '2032/03/12';
        });
      }).as('user');

      cy.visit('/transcripts');
      cy.get('h2.warning--text').contains('Professional').should('exist');
      cy.contains('You have reached the limit of 100 credits for this academic year.');
    });
  });
});
