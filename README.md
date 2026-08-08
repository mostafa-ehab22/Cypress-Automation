<h1 align=center>Cypress Automation</h1>
<br>

<div align=center>
    <span>🍿</span>
<a href="https://youtu.be/jHav5NkRigc" alt="Video Demo">Video Demo</a>
    <span>🍿</span>
</div>

## 🎯 Project Overview
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?logo=javascript&logoColor=black)
![Cypress](https://img.shields.io/badge/Cypress-17202C.svg?logo=cypress)
<br>
End-to-end automated test suite for e-commerce applications built with **Cypress** and the **Page Object Model (POM)** design pattern. Covers critical user journeys including cart management, favorites, checkout flows, and API validations with comprehensive assertions. <br>

## 🎓 Internship Context
Developed during my **Software Testing Internship at <a href="https://brightskiesinc.com/" target="_blank" alt="Brightskies Website">Brightskies</a>  (Summer 2025)**, where I gained hands-on experience in both manual and automated testing methodologies:

### 📝 **Manual Testing**  
- Designed and executed comprehensive test cases using **Qase** test management platform
- Performed exploratory testing to identify edge cases and UI/UX inconsistencies
- Documented test results, tracked defects, and provided actionable feedback to development teams  

### 🤖 **Automation Testing**  
- Built this **Cypress** automated test suite covering core e-commerce workflows
- Implemented **Page Object Model (POM)** design pattern for maintainable, scalable test architecture
- Developed comprehensive test coverage with API intercepts and UI validations

> [!IMPORTANT]
> Manual exploratory testing surfaces what automation misses; regression automation enforces it at scale.

## 🧱 Architecture & Design

### Tech Stack

- **Cypress** → Modern browser automation with network interception and rich testing capabilities
- **JavaScript ES6+** → Clean, maintainable test code
- **Page Object Model (POM)** → Scalable test architecture pattern

### Core Components

- **Page Object Model ```(helpers-pom.js)```:**<br>
All page interactions and reusable methods encapsulated in helper classes.<br>
Keeps test specs clean and focused only on behavior and assertions.
- **Fixtures:**<br>
Centralized test data storage *(URLs, login credentials, user information)* kept separate from test logic
- **Intercepts:**<br>
Monitor and assert API calls *(e.g. adding favorites)* to validate backend responses

### Design Pattern Structure
```
Separation of Concerns
├── 🧪 Test Specs → Behavior & assertions only
├── 🔧 Page Objects → Reusable interaction methods  
├── 📋 Fixtures → Centralized test data
└── 🌐 Intercepts → API monitoring & validation
```
### Benefits:

- ✅ Maintainable - Changes in UI require updates in one place
- ✅ Reusable - Methods shared across multiple test scenarios
- ✅ Readable - Test specs focus on business logic, not implementation

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
   Test validates a **20% discount** is applied on checkout. <br>
   *(Intentionally failing to demonstrate bug detection and reporting capabilities)*
   

## 📂 Project Structure
```
Cypress-Automation/
│
├── 📁 cypress/
│   ├── 📁 e2e/
│   │   └── spec.cy.js                    ⬅️ Test specifications
│   ├── 📁 support/
│   │   └── 📁 PageObjectModel/
│   │       └── helpers-pom.js            ⬅️ Reusable page methods
│   └── 📁 fixtures/
│       └── testData.json                 ⬅️ Test data & configurations
│
├── cypress.config.js                     ⬅️ Cypress configuration
├── package.json                          ⬅️ Dependencies & scripts
└── README.md                             
```

## 🔧 Usage & Setup

### Prerequisites
```bash
Node.js installed (v14+ recommended)
npm or yarn
```
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
## ⛅ Continuous Integration Pipeline (AWS CodeBuild & S3)

This test suite runs through an automated cloud CI pipeline on every push, moving execution off local machines and into **AWS CodeBuild**, with **Amazon S3** handling artifact storage for post-run debugging.

> [!IMPORTANT]
> CodeBuild containers are ephemeral, wiped clean after each run. Artifacts must reach S3 before teardown, or failures leave nothing to debug.

### Pipeline Flow

```
GitHub Push → AWS CodeBuild → Cypress Test Run → Amazon S3 (artifacts) + CloudWatch (logs)
```

### Build Stages

- **Install** → Provisions the Ubuntu build container: OS-level rendering dependencies (`xvfb`, `libgtk`) for headless browser support, plus `npm ci` for a clean, reproducible dependency install
- **Verify** → Confirms the Cypress binary is installed and ready before any test runs
- **Test** → Runs the full Cypress suite headlessly, covering cart flows, checkout, favorites, and API-level intercepts
- **Package** → Captures and uploads screenshots/videos to S3 before container teardown

### 📦 Artifact Management

**Screenshots** `.png` <br>
Captured the instant an assertion fails, useful for catching a missing UI element or an unexpected API error <br>

**Videos** `.mp4` <br>
Full headless recording of the entire spec, from first click to last assertion

> [!IMPORTANT]
Both are archived to S3 automatically, so failures can be reviewed after the fact without needing to reproduce them locally.

## 💻 Code Highlights

### Page Object Model Implementation
```js
// Clean test specification using helper methods
import HelperFunctions from "../support/PageObjectModel/helpers-pom";
const helper = new HelperFunctions();

describe("E-Commerce Test Suite", () => {
  it("[1] Verify adding single item to cart", () => {
    helper.addFirstItemToCart();
    helper.goToCart();
    // Assert cart has quantity of 1
    cy.get("input[data-test='product-quantity']").should("have.value", "1"); 
  });
});
```
### Advanced Cypress Techniques
```js
// Random product selection with dynamic assertions
it("[7] Verify Hammer filter shows correct products by selecting one randomly", () => {
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

        // Step 4: Click the random product.
        cy.wrap(randomProductLink).click();

        // Step 5: Assert category tag contains Hammer
        cy.get("span[aria-label='category']").should("contain.text", "Hammer");
      });
  });
```
### API Intercept & Validation
```js
// Duplicate prevention with comprehensive API validation
it("[4] Verify an item already in favorites is not duplicated when added again", () => {
  // Set up network intercept to capture the favorites API call
  cy.intercept("POST", "**/favorites").as("addToFavorites");
  
  // Add item to favorites list for first time
  helper.addFirstItemToFavorites();
  
  // Try to add the same item again -> should return 422 with duplicate message
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
```
---
## 🤝 Contribution
Feel free to open issues or submit PRs for new test cases or improvements!
This project is perfect for anyone wanting to learn Cypress best practices and POM design.
