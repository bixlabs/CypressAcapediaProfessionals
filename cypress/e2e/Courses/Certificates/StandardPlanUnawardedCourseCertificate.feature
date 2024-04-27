## when FF MILESTONE_PLANS_UPDATES_PART_ONE_ENABLED is activate please remove .hold extension from this file
Feature: Unawarded Premium Course Certificates for Standard Plan Users
  Background:
    Given a standard plan user has some completed unawarded premium courses
    And the premium courses page has been navigated to

  Scenario: Standard plan users should see the call to action "Review course" for completed and unawarded premium courses
    When the user selects the "Completed" tab
    Then the user should see a warning style for unawarded courses
    And should see the call to action "Review course"

  Scenario: Standard plan users can successfully go to "Course overview" page for completed and unawarded premium courses
    Given the "Completed" tab is selected
    When the user requests to "Review course"
    Then the user should be navigated to "Course overview" page

  Scenario: Standard plan users with unawarded course credits can not download certificate for completed and unawarded premium courses
    Given a standard plan user in the "Course overview" page
    Then the call to action "Download certificate" is not displayed to the user
    And the call to action "contact support" is displayed to the user
    And shows a copy text encouraging to the user to contact support

  Scenario: Standard plan users with unawarded course credits can contact support for completed and unawarded premium courses
    When a standard plan user access the "Course overview" page
    Then the user should see the "contact support" with a link to the external page
