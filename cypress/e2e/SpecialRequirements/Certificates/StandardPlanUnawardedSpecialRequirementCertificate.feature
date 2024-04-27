Feature: Unawarded Special Requirement Certificates for Standard Plan Users
  Background:
    Given a standard plan user has some completed unawarded special requirements
    And the special requirements page has been navigated to

  Scenario: Standard plan users should see the option to contact support for unawarded special requirements
    When the user selects the "Completed" tab
    Then the user should see the call to action "Contact support" for unawarded special requirements
    And the user should see a warning style for unawarded special requirements

  Scenario: Standard plan users navigate to a external page when seeking to contact support
    When the user selects the "Completed" tab
    Then the user should see the "Contact support" with a link to the external page
