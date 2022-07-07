describe('LogIn E2E Test', () => {
    before(function () {
        cy.fixture('auth/credentials').as('credentials')
        })

    })

    it('LogIn', function() {
        cy.visit('/login')
        cy.getByTestId('email').type("lguedes+03@bixlabs.com")
        cy.getByTestId('password').type("Ab1234567-")

        cy.contains('Log in').click()
        cy.get('.credit-box').should('exist')
    })

})

