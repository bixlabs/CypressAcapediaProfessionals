Feature: Awarded Premium Course Certificates for Standard Plan Users
  Background:
    Given a standard plan users has some completed awarded premium courses
    And the premium courses page has been navigated to

  Scenario: Standard plan users should see the call to action "Review course" for completed and awarded premium courses
    When the user selects the "Completed" tab
    Then the user should see the call to action "Review course" for awarded courses

  Scenario: Standard plan users can successfully go to "Course overview" page for completed and awarded premium courses
    Given the "Completed" tab is selected
    And the call to action "Review course" is displayed to the user
    When the user requests to "Review course"
    Then the user should be navigated to "Course overview" page

  Scenario: Standard plan users can successfully download certificate for completed and awarded premium courses
    Given a standard plan user in the "Course overview" page
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then the certificate should be downloaded successfully
