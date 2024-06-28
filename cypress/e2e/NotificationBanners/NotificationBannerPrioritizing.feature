Feature: Notification Banner Prioritizing

  Scenario: Free user with credit limit reached and incomplete profile visiting premium courses should see the premium course upgrade banner ONLY
    Given a free user with credit limit reached and incomplete profile
    When the user navigates to the "Premium Courses" page
    Then the page should display a banner prompting the user to upgrade to premium with the text "Upgrade to premium to unlock unlimited access to all premium courses."
