# Feature file for indicators

Feature: Indicators

Scenario: Display indicator tags drop down
Given that I am a regular user
When I navigate to the home page
Then The indicator tag drop down box will be displayed on the indicator panel

Scenario: Display indicator drop down
Given that I am a regular user
When I navigate to the home page
Then The indicator drop down list will be displayed on the indicator panel

Scenario: Display Indicator Heat map layer
Given that I am a regular user
When I navigate to the national dashboard
Then The 'Percentage of children completing Primary School' indicator heap map will be displayed

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