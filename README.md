# Acapedia

## How to run tests

### Run the tests by opening the Cypress UI
```
npm cypress open
```
-  Open the Cypress UI with the command
-  Select the E2E Testing option
-  Select the browser
-  Select the Test to run

### Run all tests from the command line
```
npx cypress run
```

### Select the browser to run the tests from the command line
Chrome
```
npm run cy:run:chrome 
```
Firefox
```
npm run cy:run:firefox 
```
Edge
```
npm run cy:run:edge 
```

### Select the test to run from the command line
```
npx cypress run --spec "cypress/e2e/Quizz/TakeQuizz.cy.js" 
```
