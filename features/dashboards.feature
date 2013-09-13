#This is my first commit

Feature: Navigate dashboards

Scenario: Open national dashboard
Given that I am a regular user
When I go to the homepage
Then I see map of Uganda
And It is centered on 1.0667, 31.8833 at 7 zoom

Scenario: Open district dashboard
Given that I am a regular user
When I open dashboard for Gulu
Then I see map of Uganda - Gulu
And It is centered on 2.8762, 32.4767 at 8 zoom
And I see the layer "districts" displayed

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
And It is centered on 2.8762, 32.4767 at 8 zoom

Scenario: Open subcountry dashboard
Given that I am a regular user
When I open dashboard for Gulu Patiko
Then I see map of Uganda - Gulu - Patiko
And It is centered on 3.0284, 32.2918 at 10 zoom
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
And It is centered on 3.0284, 32.2918 at 10 zoom