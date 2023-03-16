describe('LogIn E2E Test', () => {
    before(function () {
        cy.fixture('auth/credentialsLogin').as('credentials')
    })

    it('LogIn', function() {
        cy.visit('/login')
        cy.getByTestId('email').type(this.credentials.email)
        cy.getByTestId('password').type(this.credentials.password)

        cy.intercept({
            method: 'POST',
            url: '/login',
        }).as('login')

        cy.contains('Log in').click()

        cy.wait('@login')
        .its('response.statusCode')
        .should('equal', 200)

        // TODO: we need a test-id here as we cannot get it by text value
        cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist')

    })

})
