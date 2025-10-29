# Linagora-Login-tests

This project automates the login validation test for **Linagora SSO**, verifying that entering an invalid username or password returns a `401 Unauthorized` error.  
The project is built using **Cypress** and follows the **Page Object Model (POM)** architecture for scalability and maintainability.

---

## 📂 Project Structure

```
Linagora-Login-tests/
├── data/                           # Test data files
    └── users.json                  # Sample user credentials for login tests

├── pages/                          # Page Object Model (POM) classes
    ├── base.page.js                # Base page with shared methods (e.g., goto)
    └── login.page.js               # Login page object with locators and actions

├── tests/                          # Main test specifications
    └── login.spec.js               # Example login test using POM
    └── login2.spec.js
    
├── results/                        # Results and Screenshots
     ├── .jsons/                    
     ├── screenshots/

└── support/                        # Import add-on Modules and parallel scripts
    ├── e2e.js
    └── run-parallel.js
```

# Setup
1. Install nodeJS
2. Clone the repository
```
https://github.com/quandinh130696/Cypress-Linagora-Login-tests.git
```
3. run npm install

# Run the tests
```
npm run cypress:test    # Run all specs in tests with a headless mode
npm run parallel        # Run all specs in parallel mode
```

# Test report
results/.jsons/final-report.html

