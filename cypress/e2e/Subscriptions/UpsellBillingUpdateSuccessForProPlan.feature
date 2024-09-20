@purchase @purchase-success @pro-plan @business:high-impact
Feature: Upsell Billing Update Success for Pro Plan Users

	Scenario: User can see the upsell billing update success page for the pro plan
		Given the user is a FluoroSafety Pro plan trial member
		When the user successfully updates their billing for the Pro plan
		Then the success upsell billing update success page for the Pro plan should be shown
		And the page should show an animation for the Pro plan
		And the page should show the success title "Billing successfully updated"
		And the page should show the description "Thank you for choosing Acapedia for your Continuing Medical Education!"
		And the page should show the primary action "Go to feed"
		And the page should show the secondary action "Review my plan"

	@low-likely
	Scenario: User can navigate to feed after success payment
		Given the user is a FluoroSafety Pro plan trial member
		And the subscriptions has successfuly updated for the pro plan
		And the upsell billing update success page has been navigated to
		When the user clicks on the primary action "Go to feed"
		Then the user should be navigated to the feed page

	Scenario: User can navigate to my plan after success payment
		Given the user is a FluoroSafety Pro plan trial member
		And the subscriptions has successfuly updated for the pro plan
		And the upsell billing update success page has been navigated to
		When the user clicks on the secondary action "Review my plan"
		Then the user should be navigated to My plan page

	@low-likely
	Scenario: User cannot navigate to the upsell billing update success page using the url directly
		Given the user is authenticated
		When the user tries to navigate to the upsell billing update success page using the url directly
		Then the user should be navigated to My plan page