# Feature file for indicators

Feature: Indicators

When I go to the homepage
Then the indicator layer is not displayed
When I change indicator to "Percentage of children completing Primary School"
Then the "uganda_district_indicators_2" indicator layer is displayed

