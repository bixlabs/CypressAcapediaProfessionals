@course @certificate @free-plan @business:high-impact @low-likely
Feature: Unawarded Premium Course Certificates for Standard Plan Users
  Background:
    Given a standard plan user has some completed unawarded premium courses
    And the premium courses page has been navigated to

  @contained
  Scenario: Standard plan users should see the call to action "Review course" for completed and unawarded premium courses
    When the user selects the "Completed" tab
    Then the user should see a warning style for unawarded courses
    And should see the call to action "Review course"

  @contained
  Scenario: Standard plan users can successfully go to "Course overview" page for completed and unawarded premium courses
    Given the "Completed" tab is selected
    When the user requests to "Review course"
    Then the user should be navigated to "Course overview" page

  Scenario: Standard plan users with unawarded course credits can not download certificate for completed and unawarded premium courses
    Given a standard plan user in the "Course overview" page
    Then the call to action "Download certificate" is not displayed to the user
    And the call to action "Upgrade" is displayed to the user
    And shows a copy text encouraging to the user to upgrade

  Scenario: Standard plan users with unawarded course credits can upgrade for completed and unawarded premium courses
    When a standard plan user access the "Course overview" page
    Then the user should be able to click the "Upgrade" button
