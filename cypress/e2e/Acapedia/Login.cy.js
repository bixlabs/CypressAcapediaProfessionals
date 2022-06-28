describe('LogIn E2E Test', () => {
    before(function () {
        cy.fixture('auth/credentials').then(function(testData){
            this.testData = testData
        })

    })

    it('LogIn', function() {
        cy.visit('https://develop-doctors-app.acapedia.com/login')
        cy.getByTestId('email').type("lguedes+01@bixlabs.com")
        cy.getByTestId('password').type("Ab1234567-")

        cy.contains('Log in').click()
        cy.get('.credit-box').should('exist')
    })

})

