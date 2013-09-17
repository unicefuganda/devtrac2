#This is my first commit

Feature: Navigate dashboards

Scenario: Open national dashboard
Given that I am a regular user
When I go to the homepage
Then I see map of Uganda

Scenario: Open district dashboard
Given that I am a regular user
When I open dashboard for Gulu
Then I see map of Uganda - Gulu
And I see the layer "districts" displayed
Then "Gulu" in "Districts" will be selected

Scenario: Highlight a District
Given that I am a regular user
When I go to the homepage
And I hover over "Lira" in "Districts"
Then "Lira" in "Districts" will be highlighted

Scenario: Navigate to District
Given that I am a regular user
When I go to the homepage
And I click on "Gulu" in "Districts"
Then "Gulu" in "Districts" will be selected

Scenario: Open subcountry dashboard
Given that I am a regular user
When I open dashboard for Gulu Patiko
Then I see map of Uganda - Gulu - Patiko
Then "Patiko" in "Gulu subcounties" will be selected
And I see the layer "Districts" displayed
Then I see the layer "Gulu subcounties" displayed

Scenario: Navigate to Subcounty
Given that I am a regular user
When I go to the homepage
And I click on "Gulu" in "Districts"
Then I see the layer "gulu subcounties" displayed
And I hover over "Patiko" in "Gulu Subcounties"
Then "Patiko" in "Gulu Subcounties" will be highlighted
And I click on "Patiko" in "Gulu Subcounties"
Then "Patiko" in "Gulu Subcounties" will be selected

Scenario: Navigate by breadcrumb
Given that I am a regular user
When I open dashboard for Gulu Patiko
And I click on the district breadcrumb link
Then I see map of Uganda - Gulu
And I click on the national breadcrumb link
Then I see map of Uganda