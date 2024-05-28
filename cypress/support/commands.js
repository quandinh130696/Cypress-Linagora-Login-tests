const loginObs = require('../objects/loginPage.json')
require('@cypress/xpath');

Cypress.Commands.add("invalidLogin", (username, password) => {
    
    // Enter a username at this step
    cy.xpath(loginObs.userfield)
        .type(username)
        .should('have.value', username)

    // Enter a password at this step
    cy.xpath(loginObs.passwordfield)
        .type(password)
        .should('have.value', password)

    // Proceed to login to account
    cy.xpath(loginObs.loginBtn).click()

    // Invalid msg is visible
    cy.xpath(loginObs.loginMsg)
    cy.contains('Wrong credentials')
    cy.screenshot()
})