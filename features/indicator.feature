# Feature file for indicators

Feature: Indicators

Scenario: Display indicator
Given that I am a regular user
When I navigate to the national dashboard
Then the 'Percentage of children completing Primary School' heat map will be shown with the content:
	"""
	Less than 25% - FFB66B
	Less than 50% - FE946C
	Less than 75% - E3796B
	Less than 100% - C66876
	"""

When I go to the homepage
Then the indicator layer is not displayed
When I change indicator to "Percentage of children completing Primary School"
Then the "uganda_district_indicators_2" indicator layer is displayed

