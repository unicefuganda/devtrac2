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

