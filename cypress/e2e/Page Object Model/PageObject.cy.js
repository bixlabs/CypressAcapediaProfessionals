import SignUpPage from '../../pages/SignUpPage'

const signUpPage = new SignUpPage

describe('POM Example', () => {
    beforeEach(() => {
        signUpPage.navigateToSignUp()
    })

    it('There is a button with the text "Login" in the Home', () => {
        signUpPage.loginButton().should('exist')
        signUpPage.loginButton().click()

        cy.get('.lg-2').should('contains.text', 'Welcome back')
    })
})
