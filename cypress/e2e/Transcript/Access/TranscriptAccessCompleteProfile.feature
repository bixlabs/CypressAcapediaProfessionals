Feature: Transcripts Access with Complete Profile

  Scenario: User with complete profile is allowed to access to the Transcripts page
    Given the user is authenticated
    And the user has a complete profile
    And the Main Feed page has been navigated to
    When the user tries to access the Transcripts page via <access_method>
    Then the user should be in the Transcripts page
    And the Complete Profile dialog should be closed

    Examples:
      | access_method          |
      | the CME counter link   |
      | the sidebar navigation |
      | the URL                |