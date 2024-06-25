Feature: Awarded Premium Course Certificates for Standard Plan Users
  Scenario: Standard plan users should see the call to action "Review course" for completed and awarded premium courses
    Given a standard plan user has some completed awarded premium courses
    And the premium courses page has been navigated to
    When the user selects the "Completed" tab
    Then the user should see the call to action "Review course" for awarded courses

  Scenario: Standard plan users can successfully go to "Course overview" page for completed and awarded premium courses
    Given a standard plan user has some completed awarded premium courses
    And the premium courses page has been navigated to
    And the "Completed" tab is selected
    And the call to action "Review course" is displayed to the user
    When the user requests to "Review course"
    Then the user should be navigated to "Course overview" page

  Scenario: Standard plan users can successfully download certificate for completed and awarded premium courses
    Given a standard plan user has some completed awarded premium courses
    And the user has a complete profile
    And the premium courses page has been navigated to
    And a standard plan user in the "Course overview" page
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then the certificate should be downloaded successfully

  Scenario: Standard plan users with incomplete profile should be asked to complete their profile before downloading certificates
    Given a standard plan user has some completed awarded premium courses
    And the user has an incomplete profile
    And the "Course overview" page has been navigated to
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then the complete profile dialog is shown requiring the user to fill the missing profile details
    And the "Course overview" page is still displayed in the background

  Scenario: Standard plan users completes profile from dialogue when trying to download a certificate
    Given a standard plan user has some completed awarded premium courses
    And the user has an incomplete profile
    And the certificate was requested to be downloaded
    And the complete profile dialogue is displayed
    When the user completes the profile from the complete profile dialogue
    Then the complete profile dialogue is closed
    And the "Course overview" page is still displayed
    And the user will need to click again to download the certificate
