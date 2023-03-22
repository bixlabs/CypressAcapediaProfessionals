# Acapedia

## How to run the tests

### #1 Run the tests by opening the Cypress UI
-  Open the Cypress UI with the command:
```
npx cypress open
```
-  Select the E2E Testing option
-  Select the browser
-  Select the Test to run

### #2 Run all tests from the command line
```
npx cypress run
```
### #3 Select the test to run from the command line
```
npx cypress run --spec "cypress/e2e/Quizz/TakeQuizz.cy.js" 
```
### #4 Select the browser to run the tests from the command line
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
