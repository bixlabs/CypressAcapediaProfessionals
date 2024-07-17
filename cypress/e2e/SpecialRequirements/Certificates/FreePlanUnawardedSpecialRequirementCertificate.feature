@special-requirement @certificate @free-plan @business:high-impact
Feature: Unawarded Special Requirement Certificates for Free Plan Users
  Background:
    Given a free plan user has some completed unawarded special requirements
    And the special requirements page has been navigated to

  Scenario: Free plan users should see the option to upgrade for unawarded special requirements
    When the user selects the "Completed" tab
    Then the user should see  the call to action "Upgrade for certificate" for unawarded special requirements
    And the user should see a warning style for unawarded special requirements

  Scenario: Free plan users navigate to "My Plan" page when seeking an upgrade for certificate
    Given the "Completed" tab is selected
    When the user requests to "Upgrade for certificate"
    Then the user should be navigated to "My Plan" page to review upgrade options
