////////////////////////////////////////////! PageObject Model ////////////////////////////////////////////////////////
import HelperFunctions from "../support/PageObjectModel/helpers-pom";
const helper = new HelperFunctions();

////////////////////////////////////////! Test Automation Cases //////////////////////////////////////////////////////
describe("Add to Cart", () => {
  // Load fixtures => Runs ONCE before test cases
  before(() => {
    cy.fixture("testData").then(function (data) {
      globalThis.testData = data;
    });
  });

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

  it("[5] Verify price calculation of 2 different products is correct", () => {
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

  it.only("[5] Verify checking out process using cash on delivery is successful", () => {
    helper.login();
    helper.addFirstItemToCart();
    helper.goToCart();
    cy.get("[data-test='proceed-1']").click(); // Click first "Proceed to checkout" button
    cy.get("[data-test='proceed-2']").click(); // Click second "Proceed to checkout" button
    cy.get("[data-test='proceed-3']").click(); // Click third "Proceed to checkout" button
    // Selecting payment method
    cy.get("select#payment-method")
      .select("Cash on Delivery") // Select "Cash on Delivery" option
      .should("have.value", "cash-on-delivery"); // assertion after action

    cy.get("[data-test='finish']").click(); // Click "Confirm" button
  });

  it("[6] Verify checking out process using cash on delivery is successful", () => {
    helper.login();
    helper.addFirstItemToCart();
    helper.goToCart();
    cy.get("[data-test='proceed-1']").click(); // Click first "Proceed to checkout" button
    cy.get("[data-test='proceed-2']").click(); // Click second "Proceed to checkout" button
    cy.get("[data-test='proceed-3']").click(); // Click third "Proceed to checkout" button
    // Selecting payment method
    cy.get("select#payment-method")
      .select("Cash on Delivery") // Select "Cash on Delivery" option
      .should("have.value", "cash-on-delivery"); // assertion after action

    cy.get("[data-test='finish']").click(); // Click "Confirm" button
  });

  it("[7] Verify Hammer filter shows correct products by selecting one randomly", () => {
    // Step 1: Apply Hammer filter
    cy.contains("label", "Hammer")
      .find('input[type="checkbox"]', { timeout: 3000 })
      .check();

    cy.wait(1500);

    // Step 2: Get all the filtered product links
    cy.get(".col-md-9 .container a")
      .should("have.length.greaterThan", 0) // Ensures products are loaded
      .then(($products) => {
        // Step 3: Pick a random product from the filtered results
        const randomIndex = Cypress._.random(0, $products.length - 1);
        const randomProductLink = $products[randomIndex];
        cy.log(`Testing product at index ${randomIndex}`);

        // Step 4: Click the random product.
        cy.wrap(randomProductLink).click();

        // Step 5: Assert category tag contains Hammer
        cy.get("span[aria-label='category']").should("contain.text", "Hammer");
      });
  });

  it("[8] Verify Search functionality works properly", () => {
    // Step 1: Type 'Wood' in search bar
    cy.get("input#search-query").type("Wood");
    cy.get("button[data-test=search-submit]", { timeout: 3000 }).click();
    cy.wait(1500);

    // Step 2: Get all product names and assert each contains 'Wood'
    cy.get("h5[data-test=product-name]")
      .should("have.length.greaterThan", 0) // Make sure results exist
      .each(($products) => {
        cy.wrap($products)
          .invoke("text")
          .then((text) => {
            expect(text.toLowerCase().trim()).to.include("wood");
          });
      });
  });

  it.only("[9] Verify 20% Discount for tool & rental bundle is applied", () => {
    helper.addFirstItemToCart();

    cy.get('[data-test="nav-categories"]', { timeout: 2000 }).click(); // Click on 'Categories' dropdown
    cy.wait(1000);
    cy.contains("Rentals").click(); // Click on 'Rentals'

    cy.get(".card-body").eq(0).click();
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

      // Calculate the total and round it to 2 decimal places
      const calculatedTotal = parseFloat(((p1 + p2) * 0.2).toFixed(2));

      // Assert Displayed cart total = Calculated total with applied 20% Discount
      expect(total).to.eq(calculatedTotal);
    });
  });
});
