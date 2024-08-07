@profile @profile-completion @profile-completion-sidebar @business:low-impact
Feature: Sidebar Notification for Incomplete Profile

  @contained
  Scenario Outline: Sidebar Notification for profile completion on specific pages
    Given the user is authenticated
    And the user has an incomplete profile
    And the <page> page has been navigated to
    When the user clicks on "Account" from the sidebar
    Then the sidebar should display the text "Complete profile"

    @full-examples
    Examples:
      | page                 |
      | Main Feed            |
      | Premium Courses Feed |
      | Topics               |

    @minimal-examples
    Examples:
      | page                 |
      | Premium Courses Feed |

  @contained
  Scenario Outline: Displaying the Complete Profile Dialog through the sidebar
    Given the user is authenticated
    And the user has an incomplete profile
    And the <page> page has been navigated to
    And the "Account" has been clicked from the sidebar
    When the user clicks on "Complete profile" from the sidebar
    Then the complete profile dialog is shown requiring the user to fill the missing profile details
    And the <page> page is still displayed in the background

    @full-examples
    Examples:
      | page                 |
      | Main Feed            |
      | Premium Courses Feed |
      | Topics               |

    @minimal-examples
    Examples:
      | page                 |
      | Premium Courses Feed |

  Scenario Outline: Completing Profile through the sidebar
    Given the user is authenticated
    And the user has an incomplete profile
    And the <page> page has been navigated to
    And the "Account" has been clicked from the sidebar
    And the "Complete profile" has been clicked from the sidebar
    And the complete profile dialogue is displayed
    When the user completes the profile from the complete profile dialogue opened from the sidebar
    Then the Complete Profile dialog should be closed
    And the <page> page is still displayed
    And the sidebar should not display the text "Complete profile"
    And the sidebar should display the text "Profile"

    @full-examples
    Examples:
      | page                 |
      | Main Feed            |
      | Premium Courses Feed |
      | Topics               |

    @minimal-examples
    Examples:
      | page                 |
      | Premium Courses Feed |
