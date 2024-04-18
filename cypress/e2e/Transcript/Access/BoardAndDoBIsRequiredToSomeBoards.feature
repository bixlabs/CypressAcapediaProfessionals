Feature: The user is required to complete their profile to see the transcripts
  Background:
    Given I am a registered user
    And I have selected that I have a medical board
    And I did not provide the required <MedicalBoardInformation>

  Scenario: user has empty board or date of birth details
    Given an user did not fill the board details required by its board selection
    When the user try to access the transcripts
    Then a modal shows requiring to the user fill the missing board details
    And the modal is blocking the transcript page behind

  Scenarios: user is filling board or date of birth details
    Given the modal to fill the board details is shown
    When the user submit the missing board details
    Then close the modal and the transcript page is not blocked