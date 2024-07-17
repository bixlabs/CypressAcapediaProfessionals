import { faker } from '@faker-js/faker';

describe('Free referred E2E Test', () => {

  beforeEach(function () {
    cy.deleteTestingReferrals();
    cy.visit('/register');

    cy.fixture('Referrals/credentials').as('credentials');
  });

  it(`SignUp Free referred and make Free referrer`, function () {

    // Referred side

    const email = this.credentials.freeReferred.email;
    const password = this.credentials.freeReferred.password;
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    let referredUrl = null;

    cy.getByTestId('email').type(email);
    cy.getByTestId('password').type(password);

    cy.contains('Sign up').click();
    cy.get('[name=firstName]').type(firstName);
    cy.get('[name=lastName]').type(lastName);
    cy.get('[name=degree]').parent().click();
    cy.contains('P.A.').click();

    cy.contains('Continue').click();

    cy.intercept({
      method: 'GET',
      url: '/api/feed/onboarding',
    }).as('onboarding');

    cy.wait('@onboarding').then( ()=> {
      cy.get('.onboarding-panel').should('exist');
      cy.getByTestId('goToFeedOnboardingBtn').click();
      cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');
    });

    // go to the referral page and click make referral button, grab that link and make a referrer
    cy.visit('/my-plan');
    cy.contains('Make a referral').should('exist');

    cy.get(`[data-test-id="makeAReferralUrl"]`, { timeout: 15000, force: true })
    .invoke('text')
    .then((text) => {
      referredUrl = text;
      cy.log(referredUrl);
    });

    cy.intercept({
      method: 'GET',
      url: '/api/feed/popular?sort=newest',
    }).as('feed');

    cy.visit('/');

    cy.wait('@feed').then( ()=> {

      // Simply to grab the menu options when they are visible or hidden (mobile version)
      cy.get('body').then(($body) => {
        if ($body.find(':contains("Account")').is(':visible')) {
          cy.contains('Logout').click();
          cy.visit('/');
        } else {
          cy.getByTestId('menu-drawer-btn').click();
          cy.contains('Logout').click();
          cy.visit('/');
        }
      });

      cy.log(referredUrl);

      const url = new URL(referredUrl);
      const pathWithQuery = url.pathname + url.search;
      cy.visit(pathWithQuery);
    });

    // Referrer side

    const emailReferrer = this.credentials.freeReferrer.email;
    const passwordReferrer = this.credentials.freeReferrer.password;
    const firstNameReferrer = faker.person.firstName();
    const lastNameReferrer = faker.person.lastName();

    cy.getByTestId('email').type(emailReferrer);
    cy.getByTestId('password').type(passwordReferrer);

    cy.contains('Sign up').click();
    cy.get('[name=firstName]').type(firstNameReferrer);
    cy.get('[name=lastName]').type(lastNameReferrer);
    cy.get('[name=degree]').parent().click();
    cy.contains('P.A.').click();

    cy.contains('Continue').click();

    cy.intercept({
      method: 'GET',
      url: '/api/feed/onboarding',
    }).as('onboarding');

    cy.wait('@onboarding').then( ()=> {
      cy.get('.onboarding-panel').should('exist');
      cy.getByTestId('goToFeedOnboardingBtn').click();
      cy.get('.text-decoration-none > .d-flex').as('.credit-box').should('exist');
    });

    // [fast] article
    // https://testing-professionals.acapedia.com/article/firefighers-pfas-donations-trial
    cy.visit('/article/firefighers-pfas-donations-trial');
    cy.contains('Get CME').click();
    cy.contains('Agree and start').click();
    cy.contains('Take quiz').click();

    let answerIndex = 1;
    let questionNumber = 1;
    let totalQuizFailedQuestions = 0;
    let correctQuestionsNumber = 0;

    // check that the question number is correct
    // TODO: we need a test-id here as we cannot get it by text value
    cy.get('.question-number').contains(questionNumber).should('be.visible');
    cy.intercept('POST', '/api/article/quiz/question/answer').as('answerQuestion');

    function answerQuestion({ failedAnswerNumber }) {
      // select a choice
      // TODO: we need a test-id here as we cannot get it by text value
      cy.get(`.v-input--radio-group__input > :nth-child(${answerIndex})`).click();
      cy.wait('@answerQuestion').then((interception) => {
        const responseBody = interception.response.body;
        const isCorrectAnswer = responseBody.success === 1;
        const newFailedAnswerNumber = !isCorrectAnswer ? failedAnswerNumber + 1 : failedAnswerNumber;
        const maxQuestionAttempts = responseBody.maxAttempts;

        correctQuestionsNumber = isCorrectAnswer ? correctQuestionsNumber + 1 : correctQuestionsNumber;
        totalQuizFailedQuestions =
          newFailedAnswerNumber === maxQuestionAttempts ? totalQuizFailedQuestions + 1 : totalQuizFailedQuestions;

        const isFailedQuiz =
          totalQuizFailedQuestions === 2 ||
          (!isCorrectAnswer &&
            questionNumber === 5 &&
            correctQuestionsNumber < 4 &&
            newFailedAnswerNumber === maxQuestionAttempts);
        const isPassedQuiz = !isFailedQuiz && isCorrectAnswer && questionNumber === 5 && correctQuestionsNumber >= 4;

        if (isFailedQuiz) {
          cy.contains('You did not pass').should('be.visible');
        } else if (isPassedQuiz) {
          cy.contains('PASSED!').should('be.visible');
        } else {
          verifyAnswerTaken(isCorrectAnswer, newFailedAnswerNumber, maxQuestionAttempts);
        }
      });
    }

    function verifyAnswerTaken(isCorrectAnswer, failedAnswerNumber, maxQuestionAttempts) {
      if (isCorrectAnswer) {
        cy.contains("That's correct").should('be.visible');
        nextQuestion();
      } else if (failedAnswerNumber === maxQuestionAttempts) {
        cy.contains('That was your last attempt').should('be.visible');
        nextQuestion();
      } else {
        cy.contains('Try again').should('be.visible');
        answerIndex++;
        answerQuestion({ failedAnswerNumber: failedAnswerNumber });
      }
    }

    function nextQuestion() {
      cy.contains('Next question').click();
      questionNumber++;
      answerIndex = 1;
      cy.get('.question-number').contains(questionNumber).should('be.visible');
      answerQuestion({ failedAnswerNumber: 0 });
    }

    // loop in a recursive way, it is easier to stop the loop
    // when the quiz is completed or failed, because of the async nature of Cypress
    answerQuestion({ failedAnswerNumber: 0 });

    cy.intercept({
      method: 'GET',
      url: '/api/feed/popular?sort=newest',
    }).as('feedSecond');

    cy.visit('/');

    cy.intercept({
      method: 'POST',
      url: '/api/logout',
    }).as('logout');

    cy.wait('@feedSecond').then( ()=> {

      // Simply to grab the menu options when they are visible or hidden (mobile version)
      cy.get('body').then(($body) => {

        if ($body.find(':contains("Account")').is(':visible')) {
          cy.contains('Logout').click();
        } else {
          cy.getByTestId('menu-drawer-btn').click();
          cy.contains('Logout').click();
        }
      });
    });

    cy.intercept({
      method: 'POST',
      url: '/api/login',
    }).as('login');

    // Back to referred
    cy.wait('@logout').then( ()=> {

      cy.getByTestId('email').type(email);
      cy.getByTestId('password').type(password);

      cy.contains('Log in').click();
    });

    cy.wait('@login').then( ()=> {

      cy.visit('/referrals');

      cy.getByTestId('referralStatus')
      .eq(0)
      .contains('Success');
    });

  });
});
