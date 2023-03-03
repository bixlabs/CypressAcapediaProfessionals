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
        cy.get(('.v-select__selections')).as('degree').click()
        cy.contains('M.D').click()
        cy.contains('Continue').click()

        cy.get('.text-left > .v-text-field--single-line > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections').as('selectMedicalBoard').click()
        cy.contains('American Board of Anesthesia').click()
        cy.get('#boardId').type('123456')
        cy.get('#input-90').as('dateBirth').click()
        cy.contains('28').click()
        cy.get('.v-window-item--active > .mt-5 > :nth-child(1) > :nth-child(1) > :nth-child(2) > .container-actions > :nth-child(1) > .heading').as('Continue').click()

        cy.get('#input-122').as('phone')
        cy.get('@phone').type(this.credentials.phoneNumber)
        cy.contains('Send SMS').click()

        cy.intercept({
            method: 'POST',
            url: '/api/register',
        }).as('register')

        cy.getByTestId('phoneCode').first().type('720021')
        cy.get(':nth-child(3) > .row > .container-actions > :nth-child(1) > .heading').as('continue')
        cy.get('@continue').click()

        cy.wait('@register')
        .its('response.statusCode')
        .should('equal', 200)

        cy.get('.onboarding-panel').should('exist')

    })

})





