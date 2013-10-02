Feature: Map Markers

Scenario: Show Water point Marker Summary Info
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Palaro"
Then the "water-point" layer for "Acholi, Gulu" is displayed
And I hover over a "water-point" marker at "3.1917, 32.3581" 
Then the popup should have content: 
    """
    Deep Borehole Water Point
    Functional: Functional (in use)
    Management: Communal
    """
    
Scenario: Cluster Water Point markers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Palaro"
Then the "water-point" cluster marker at "3.2804, 32.3617" is for "5" points

Scenario: Show Heath Center Marker Summary Info
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
Then the "health-center" layer for "Acholi" is displayed
And I hover over a "health-center" marker at "2.6618, 32.6234" 
Then the popup should have content: 
    """
    Acet Heath Center
    Unit Type: HC 4
    """

Scenario: Cluster health center markers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
Then the "health-center" cluster marker at "2.7492, 32.6948" is for "2" points

Scenario: Show School Marker Summary Info
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek, Lamola"
Then the "school" layer for "Acholi" is displayed
And I hover over a "school" marker at "2.5885, 32.7447" 
Then the popup should have content: 
    """
    Abella P.S School
    Owner: Government
    Type: Primary
    """

Scenario: Cluster school markers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
Then the "school" cluster marker at "2.6833, 32.7336" is for "3" points

Scenario: Add waterpoint filter to filter panel
Given that I am a regular user
When I navigate to the home page
Then the 'Waterpoints' filter will be displayed on the filter panel

Scenario: Add health centre filter to filter panel
Given that I am a regular user
When I navigate to the home page
Then the 'Health Centres' filter will be displayed on the filter panel

Scenario: Add School filter to filter panel
Given that I am a regular user
When I navigate to the home page
Then the 'Schools' filter will be displayed on the filter panel

Scenario: Filter water points
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
And I toggle the 'water-point' checkbox
Then the "water-point" layer for "Acholi, Gulu" is not displayed
When I toggle the 'water-point' checkbox
Then the "water-point" layer for "Acholi, Gulu" is displayed

Scenario: Filter health centers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
And I toggle the 'health-center' checkbox
Then the "health-center" layer for "Acholi" is not displayed
When I toggle the 'health-center' checkbox
Then the "health-center" layer for "Acholi" is displayed

Scenario: Filter schools
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
And I toggle the 'school' checkbox
Then the "school" layer for "Acholi" is not displayed
When I toggle the 'school' checkbox
Then the "school" layer for "Acholi" is displayed

Scenario:  Show clusters on region dashboard
Given that I am a regular user
And I click on region "acholi"
Then the "water-point" layer for region "Acholi" is displayed

Scenario: Show Badges for waterpoints
Given that I am a regular user
When I open dashboard for "Acholi"
Then the "water-point" layer for region "Acholi" is displayed
And the "water-point" badge will be shown for the "Acholi" region
And the "water-point" badge will show the "no of waterpoints" for "Acholi"

Scenario: Show Badges for health centres
Given that I am a regular user
When I open dashboard for "Acholi"
Then the "health-center" layer for "Acholi" is displayed
And the "health-centre" badge will be shown for the "Acholi" region
And the "health-centre" badge will show the "no of health centres" for "Acholi"

Scenario: Show Badges for schols
Given that I am a regular user
When I open dashboard for "Acholi"
Then the "school" layer for "Acholi" is displayed
And the "Schools" badge will be shown for the "Acholi" region
And the "schools" badge will show the "no of schools" for "Acholi"