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
And It is centered on 2.8364, 32.4297 at 10 zoom

Scenario: Display district layer
Given that I am a regular user
When I open dashboard for Gulu
Then I see the layer "Districts" displayed

Scenario: Highlight a District
Given that I am a regular user
When I go to the homepage
And I hover over Lira district
Then the Lira district will be highlighted

Scenario: Navigate to District
Given that I am a regular user
When I go to the homepage
And I click on Gulu district
Then the Gulu district will be selected
And It is centered on 2.8364, 32.4297 at 10 zoom

Scenario: Display subcounty layer
Given that I am a regular user
When I open dashboard for Gulu
Then I see the layer "Gulu subcounties" displayed
