class SignUpPage {

    //Navigation
    navigateToSignUp() {
        cy.visit('https://develop-doctors-app.acapedia.com/register')
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
