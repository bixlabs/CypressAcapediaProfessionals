Feature: The user can access the transcripts
  Background:
    Given a registered user
    And they provided the required <MedicalBoardInformation> if any

  Scenario: user having no missing board details can access the transcript page
    Given the user has complete board details in its profile
    When the user attempt to access the transcripts
    Then the user should be navigated to the transcript page
    And no modal blocking and requiring to fill missing details is shown