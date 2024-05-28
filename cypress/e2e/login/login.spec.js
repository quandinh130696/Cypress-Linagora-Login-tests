
import usersData from "../../data/users.json";

describe('Login test with invalid user', function () {
    beforeEach(() => {
        cy.visit('https://sso.linagora.com')
    })

    it('invalid login', function () {
        cy.invalidLogin(usersData.email, usersData.password);
    })
})