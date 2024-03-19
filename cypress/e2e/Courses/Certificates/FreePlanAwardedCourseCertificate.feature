Feature: Awarded Premium Course Certificates for Free Plan Users
  Background:
    Given a free plan user has some completed awarded premium courses
    And the user has navigated to the premium courses page

  Scenario: Free plan users should see the "Download certificate" option for completed and awarded premium courses
    Given the user is not on an iOS mobile device
    When the user selects the Completed tab
    Then the user should see "Download certificate" for awarded courses

  Scenario: Free plan users can successfully download certificates for awarded premium courses
    Given the user is not on an iOS mobile device
    And the user selects the Completed tab
    And the user sees "Download certificate" for awarded courses
    When the user clicks on "Download certificate"
    Then the certificate should be downloaded successfully

  Scenario: Free plan users on iOS mobile devices should be advised to download certificates on desktop due to mobile restrictions
    Given the user is on an iOS mobile device
    When the user selects the Completed tab
    Then the user should be advised to "Download the certificate from desktop"
    And should not see the option to "Download certificate"
