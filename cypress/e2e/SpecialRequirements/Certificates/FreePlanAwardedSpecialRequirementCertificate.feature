@special-requirement @certificate @free-plan @business:low-impact
Feature: Awarded Special Requirement Certificates for Free Plan Users
  Scenario: Free plan users should see the "Download certificate" option for completed and awarded special requirements
    Given a free plan user has some completed awarded special requirements
    And the special requirements page has been navigated to
    When the user selects the "Completed" tab
    Then the user should see the call to action "Download certificate" for awarded special requirements

  Scenario: Free plan users can successfully download certificates for awarded special requirements
    Given a free plan user has some completed awarded special requirements
    And the user has a complete profile
    And the special requirements page has been navigated to
    And the "Completed" tab is selected
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then the certificate should be downloaded successfully

  Scenario: Free plan users with incomplete profile should be asked to complete their profile before downloading certificates
    Given a free plan user has some completed awarded special requirements
    And the user has an incomplete profile
    And the special requirements page has been navigated to
    And the "Completed" tab is selected
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then the complete profile dialog is shown requiring the user to fill the missing profile details
    And the special requirements page is still displayed in the background

  Scenario: Free plan users completes profile from dialogue when trying to download a certificate
    Given a free plan user has some completed awarded special requirements
    And the user has an incomplete profile
    And the certificate was requested to be downloaded
    And the complete profile dialogue is displayed
    When the user completes the profile from the complete profile dialogue
    Then the Complete Profile dialog should be closed
    And the special requirements page is still displayed
    And the user will need to click again to download the certificate
