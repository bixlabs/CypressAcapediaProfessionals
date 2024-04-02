Feature: Unawarded Premium Course Certificates for Free Plan Users
  Background:
    Given a free plan user has some completed unawarded premium courses
    And the premium courses page has been navigated to

  Scenario: Free plan users should see the option to upgrade for unawarded premium courses
    When the user selects the "Completed" tab
    Then the user should see  the call to action "Upgrade for certificate" for unawarded courses

  Scenario: Free plan users navigate to "My Plan" page when seeking an upgrade for certificate
    Given the "Completed" tab is selected
    When the user requests to "Upgrade for certificate"
    Then the user should be navigated to "My Plan" page to review upgrade options
