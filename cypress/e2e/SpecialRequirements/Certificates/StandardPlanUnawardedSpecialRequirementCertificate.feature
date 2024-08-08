@special-requirement @certificate @pro-plan @business:high-impact
Feature: Unawarded Special Requirement Certificates for Standard Plan Users
  Background:
    Given a standard plan user has some completed unawarded special requirements
    And the special requirements page has been navigated to

  Scenario: Standard plan users should see the option to upgrade for unawarded special requirements
    When the user selects the "Completed" tab
    Then the user should see the call to action "Upgrade for certificate" for unawarded special requirements
    And the user should see a warning style for unawarded special requirements

  Scenario: Standard plan users navigate to plans page when seeking to upgrade
    When the user selects the "Completed" tab
    Then the user should see able to click the "Upgrade for certificate" button
