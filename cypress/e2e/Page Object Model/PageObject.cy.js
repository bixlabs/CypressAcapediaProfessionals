import AcapediaSignUpPage from '../../pages/AcapediaSignUp'

const signUp = new AcapediaSignUpPage

describe('POM Example', () => {
    beforeEach(() => {
        signUp.navigateToSignUp()
    })

    it('There is a button with the text "Login" in the Home', () => {
        signUp.loginButton().should('exist')
        signUp.loginButton().click()

        cy.get('.lg-2').should('contains.text', 'Welcome back')
    })
})