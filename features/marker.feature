Feature: Map Markers
 
Scenario: Show Water point Marker Summary Info
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Palaro, Mede"
Then the "water-point-point" layer for "Acholi, Gulu, Palaro, Mede" is displayed
And I hover over a "water-point-point" marker at "3.1917, 32.3581" 
Then the popup should have content: 
    """
    Deep Borehole Water Point
    Functional: Functional (in use)
    Management: Communal
    """
   
Scenario: Cluster Water Point markers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Palaro"
And I toggle the 'water-point' checkbox
Then the "water-point" marker for "Acholi, Gulu, Palaro, Mede" is "6" points

Scenario: Show Health Center Marker Summary Info
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek, Binya"
Then the "health-center-point" layer for "Acholi, Gulu, Odek, Binya" is displayed
And I hover over a "health-center-point" marker at "2.7492, 32.6948" 
Then the popup should have content: 
    """
    Odek Health Center
    Unit Type: HC 3
    """

Scenario: Cluster health center markers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
And I toggle the 'health-center' checkbox
Then the "health-center" marker for "Acholi, Gulu, Odek, Binya" is "2" points

Scenario: Show School Marker Summary Info
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek, Lamola"
Then the "school-point" layer for "Acholi, Gulu, Odek, Lamola" is displayed
And I hover over a "school-point" marker at "2.5885, 32.7447" 
Then the popup should have content: 
    """
    Abella P.S School
    Owner: Government
    Type: Primary
    """
Scenario: Cluster school markers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
Then the "school" marker for "Acholi, Gulu, Odek, Palaro" is "3" points

Scenario: Filter water points
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
And I toggle the 'water-point' checkbox
Then the "water-point" layer for "Acholi, Gulu, Odek" is displayed
When I toggle the 'water-point' checkbox
Then the "water-point" layer for "Acholi, Gulu, Odek" is not displayed

Scenario: Filter health centers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
And I toggle the 'health-center' checkbox
Then the "health-center" layer for "Acholi, Gulu, Odek" is displayed
When I toggle the 'health-center' checkbox
Then the "health-center" layer for "Acholi, Gulu, Odek" is not displayed

Scenario: Filter schools
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
And I toggle the 'school' checkbox
Then the "school" layer for "Acholi, Gulu, Odek" is not displayed
When I toggle the 'school' checkbox
Then the "school" layer for "Acholi, Gulu, Odek" is displayed

Scenario: Highlight Project Locations
Given that I am a regular user
When I go to the homepage
And I select a pin for the "STRENGTHENING PARLIAMENATRY OVERSIGHT" Project on the map
Then locations relating to the "STRENGTHENING PARLIAMENATRY OVERSIGHT" will be highlighted on the map
And I click on the project link "Building Young Futures"
Then locations relating to the "Building Young Futures" will be highlighted on the map


@wip
Scenario: Add Accountable Organisations
Given that I am a regular user
When I go to the home page
And I select the 'Projects/Partners' Tab
Then 'Accountable Organisations' will be selectedby default
When I select an 'USAID' from the  'Accountable Organisations' filter
Then only projects from 'Accountable Organisations' will be displayed on the map

Scenario: Add sector site visits
Given that I am a regular user
When I open dashboard for "Acholi, Arua"
Then I a site vist marker is displayed at "30.6620728, -0.6054366"
