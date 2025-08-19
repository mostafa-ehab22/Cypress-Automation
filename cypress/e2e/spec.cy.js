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
    cy.get(".quantity").eq(0).should("have.value", "1"); // Get first product's quantity entry field
    cy.get(".quantity").eq(1).should("have.value", "1"); // Get second product's quantity entry field
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

  it.only("[5] Verify price calculation of 2 different products is correct", () => {
    helper.addFirstItemToCart();
    cy.get(".st3").first().click({ force: true }); // Go back to product page
    cy.get(".card-img-top").last().should("be.visible").click(); // Click on last Product
    helper.addToCart();
    helper.goToCart();

    // Extracting prices of the 2 products & their total
    cy.get('[data-test="product-price"]').eq(0).invoke("text").as("price1");
    cy.get('[data-test="product-price"]').eq(1).invoke("text").as("price2");
    cy.get('[data-test="cart-total"]').invoke("text").as("cartTotal");

    // Parse prices from string => number
    cy.then(function () {
      const p1 = parseFloat(this.price1.replace("$", ""));
      const p2 = parseFloat(this.price2.replace("$", ""));
      const total = parseFloat(this.cartTotal.replace("$", ""));
      // Assert displayed cart total equals calculated total
      expect(total).to.eq(p1 + p2);
    });
  });
});
