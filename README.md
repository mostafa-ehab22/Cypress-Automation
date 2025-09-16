<h1 align=center>Cypress Automation</h1>
<br>

<div align=center>
    <span>🍿</span>
<a href="https://youtu.be/jHav5NkRigc" alt="Video Demo">Video Demo</a>
    <span>🍿</span>
</div>

## 🎯 Project Overview

**Cypress automated test suite** for an e-commerce website, built using the **Page Object Model (POM)** design pattern for clean, reusable, and maintainable test code.
It covers common user flows like adding items to the cart, managing favorites, and verifying UI/API behavior with real assertions. <br>


## 🎓 Internship Context
*Developed during my Software Testing Internship at Brightskies (2025), where I gained hands-on experience in both manual and automated testing methodologies:*

### 📝 **Manual Testing with Qase**  
- 📝 Designed and executed comprehensive test cases using Qase test management platform
- 🔍 Performed exploratory testing to identify edge cases and UI/UX inconsistencies
- 📊 Documented test results, tracked defects, and provided actionable feedback to development teams  

### 🤖 **Automation Testing with Cypress**  
- 🤖 Built this automated test suite covering core e-commerce workflows
- 🏗️ Implemented Page Object Model (POM) design pattern for maintainable, scalable test architecture
- ⚡ Developed comprehensive test coverage with API intercepts and UI validations

*This project demonstrates the strategic value of combining manual exploratory testing with automated regression coverage to ensure comprehensive quality assurance.*

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
   Confirms applying the `Hammer` filter shows only relevant products by selecting one randomly.

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
## 💻 Code Highlights

### Page Object Model Implementation
```js
// Clean test specification using helper methods
import HelperFunctions from "../support/PageObjectModel/helpers-pom";
const helper = new HelperFunctions();

describe("E-Commerce Test Suite", () => {
  it("Verify cart functionality", () => {
    helper.addFirstItemToCart();
    helper.goToCart();
    cy.get("input[data-test='product-quantity']").should("have.value", "1");
  });
});
```
### Advanced Cypress Techniques
```js
// Random product selection with dynamic assertions
it("Validate filter accuracy with random selection", () => {
  cy.contains("label", "Hammer")
    .find('input[type="checkbox"]')
    .check();

  cy.get(".col-md-9 .container a")
    .should("have.length.greaterThan", 0)
    .then(($products) => {
      const randomIndex = Cypress._.random(0, $products.length - 1);
      cy.wrap($products[randomIndex]).click();
      cy.get("span[aria-label='category']").should("contain.text", "Hammer");
    });
});
```

### 🤝 Contribution
Feel free to open issues or submit PRs for new test cases or improvements!
This project is perfect for anyone wanting to learn Cypress best practices and POM design.
