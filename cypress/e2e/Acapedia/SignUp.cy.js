describe('SignUp E2E Test', () => {
    before(function () {
        cy.visit('/register')

        cy.fixture('auth/credentialsSignup').as('credentials')
    })

    it('SignUp', function() {
        cy.getByTestId('email').type(this.credentials.email)
        cy.getByTestId('password').type(this.credentials.password)

        cy.contains('Sign up').click()

        cy.get('[name=firstName]').type(this.credentials.firstName)
        cy.get('[name=lastName]').type(this.credentials.lastName)
        cy.contains('Continue').click()

        cy.get('#input-67').as('phone')
        cy.get('@phone').type(this.credentials.phoneNumber)
        cy.contains('Send SMS').click()

        cy.intercept({
            method: 'POST',
            url: '/api/register',
        }).as('register')

        cy.getByTestId('phoneCode').first().type('138545')
        cy.get(':nth-child(1) > .actions > :nth-child(1) > .heading').as('continue')
        cy.get('@continue').click()

        cy.wait('@register')
        .its('response.statusCode')
        .should('equal', 200)

        cy.get('.onboarding-panel').should('exist')

    })

})





