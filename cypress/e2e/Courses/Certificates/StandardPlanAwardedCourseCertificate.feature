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
    # NOW: I think I break this as we have some previous stetps and we deleted the navigated that check with matches regex
    And the "Course overview" page has been navigated to
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then the certificate should be downloaded successfully

  Scenario: Standard plan users with incomplete profile should be asked to complete their profile before downloading certificates
    Given a standard plan user has some completed awarded premium courses
    And the user has an incomplete profile
    And the "Course overview" page has been navigated to
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then a modal is shown requiring the user to fill the missing profile details
