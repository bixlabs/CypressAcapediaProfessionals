Feature: Awarded Special Requirement Certificates for Standard Plan Users
  Background:
    Given a standard plan user has some completed awarded special requirements
    And the special requirements page has been navigated to

  Scenario: Standard plan users should see the "Download certificate" option for completed and awarded special requirements
    Given an iOS mobile device is not being used
    When the user selects the "Completed" tab
    Then the user should see the call to action "Download certificate" for awarded special requirements

  Scenario: Standard plan users can successfully download certificates for awarded special requirements
    Given an iOS mobile device is not being used
    And the "Completed" tab is selected
    And the call to action "Download certificate" is displayed to the user
    When the user requests to "Download certificate"
    Then the certificate should be downloaded successfully

# TODO: To be removed with the FF FEATURE_NEW_SR_CERTIFICATE_PDF_ENABLED
# Scenario: Standard plan users on iOS mobile devices should be advised to download certificates on desktop due to mobile restrictions
#   Given an iOS mobile device is being used
#   When the user selects the "Completed" tab
#   Then the user should be advised to download the certificate from desktop
#   And should not see the call to action to "Download certificate"
