describe('LogIn E2E Test', () => {
    before(function () {
        cy.fixture('auth/credentialsLogin').then(function(credentials){
        this.credentials = credentials
        })

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

        cy.get('.credit-box').should('exist')

    })

})
