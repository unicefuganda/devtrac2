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
Then The 'Number of children not starting school at age 6' indicator heap map will be displayed