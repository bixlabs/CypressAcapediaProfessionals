Feature: Profile Completion Notification Banner
  Background:
    Given a logged in user having an incomplete profile

  Scenario: Displaying the Notification Banner on specific pages
    When the user navigates to one of the following pages:
      | Page Name                | Page Path                                                             |
      | Main Feed                | /                                                                     |
      | Premium Courses Feed     | /premium-courses                                                      |
      | Topics                   | /special-requirements                                                 |
      | Special Requirement Feed | /special-requirements/topics/controlled-substances/states/alaska/feed |
    Then each page should display a banner prompting the user to complete their profile to manage MOC and CME credits with the text "Provide your medical board to report your MOC and CME credits."