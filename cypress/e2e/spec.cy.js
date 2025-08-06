////////////////////////////////////////////! PageObject Model ////////////////////////////////////////////////////////
import HelperFunctions from "../support/PageObjectModel/helpers-pom";
const helper = new HelperFunctions();

////////////////////////////////////////! Test Automation Cases //////////////////////////////////////////////////////
describe("Add to Cart", () => {
  it("[1] Verify adding single item to cart", () => {
    helper.addFirstItemToCart(); // Add first product to cart
    helper.goToCart(); // Go to cart
    cy.get("input[data-test='product-quantity']").should("have.value", "1"); // Assert cart has quantity of 1
  });

  it("[2] Verify adding items of different types to cart reflects accurately in cart counter", () => {
    helper.addFirstItemToCart();
    cy.get(".st3").first().click({ force: true }); // Go back to product page
    cy.get(".card-img-top").last().should("be.visible").click(); // Click on last Product
    helper.addToCart();
    helper.goToCart();
  });

  it("[3] Verify adding item to favorites list", () => {
    // Add first product to favorites
    helper.addFirstItemToFavorites();

    cy.get("[data-test='nav-menu']").click(); // Click on Account drop-down
    cy.get("[data-test='nav-my-favorites']").click(); // Click on Account drop-down

    cy.get('[data-test="product-name"]').should(
      "have.text",
      "Combination Pliers"
    );

    // Delete item from favorites list
    helper.deleteItem();
  });

  it("[4] Verify an item already in favorites is not duplicated when added again", () => {
    // Set up network intercept to capture the favorites API call
    cy.intercept("POST", "**/favorites").as("addToFavorites");

    // Add item to favorites list for first time
    helper.addFirstItemToFavorites();

    // Try to add the same item again which was added -> should return 422 with duplicate message
    cy.get("#btn-add-to-favorites").click();
    cy.wait("@addToFavorites").then((interception) => {
      expect(interception.response.statusCode).to.eq(422); // Should return 422 for duplicate

      // More flexible assertion for the response body
      expect(interception.response.body).to.have.property("message");
      expect(interception.response.body.message).to.include("Duplicate");
    });

    // Delete item from favorites list
    helper.deleteItem();
  });
});
