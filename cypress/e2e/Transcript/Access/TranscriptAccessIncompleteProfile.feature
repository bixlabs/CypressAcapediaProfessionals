@transcript @profile-completion @business:high-impact
Feature: Transcripts Access with Incomplete Profile
  Background:
    Given the user is authenticated
    And the user has an incomplete profile

  Scenario Outline: Incomplete profile prevents Transcripts page access
    Given the Main Feed page has been navigated to
    When the user tries to access the Transcripts page via <access_method>
    Then the Complete Profile dialog should be shown
    And the user should be in the Transcripts page

    @full-examples
    Examples:
      | access_method          |
      | the CME counter link   |
      | the sidebar navigation |
      | the URL                |

    @minimal-examples
    Examples:
      | access_method        |
      | the CME counter link |

  Scenario: Completing the profile allows access to Transcripts page
    Given the Transcripts page has been navigated to
    And the Complete Profile dialog is shown
    When the user completes the profile via the Complete Profile dialog
    Then the Complete Profile dialog should be closed
    And the user should be in the Transcripts page
