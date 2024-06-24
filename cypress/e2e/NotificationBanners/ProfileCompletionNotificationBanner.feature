Feature: Profile Completion Notification Banner

  Scenario Outline: Displaying the Notification Banner on specific pages
    Given a logged in user having an incomplete profile
    When the user navigates to the <page> page
    Then the page should display a banner prompting the user to complete their profile to manage MOC and CME credits with the text "Provide your medical board to report your MOC and CME credits."

    Examples:
      | page                     |
      | Main Feed                |
      | Premium Courses Feed     |
      | Topics                   |
      | Special Requirement Feed |