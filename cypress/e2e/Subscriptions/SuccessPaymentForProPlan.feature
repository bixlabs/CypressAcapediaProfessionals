Feature: Success payment for Pro Plan Users

	Scenario: User can see the success payment page for the pro plan
		Given the user has a free plan
		When the user successfully purchases the Pro plan
		Then the success payment page for the pro plan should be shown
		And the page should show an animation for the pro plan
		And the page should show the title "Successful payment"
		And the page should show the description "Thank you for choosing Acapedia for your Continuing Medical Education!"
		And the page should show the primary action "Go to feed"
		And the page should show the secondary action "Review billing"

	Scenario: User can navigate to feed after success payment
		Given the user has a free plan
		And the pro plan has been successfully purchased
		And the success payment page has been navigated to
		When the user clicks on the primary action "Go to feed"
		Then the user should be navigated to the feed page

	Scenario: User can navigate to billing after success payment
		Given the user has a free plan
		And the pro plan has been successfully purchased
		And the success payment page has been navigated to
		When the user clicks on the secondary action "Review billing"
		Then the user should be navigated to the billing page

	Scenario: User cannot navigate to the success payment page using the url directly
		Given the user has a free plan
		When the user tries to navigate to the success payment page using the url directly
		Then the user should be navigated to the billing page