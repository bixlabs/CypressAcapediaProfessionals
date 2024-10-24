describe('UserTakeQuiz', { tags: ['@article-quiz', '@business:critical'] }, () => {
  before(() => {
    cy.fixture('/auth/credentialsLogin').as('credentials');
    cy.registerAccount();
  });

  it('Can take a Quiz', () => {
    cy.visit('/');
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
      cy.getQuizOptionByIndex(answerIndex).click();

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
  });
});
