@notification-banner @business:low-impact
Feature: Notification Banner Appearance Priority Based on User Criteria

  Scenario: Exclusive display of upgrade banner for guest users on premium course abstract page
    Given the user is not authenticated
    When the user navigates to the "Premium Course Abstract" page
    Then the page should display a banner prompting the user to upgrade to premium with the text "You need a paid account to access premium courses."

  Scenario: Priority display of upgrade banner for free users on premium courses page
    Given the authenticated user has a free account
    And the user has reached their credit limit
    And the user has not completed their profile
    When the user navigates to the "Premium Courses" page
    Then the page should display a banner prompting the user to upgrade to premium with the text "You need a paid account to access premium courses"

  Scenario: Priority display of profile completion banner over credit limit banner for free users
    Given the authenticated user has a free account
    And the user has reached their credit limit
    And the user has not completed their profile
    When the user navigates to the "Main Feed" page
    Then the page should display a banner prompting the user to complete their profile to manage MOC and CME credits with the text "Provide your medical board to report your MOC and CME credits."

  Scenario: Exclusive display of credit limit banner for free users with complete profile on main feed
    Given the authenticated user has a free account
    And the user has reached their credit limit
    And the user has completed their profile
    When the user navigates to the "Main Feed" page
    Then the page should display a banner prompting the user that they have reached their credit limit with the text "You have used up your free credits."

  Scenario: No notification banner displayed for free users with complete profiles under credit limit on non-premium pages
    Given the authenticated user has a free account
    And the user has completed their profile
    And the user has not reached their credit limit
    When the user navigates to the "Main Feed" page
    Then the page should not display a notification banner

  Scenario: Exclusive display of profile completion banner for paid users on premium courses page
    Given the authenticated user has a paid account
    And the user has not completed their profile
    When the user navigates to the "Premium Courses" page
    Then the page should display a banner prompting the user to complete their profile to manage MOC and CME credits with the text "Provide your medical board to report your MOC and CME credits."

  Scenario: No notification banner displayed for paid users with complete profiles on any page
    Given the authenticated user has a paid account
    And the user has completed their profile
    When the user navigates to the "Premium Courses" page
    Then the page should not display a notification banner
