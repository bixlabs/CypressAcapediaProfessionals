Cypress.Commands.add('registerAccount', ({ 
    email = 'lguedes+600@bixlabs.com', 
    password = 'Ab1234567-', 
    firstName = 'Leonardo', 
    lastName = 'Guedes' 
    } = {}) => {

        cy.visit('https://develop-doctors-app.acapedia.com/register')
        cy.getByTestId('email').type(email)
        cy.getByTestId('password').type(password)

        cy.contains('Sign up').click()

        cy.get('[name=firstName]').type(firstName)
        cy.get('[name=lastName]').type(lastName)
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

Cypress.Commands.add('loginAccount', () => {
    cy.visit('https://develop-doctors-app.acapedia.com/login')
    cy.getByTestId('email').type("lguedes+01@bixlabs.com")
    cy.getByTestId('password').type("Ab1234567-")
    cy.contains('Log in').click()
    cy.get('.credit-box').should('exist')
})
