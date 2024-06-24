Feature: Awarded Premium Course Certificates for Lifetime Plan Users
  Scenario: Lifetime plan users should see the call to action "Review course" for completed and awarded premium courses
    Given a lifetime plan user has some completed awarded premium courses
    And the premium courses page has been navigated to
    When the user selects the "Completed" tab
    Then the user should see the call to action "Review course" for awarded courses

  Scenario: Lifetime plan users can successfully go to "Course overview" page for completed and awarded premium courses
    Given a lifetime plan user has some completed awarded premium courses
    And the premium courses page has been navigated to
    And the "Completed" tab is selected
    And the call to action "Review course" is displayed to the user
    When the user requests to "Review course"
    Then the user should be navigated to "Course overview" page

  Scenario: Lifetime plan users can successfully download certificate for completed and awarded premium courses
    Given a lifetime plan user has some completed awarded premium courses
    And the premium courses page has been navigated to
    And a lifetime plan user in the "Course overview" page
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then the certificate should be downloaded successfully

  Scenario: Lifetime plan users with incomplete profile should be asked to complete their profile before downloading certificates
    Given a lifetime plan user has some completed awarded premium courses
    And the user has an incomplete profile
    And the "Course overview" page has been navigated to
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then a dialog is shown requiring the user to fill the missing profile details
