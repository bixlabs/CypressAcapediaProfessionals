Feature: The user is required to complete their profile to see the transcripts
  Background:
    Given a registered user
    And they did not provide the required <MedicalBoardInformation>

  Scenario: user having empty board or date of birth details cannot access the transcript page
    Given a user does not fill the board details required by their board selection
    When the user tries to access the transcripts page
    Then a modal showns requiring to the user fill the missing board details
    And the modal is blocking the transcript page behind

  Scenario: user filling board or date of birth details cannot access the transcript page
    Given the modal to fill the board details is shown
    When the user submits the missing board details
    Then the modal is automatically closed and the transcript page is not blocked