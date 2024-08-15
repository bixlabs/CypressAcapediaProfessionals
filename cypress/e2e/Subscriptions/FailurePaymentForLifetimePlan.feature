@purchase @purchase-failure @lifetime-plan @business:high-impact @low-likely
Feature: Failure payment for Lifetime Plan Users

	Scenario: User can see the failure payment page for the Lifetime plan
		Given the user has a free plan
		When the user fails to purchase the Lifetime plan
		Then the failure payment page should be shown
		And the page should show a failure animation
		And the page should show the title "Transaction declined"
		And the page should show the description "Your bank has declined the transaction. Please contact them and/or try again."
		And the page should show the primary action "Try another payment method"
		And the page should show the secondary action "Go to feed"

	@low-likely
	Scenario: User can navigate to feed after failure payment
		Given the user has a free plan
		And the Lifetime plan has been failed to purchase
		And the failure payment page has been navigated to
		When the user clicks on the secondary action "Go to feed"
		Then the user should be navigated to the feed page

	Scenario: User can return to checkout after failure payment
		Given the user has a free plan
		And the Lifetime plan has been failed to purchase
		And the failure payment page has been navigated to
		When the user clicks on the primary action "Try another payment method"
		Then the user should be navigated to the checkout page
		And the "Lifetime" plan should be still selected
		And the billing information should be still filled
		And the previously used payment method should be cleared

	Scenario: User can retry with correct card successfully
		Given the user has a free plan
		And the Lifetime plan has been failed to purchase
		And the failure payment page has been navigated to
		And the user has clicked on the primary action "Try another payment method"
		And the user has been navigated to the checkout page
		When the user fills a valid payment method
		And the user confirms the payment
		Then the user should be navigated to the success page for the Lifetime plan

	@low-likely
	Scenario: User cannot navigate to the failure payment page using the url directly
		Given the user is authenticated
		When the user tries to navigate to the failure payment page using the url directly
		Then the user should be navigated to the billing page
