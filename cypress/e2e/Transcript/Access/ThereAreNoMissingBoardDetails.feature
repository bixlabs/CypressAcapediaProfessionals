Feature: The user can access the transcripts
  Background:
    Given I am a registered user
    And I provided the required <MedicalBoardInformation> if any

  Scenario: user has no missing board details
    Given the user has complete board details in its profile
    When the user attempt to access the transcripts
    Then he can navigate to the transcript page
    And no modal blocking and requiring to fill missing details is shown