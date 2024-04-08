Feature: Awarded Premium Course Certificates for Standard Plan Users
  Background:
    Given a standard plan user has some completed awarded premium courses
    And the premium courses page has been navigated to

  Scenario: Standard plan users should see the call to action "Review course" for completed and awarded premium courses
    Given an iOS mobile device is not being used
    When the user selects the "Completed" tab
    Then the user should see the call to action "Review course" for awarded courses

  Scenario: Standard plan users can successfully go to "Review course"
    Given an iOS mobile device is not used
    And the "Completed" tab is selected
    And the call to action "Review course" is displayed to the user
    When the user click to "Review course"
    Then the user should be taken to "Review course"

  Scenario: Standard plan users can successfully download certificate
    Given a standard plan users in the review course page
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then the certificate should be downloaded successfully

# Other Scenarios here