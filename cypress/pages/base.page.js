export default class BasePage {
    visit(url) {
        cy.visit(url);
    }

    getElement(selector) {
        return cy.xpath(selector);
    }
}