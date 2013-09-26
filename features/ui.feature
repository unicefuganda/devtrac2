Feature: UI Elements

Scenario: Display header bar
Given that I am a regular user
When I go to the homepage
Then A white Div html element will be displayed at the top of the page
And It will be of Height 150px

Scenario: Display page header
Given That I am a regular user
When I go to the homepage
Then A header 'Devtrac Global' will be displayed on the left side of the header bar

Scenario: Show/Hide filter panel
Given that I am a regular user
When I go to the homepage
Then the "filter" panel is displayed
When I toggle the "filter" panel
Then the "filter" panel is collapsed
When I toggle the "filter" panel
Then the "filter" panel is displayed

Scenario: Show/Hide indicator panel
Given that I am a regular user
When I go to the homepage
Then the "indicator" panel is displayed
When I toggle the "indicator" panel
Then the "indicator" panel is collapsed
When I toggle the "indicator" panel
Then the "indicator" panel is displayed

Scenario: Display indicator panel
Given that I am a regular user
When I go to the homepage
Then an indicator panel will be displayed in the bottom middle section of the map

Scenario: Select Sector option on Accordion
Given that I am a rugular user
When I click on the sector option in the accordion
Then the sector categories and elements are displayed

Scenario: Select Partner option on Accordion
Given that I am a rugular user
When I click on the partner option in the accordion
Then the partner categories and elements are displayed

Scenario: Show label on polygon
Given that I am a regular user
When I go to the homepage
And I hover over a "gulu" polygon
Then the text "gulu"  is displayed


