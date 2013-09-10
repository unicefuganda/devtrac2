#This is my first commit

Feature: Navigate dashboards
Scenario: Open district dashboard
When I open dashboard for Gulu
Then I see map of Uganda - Gulu
And It is centered on 2.8364, 32.4297

Scenario: Open national dashboard
Given that I am a regular user
When I go to the homepage
Then I see map of Uganda
And It is centered on 0.3136, 32.5811