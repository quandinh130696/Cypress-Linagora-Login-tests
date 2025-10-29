
import usersData from "../data/users.json";
import LoginPage from '../pages/login.page';

const loginPage = new LoginPage();

describe('Login test with invalid user', function () {
    beforeEach(() => {
        loginPage.visit('/login')
    })

    it('input login information and verify message', function () {
        // Step 1: input login information
        loginPage.login(usersData.email, usersData.password);
    
        // Step 2: verify message
        loginPage.verifyErrorMessage()
    })
})