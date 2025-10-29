import BasePage from './base.page';

export default class LoginPage extends BasePage {
    usernameField = "//input[@id='userfield']";
    passwordField = "//input[@id='passwordfield']";
    loginBtn = "//button[@id='sign_in_button']";
    loginMsg = "//div[@class='a-form-explain']//span";

    login(username, password) {
        // Enter a username at this step
        this.getElement(this.usernameField)
            .type(username)
            .should('have.value', username)

        // Enter a password at this step
        this.getElement(this.passwordField)
            .type(password)
            .should('have.value', password)

        // Proceed to login to account
        this.getElement(this.loginBtn).click()
    }

    verifyErrorMessage(text) {
        // Invalid msg is visible
        var  text = "Wrong credentials"
        this.getElement(this.loginMsg)
            .contains(text)
        cy.screenshot()
    }
}