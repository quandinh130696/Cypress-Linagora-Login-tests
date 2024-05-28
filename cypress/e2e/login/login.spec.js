
import usersData from "../../data/users.json";

describe('Login test', function () {
    beforeEach(() => {
        cy.visit('https://sso.linagora.com')
    })

    it('invalid login', function () {
        cy.login(usersData.email, usersData.password);
    })
})