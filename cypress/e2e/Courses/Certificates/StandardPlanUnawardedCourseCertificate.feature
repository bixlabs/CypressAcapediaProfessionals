Feature: Unawarded Premium Course Certificates for Standard Plan Users
  Background:
    Given a standard plan user has some completed unawarded premium courses
    And the premium courses page has been navigated to

  Scenario: Standard plan users should see the call to action "Review course" for completed and unawarded premium courses
    Given an iOS mobile device is not being used
    When the user selects the "Completed" tab
    Then the user should see for unawarded courses cards the warning style
    And should see the call to action "Review course"

  Scenario: Standard plan users can successfully go to "Review course"
    Given an iOS mobile device is not used
    And the "Completed" tab is selected
    And the user should see for unawarded courses cards the warning style
    And the call to action "Review course" is displayed to the user
    When the user click to "Review course"
    Then the user should be taken to "Review course"

  Scenario: Standard plan users with unawarded course credits can not download certificate
    Given a standard plan users in the review course page
    And the call to action "Download certificate" is not displayed to the user
    And the call to action "Upgrade" is displayed to the user
    And shows a copy text alert explaining the situation to the user
    When the user requests to "Upgrade"
    Then the user should be taken to plans page
