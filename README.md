<h1 align=center>Cypress Automation</h1>
<br>

<div align=center>
    <span>🍿</span>
<a href="https://youtu.be/jHav5NkRigc" alt="Video Demo">Video Demo</a>
    <span>🍿</span>
</div>

# 🎯 Project Overview

**Cypress automated test suite** for an e-commerce website, built using the **Page Object Model (POM)** design pattern for clean, reusable, and maintainable test code.
It covers common user flows like adding items to the cart, managing favorites, and verifying UI/API behavior with real assertions. <br>


## 🎓 Internship Context
*Developed as part of my **Software Testing Internship at Brightskies (2025)**. During the internship, I contributed to both **manual testing and automation**:*

- 📝 **Manual Testing with Qase**  
  Designed and executed manual test cases to validate user flows, edge cases, and UI/UX consistency.  
  Documented results, tracked bugs, and provided actionable feedback to improve product quality.  

- 🤖 **Automation Testing with Cypress**  
  Built an automated test suite for core e-commerce features using Cypress and the **Page Object Model (POM)** design pattern, ensuring clean, reusable, and maintainable test code.  

This hybrid approach showcased the value of combining **manual exploratory testing** with **automated regression coverage** to deliver reliable, high-quality software.



## 🧱 Architecture & Design

- **Cypress:**  
  Utilized for browser automation, network interception, and rich testing capabilities.
  
- **Page Object Model (POM) Design Pattern:**  
  All page interactions and reusable methods are encapsulated inside helper classes (`helpers-pom.js`).  
  This keeps test specs clean and focused only on behavior and assertions.

- **Fixtures:**  
  Centralized test data storage *(URLs, login credentials, user information)* kept separate from test logic.

- **Intercepts:**  
  Monitor and assert API calls *(e.g. adding favorites)* to validate backend responses.

## ⚙️ Features Tested

1. 🛒 **Add single item to cart**  
   Verifies item quantity in cart is correct.  

2. 🛍️ **Add multiple different items to cart**  
   Ensures cart counter reflects multiple products correctly.  

3. ⭐ **Add item to favorites list**  
   Validates item appears in favorites and allows deletion.  

4. 🚫 **Prevent duplicate favorites**  
   Confirms backend returns `422` status when adding the same favorite twice and verifies error message.  

5. 💰 **Verify price calculation for multiple products**  
   Ensures displayed cart total equals the sum of individual product prices.  

6. 💳 **Checkout with Cash on Delivery**  
   Validates end-to-end checkout flow by selecting `Cash on Delivery` as payment method and confirming successful order placement.

7. 🔨 **Filter by "Hammer" category**  
   Confirms applying the `Hammer` filter shows only relevant products.  

8. 🔍 **Search functionality**  
   Ensures search results display products matching the search keyword.  

9. 🏷️❌ **Discount on "Tool & Rental" Bundle**  
   Test validates a **20% discount** is applied. <br>
   *(Intentionally set higher than actual to demonstrate failure reporting and debugging workflows using cypress)*
   

## 📂 Folder Structure
```
cypress/
├── e2e/
│     └── spec.cy.js              ⬅️ Test spec file with described tests
├── support/
│     └── PageObjectModel/
│           └── helpers-pom.js    ⬅️ Helper class with reusable methods
├── fixtures/
│     └── testData.json           ⬅️ Test data 
.gitignore
cypress.config.js
package.json
README.md
```

## 🔧 Usage & Setup

### Prerequisites

- Node.js installed (v14+ recommended)
- npm or yarn

### Installation

```bash
git clone <repo-url>
cd <project-folder>
npm install
```

### Running Tests
Launch Cypress Test Runner:
```
npx cypress open
```

Or run headless tests:
```
npx cypress run
```

---
### 🧑‍💻 Key Code Snippets

```js
// Using the HelperFunctions class => POM Design Pattern
import HelperFunctions from "../support/PageObjectModel/helpers-pom";
const helper = new HelperFunctions();


describe("Tool Shop Website", () => {
  //////// Simple helper method usage ////////
  it("[1] Verify adding single item to cart", () => {
    helper.addFirstItemToCart();
    helper.goToCart();
    cy.get("input[data-test='product-quantity']").should("have.value", "1");
  });

  //////// Advanced Cypress techniques with random selection ////////
  it("[7] Verify 'Hammer' filter shows correct products by selecting one randomly", () => {
    // Step 1: Apply Hammer filter
    cy.contains("label", "Hammer")
      .find('input[type="checkbox"]', { timeout: 3000 })
      .check();

    // Step 2: Get all the filtered product links
    cy.get(".col-md-9 .container a")
      .should("have.length.greaterThan", 0) // Ensures products are loaded
      .then(($products) => {

        // Step 3: Pick a random product from the filtered results
        const randomIndex = Cypress._.random(0, $products.length - 1);
        const randomProductLink = $products[randomIndex];
        cy.log(`Testing product at index ${randomIndex}`);

        // Step 4: Click the random product
        cy.wrap(randomProductLink).click();

        // Step 5: Assert category tag contains Hammer
        cy.get("span[aria-label='category']").should("contain.text", "Hammer");
      });
  });

  // Additional test cases follow a similar approach...

});
```

### 🤝 Contribution
Feel free to open issues or submit PRs for new test cases or improvements!
This project is perfect for anyone wanting to learn Cypress best practices and POM design.
