Feature: Awarded Premium Course Certificates for Standard Plan Users
  Background:
    Given a standard plan user has some completed awarded premium courses
    And the premium courses page has been navigated to

  Scenario: Standard plan users should see the call to action "Review course" for completed and awarded premium courses
    Given an iOS mobile device is not being used
    When the user selects the "Completed" tab
    Then the user should see the call to action "Review course" for awarded courses

# Other Scenarios here