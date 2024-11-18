@profile @profile-completion @profile-completion-notification-banner @business:medium-impact
Feature: Profile Completion Notification Banner

  @contained
  Scenario Outline: Displaying the Notification Banner on specific pages
    Given the user is authenticated
    And the user has an incomplete profile
    When the user navigates to the <page> page
    Then the page should display a banner prompting the user to complete their profile to manage MOC and CME credits with the text "Provide your medical board to report credits."
    And the banner should display a call to action with the text "Complete profile"

    @full-examples
    Examples:
      | page                     |
      | Main Feed                |
      | Premium Courses Feed     |
      | Topics                   |
      | Special Requirement Feed |

    @minimal-examples
    Examples:
      | page      |
      | Main Feed |

  @contained
  Scenario Outline: Displaying the Complete Profile Dialog through the banner
    Given the user is authenticated
    And the user has an incomplete profile
    And the <page> page has been navigated to
    When the user clicks on "Complete profile" from the banner
    Then the Complete Profile dialog should be shown
    And the <page> page should remain visible in the background

    @full-examples
    Examples:
      | page                     |
      | Main Feed                |
      | Premium Courses Feed     |
      | Topics                   |
      | Special Requirement Feed |

    @minimal-examples
    Examples:
      | page      |
      | Main Feed |

  Scenario Outline: Completing Profile through the banner
    Given the user is authenticated
    And the user has an incomplete profile
    And the <page> page has been navigated to
    And the "Complete profile" has been clicked from the banner
    And the Complete Profile dialog is shown
    When the user completes the profile from the complete profile dialogue opened from the sidebar
    Then the Complete Profile dialog should be closed
    And the <page> page should remain visible
    And the banner should disappear

    @full-examples
    Examples:
      | page                     |
      | Main Feed                |
      | Premium Courses Feed     |
      | Topics                   |
      | Special Requirement Feed |

    @minimal-examples
    Examples:
      | page      |
      | Main Feed |