describe('SignUp E2E Test', () => {
    before(function () {
        cy.visit('https://develop-doctors-app.acapedia.com/register')

        cy.fixture('auth/credentials').then(function(testData){
            this.testData = testData
        })

    })

    it('SignUp', function() {
        cy.getByTestId('email').type(this.testData.email)
        cy.getByTestId('password').type(this.testData.password)

        cy.contains('Sign up').click()

        cy.get('[name=firstName]').type("Leonardo")
        cy.get('[name=lastName]').type("Guedes")
        cy.contains('Continue').click()

        cy.get('#input-66').as('phone')
        cy.get('@phone').type('5612023378')
        cy.contains('Send SMS').click()

        cy.intercept({
            method: 'POST',
            url: '/api/register',
        }).as('register')

        cy.getByTestId('phoneCode').first().type('375736')
        cy.get(':nth-child(1) > .actions > :nth-child(1) > .heading').as('continue')
        cy.get('@continue').click()

        cy.wait('@register')
        .its('response.statusCode')
        .should('equal', 200)

        cy.get('.onboarding-panel').should('exist')

    })



})

