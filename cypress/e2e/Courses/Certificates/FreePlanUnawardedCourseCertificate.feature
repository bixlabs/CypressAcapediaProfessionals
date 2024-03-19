Feature: Unawarded Premium Course Certificates for Free Plan Users
  Background:
    Given a free plan user has some completed unawarded premium courses
    And the user has navigated to the premium courses page

  Scenario: Free plan users should see the option to upgrade for unawarded premium courses
    When the user selects the Completed tab
    Then the user should see "Upgrade for certificate" for unawarded courses

  Scenario: Free plan users are redirected to my-plan page on clicking "Upgrade for certificate"
    Given the user has selected the Completed tab
    When the user clicks on "Upgrade for certificate"
    Then the user should be redirected to the my-plan page
