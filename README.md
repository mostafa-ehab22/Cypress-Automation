# 🎯 Project Overview

**Cypress automated test suite** for an e-commerce website, built using the **Page Object Model (POM)** design pattern for clean, reusable, and maintainable test code.
It covers common user flows like adding items to the cart, managing favorites, and verifying UI/API behavior with real assertions.

## 🧱 Architecture & Design

- **Page Object Model (POM):**  
  All page interactions and reusable methods are encapsulated inside helper classes (`helpers-pom.js`).  
  This keeps test specs clean and focused only on behavior and assertions.

- **Cypress:**  
  Utilized for browser automation, network interception, and rich testing capabilities.

- **Fixtures & Intercepts:**  
  Uses Cypress intercepts for monitoring API calls (e.g. adding favorites) to assert backend responses.

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

7. 🔨 **Filter by category (Hammer)**  
   Confirms applying the `Hammer` filter shows only relevant products.  

8. 🔍 **Search functionality**  
   Ensures search results display products matching the search keyword.  

9. 🏷️ **Discount on Tool & Rental Bundle**  
   Test validates a **20% discount** is applied (intentionally set higher than actual to demonstrate failure reporting and debugging workflows).
   

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
// Using the HelperFunctions class
import HelperFunctions from "../support/PageObjectModel/helpers-pom";
const helper = new HelperFunctions();

describe("Add to Cart", () => {
  it("[1] Verify adding single item to cart", () => {
    helper.addFirstItemToCart();
    helper.goToCart();
    cy.get("input[data-test='product-quantity']").should("have.value", "1");
  });

  // Additional tests follow similar pattern...
});
```

### 🤝 Contribution
Feel free to open issues or submit PRs for new test cases or improvements!
This project is perfect for anyone wanting to learn Cypress best practices and POM design.
