// Test Suite for Validating Copy on Transcript Page for Different User Types
// https://app.clickup.com/t/8687rxezx

describe(
  'Transcript Page Copy Validation for Different User Types - Task 8687rxezx',
  { tags: ['@transcript', '@regression', '@business:low-impact', '@low-likely'] },
  () => {
    beforeEach(() => {
      cy.fixture('/auth/credentialsLogin').then((credentials) => {
        cy.loginAccount(credentials);
      });
    });

    describe('When User is on a Free Plan', () => {
      it('should display the correct message for users without pending credits', () => {
        cy.visit('/transcripts');
        cy.contains('Free plan');
        cy.contains(
          'The free plan starts with 5 free credits. You can earn additional free credits up to a maximum of 20 credits by making referrals. For each successful referral, you will earn an additional 5 free credits. ',
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

        cy.wait('@user');

        cy.contains('Free plan');
        cy.contains(
          'You’ve hit your credit limit. You can get up to 20 credits with the Free plan through referrals, or you can upgrade your plan.',
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

        cy.wait('@user');

        cy.contains('Free plan');
        cy.contains(
          'You have reached the limit of 20 total credits on the Free plan. To enable access to more credits, upgrade to the Pro Plan.',
        );
      });
    });

    describe('When User is on a Standard Plan', () => {
      it('should show available credits for users without pending credits', () => {
        cy.intercept('/api/subscription/user', (req) => {
          req.continue((res) => {
            res.body.hasActivePaidSubscription = true;
            res.body.planName = 'Pro';
            res.body.status = 'active';
            res.body.endAt = '2030/03/12';
          });
        }).as('user');

        cy.visit('/transcripts');

        cy.wait('@user');

        cy.contains('Pro');
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
            res.body.planName = 'Pro';
            res.body.status = 'active';
            res.body.endAt = '2030/03/12';
          });
        }).as('user');

        cy.visit('/transcripts');

        cy.wait('@user');

        cy.get('h2.text-warning').contains('Pro').should('exist');
        cy.contains('You have reached the limit of 50 credits for this academic year.');
      });
    });
  },
);
