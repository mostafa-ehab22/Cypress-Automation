class HelperFunctions {
  login() {
    cy.get("[data-test='nav-sign-in']").click();
    cy.get("#email").type(globalThis.testData.login.email);
    cy.get("#password").type(globalThis.testData.login.password);
    cy.get(".btnSubmit").click();
  }

  addFirstItemToCart() {
    cy.visit(globalThis.testData.homePage); // Open Product page
    cy.get(".card-img-top").first().click(); // Click on first Product
    cy.get("#btn-add-to-cart").click(); // Add to cart
    cy.wait(3000);
  }

  addFirstItemToFavorites() {
    cy.visit(globalThis.testData.homePage); // Open Product page
    this.login();
    cy.url().should("not.include", "/auth/login"); // Ensure login was completed
    cy.get("[data-test='nav-home']").click(); // Click on Home from navigation tab
    cy.get(".card-img-top").first().click(); // Click on first Product
    cy.get("#btn-add-to-favorites").click(); // Click on Add to Favorites button
  }

  addToCart() {
    cy.get("#btn-add-to-cart").click();
    cy.wait(3000);
  }

  goToCart() {
    cy.get("a[data-test='nav-cart']").click({ force: true });
    cy.wait(1000);
  }

  deleteItem() {
    cy.get("[data-test='nav-menu']").click({ force: true }); // Click on account drop-down
    cy.get("[data-test='nav-my-favorites']").click(); // Click on My Favorites
    cy.get("[data-test='delete']").click(); // Delete item from favorites
  }
}

export default HelperFunctions;
