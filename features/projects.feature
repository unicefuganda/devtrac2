Feature: Projects

Scenario: Display extra project information
Given that I am a regular user
When I open dashboard for "Acholi"
And I click on "Acholi, Gulu"
And I click on the project Icon at latitude "2.7793" and logitude "32.2848"
Then the bottom panel contains the following details:
    |   detail   |
    |Project Name|
    |Partner     |
    |District    |
    |Description |



