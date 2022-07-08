class SignUpPage {

    //Navigation
    navigateToSignUp() {
        cy.visit('/register')
    }

    //Locators
    loginButton() {
        return cy.contains('Log in').as('Log in button')
    }

    //Actions
    clickLogInButton() {
        this.loginButton.click()
    }

}

export default SignUpPage
