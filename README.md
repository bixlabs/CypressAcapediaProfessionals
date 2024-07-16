# Acapedia

## How to run the tests

// TODO

### Using Feature Flags

#### Example of Use: Check if a Feature Flag is Enabled

This example demonstrates how to use the custom Cypress command to check the enablement status of a feature flag within your tests. We use a string to specify the feature flag instead of a constant because importing JS in files handled by the Cucumber preprocessor can lead to the preprocessor not responding to changes made in the file. Using a direct string avoids this issue and ensures more stable behavior.

```javascript
cy.isFeatureFlagEnabled('MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED').then((isEnabled) => {
  if (isEnabled) {
    cy.contains('Complete profile to get your credits').should('exist');
  } else {
    cy.log('Feature flag MILESTONE_COMPLETE_PROFILE_CERTIFICATES_ENABLED is disabled, skipping assertion');
  }
});
```

### Troubleshooting

#### Issue: Changes Not Reflecting in Tests

While working with our Cucumber preprocessor, you might encounter an issue where changes made to `.feature` files or `.js` scripts are not reflected when running the tests. This problem seems to occur intermittently and the exact cause is currently under investigation.

[Issue Link](https://github.com/cypress-io/cypress/issues/19423)

##### Temporary Solution

If you face this issue, try the following workaround:

- **Create a New File**: Copy the contents of the affected file into a new file with a slightly different name. This can sometimes help in getting the changes to be picked up by the testing framework (or at least to confirm that we are not getting crazy).
- **Delete the cache**: Cypress caches files to speed up the test execution. They are stored in the `~/.config/Cypress/cy/production` directory. Try to delete the .feature file in the children directory following the same path as the file you are working on.

Example: If you are working on the file `e2e/Courses/Certificates/LifetimePlanAwardedCourseCertificate.feature`, you should delete the file in the following path: `~/.config/Cypress/cy/production/projects/e2e-<current-hash>/bundles/cypress/e2e/Courses/Certificates/LifetimePlanAwardedCourseCertificate.feature`
