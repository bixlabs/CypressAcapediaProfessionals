import { faker } from '@faker-js/faker';

describe('Paid referred E2E Test', { tags: ['@referral', '@paid-plan', '@low-likely', '@business:low-impact'] }, () => {

  beforeEach(function () {
    cy.deleteTestingReferrals();
    cy.visit('/register');

    cy.fixture('Referrals/credentials').as('credentials');
  });

  it(`SignUp Paid referred and make Paid referrer`, function () {

    // Referred side

    const email = this.credentials.paidReferred.email;
    const password = this.credentials.paidReferred.password;
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    let referredUrl = null;

    cy.getByTestId('email').type(email);
    cy.getByTestId('password').type(password);

    cy.contains('Sign up').click();
    cy.get('[name=firstName]').type(firstName);
    cy.get('[name=lastName]').type(lastName);
    cy.get('[name=degree]').parent().click();
    cy.contains('P.A.').click();

    cy.contains('Continue').click();

    cy.intercept({
      method: 'GET',
      url: '/api/feed/onboarding',
    }).as('onboarding');

    cy.wait('@onboarding').then( ()=> {
      cy.get('.onboarding-panel').should('exist');
      cy.getByTestId('goToFeedOnboardingBtn').click({ timeout: 15000 });
      cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');
    });

    // go to the plan page and purchased a plan and then copy the referral link
    cy.visit('/my-plan');

    cy.contains('Upgrade plan').click();
    cy.contains('Upgrade to Pro').click();

    cy.intercept({
      method: 'GET',
      url: '/api/subscription/payment-intent',
    }).as('formCheckout');

    cy.wait('@formCheckout').then( ()=> {

      cy.get('#chn').type('John Doe');
      cy.get('#card-holder-address').type('123 Main St');
      cy.get('#card-holder-city').type('New York');
      cy.get('#card-holder-state').type('NY');
      cy.get('#card-holder-postalcode').type('10001');
      cy.getWithinIframe('[name="number"]').type('4242424242424242');
      cy.getWithinIframe('[name="expiry"]').type('1235');
      cy.getWithinIframe('[name="cvc"]').type('244');

      cy.contains('Confirm payment').click();
    });

    cy.intercept({
      method: 'GET',
      url: '/api/subscription/user',
    }).as('updatedSubscription');

    cy.wait('@updatedSubscription').then( (interception)=> {
      const response = interception.response.body;
      const hasActivePaidSubscription = response.hasActivePaidSubscription;
      const planName = response.planName;

      expect(hasActivePaidSubscription).to.equal(true);
      expect(planName).to.equal('Pro');
    });

    cy.contains('Make a paid referral').should('exist');

    cy.get(`[data-test-id="makeAReferralUrl"]`, { timeout: 15000, force: true })
    .invoke('text')
    .then((text) => {
      referredUrl = text;
      cy.log(referredUrl);
    });

    cy.intercept({
      method: 'GET',
      url: '/api/feed/popular?sort=newest',
    }).as('feed');

    cy.visit('/');

    cy.wait('@feed').then( ()=> {

      // Simply to grab the menu options when they are visible or hidden (mobile version)
      cy.get('body').then(($body) => {
        if ($body.find(':contains("Account")').is(':visible')) {
          cy.contains('Logout').click();
          cy.visit('/');
        } else {
          cy.getByTestId('menu-drawer-btn').click();
          cy.contains('Logout').click();
          cy.visit('/');
        }
      });

      cy.log(referredUrl);

      const url = new URL(referredUrl);
      const pathWithQuery = url.pathname + url.search;
      cy.visit(pathWithQuery);
    });

    // Referrer side

    const emailReferrer = this.credentials.paidReferrer.email;
    const passwordReferrer = this.credentials.paidReferrer.password;
    const firstNameReferrer = faker.person.firstName();
    const lastNameReferrer = faker.person.lastName();

    cy.getByTestId('email').type(emailReferrer);
    cy.getByTestId('password').type(passwordReferrer);

    cy.contains('Sign up').click();
    cy.get('[name=firstName]').type(firstNameReferrer);
    cy.get('[name=lastName]').type(lastNameReferrer);
    cy.get('[name=degree]').parent().click();
    cy.contains('P.A.').click();

    cy.contains('Continue').click();

    cy.intercept({
      method: 'GET',
      url: '/api/feed/onboarding',
    }).as('onboarding');

    cy.wait('@onboarding').then( ()=> {
      cy.get('.onboarding-panel').should('exist');
      cy.getByTestId('goToFeedOnboardingBtn').click({ timeout: 15000 });
      cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');
    });

    // go to the plan page and purchased a plan and to gift discount to its referred
    cy.visit('/my-plan');

    cy.contains('Upgrade plan').click();
    cy.contains('Upgrade to Pro').click();

    cy.intercept({
      method: 'GET',
      url: '/api/subscription/payment-intent',
    }).as('formCheckout2');

    cy.wait('@formCheckout2').then( ()=> {

      cy.get('#chn').type('John Doe');
      cy.get('#card-holder-address').type('123 Main St');
      cy.get('#card-holder-city').type('New York');
      cy.get('#card-holder-state').type('NY');
      cy.get('#card-holder-postalcode').type('10001');
      cy.getWithinIframe('[name="number"]').type('4242424242424242');
      cy.getWithinIframe('[name="expiry"]').type('1235');
      cy.getWithinIframe('[name="cvc"]').type('244');

      cy.contains('Confirm payment').click();
    });

    cy.intercept({
      method: 'GET',
      url: '/api/subscription/user',
    }).as('updatedSubscription2');

    cy.wait('@updatedSubscription2').then( (interception)=> {
      const response = interception.response.body;
      const hasActivePaidSubscription = response.hasActivePaidSubscription;
      const planName = response.planName;

      expect(hasActivePaidSubscription).to.equal(true);
      expect(planName).to.equal('Pro');
    });

    cy.intercept({
      method: 'GET',
      url: '/api/feed/popular?sort=newest',
    }).as('feedSecond');

    cy.visit('/');

    cy.intercept({
      method: 'POST',
      url: '/api/logout',
    }).as('logout');

    cy.wait('@feedSecond').then( ()=> {

      // Simply to grab the menu options when they are visible or hidden (mobile version)
      cy.get('body').then(($body) => {

        if ($body.find(':contains("Account")').is(':visible')) {
          cy.contains('Logout').click();
        } else {
          cy.getByTestId('menu-drawer-btn').click();
          cy.contains('Logout').click();
        }
      });
    });

    cy.intercept({
      method: 'POST',
      url: '/api/login',
    }).as('login');

    // Back to referred
    cy.wait('@logout').then( ()=> {

      cy.getByTestId('email').type(email);
      cy.getByTestId('password').type(password);

      cy.contains('Log in').click();
    });

    cy.wait('@login').then( ()=> {

      cy.intercept({
        method: 'GET',
        url: '/api/user/referrals/list',
      }).as('referralsList');

      cy.visit('/referrals');

      cy.wait('@referralsList').then( ()=> {
        cy.getByTestId('referralStatus')
        .eq(0)
        .contains('Success');
  
        cy.contains('Total saved via referrals').should('exist');
      });
    });

  });
});
