Feature: Map Markers

Scenario: Show Water point Marker Summary Info
Given that I am a regular user
When I open dashboard for "Gulu, Palaro"
Then the "water-point" layer for "Gulu" is displayed
And I hover over a "water-point" marker at "3.1917, 32.3581" 
Then the popup should have content: 
    """
    Deep Borehole Water Point
    Functional: Functional (in use)
    Management: Communal
    """
    
Scenario: Cluster Water Point markers
Given that I am a regular user
When I open dashboard for "Gulu, Palaro"
Then the "water-point" cluster marker at "3.2713, 32.3560" is for "6" points

Scenario: Show Heath Center Marker Summary Info
Given that I am a regular user
When I open dashboard for "Gulu, Odek"
Then the "health-center" layer for "Gulu" is displayed
And I hover over a "health-center" marker at "2.6618, 32.6234" 
Then the popup should have content: 
    """
    Acet Heath Center
    Unit Type: HC 4
    """

Scenario: Cluster health center markers
Given that I am a regular user
When I open dashboard for "Gulu, Odek"
Then the "health-center" cluster marker at "2.7492, 32.6948" is for "2" points

Scenario: Show School Marker Summary Info
Given that I am a regular user
When I open dashboard for "Gulu, Odek, Lamola"
Then the "school" layer for "Gulu" is displayed
And I hover over a "school" marker at "2.5885, 32.7447" 
Then the popup should have content: 
    """
    Abella P.S School
    Owner: Government
    Type: Primary
    """

Scenario: Cluster school markers
Given that I am a regular user
When I open dashboard for "Gulu, Odek, Lukwor"
Then the "school" cluster marker at "2.6878, 32.6592" is for "6" points

Scenario: Add waterpoint filter to filter panel
Given that I am a user
When I navigate to the home page
Then the 'Waterpoints' filter will be displayed on the filter panel

Scenario: Add health centre filter to filter panel
Given that I am a user
When I navigate to the home page
Then the 'Health Centres' filter will be displayed on the filter panel

Scenario: Add School filter to filter panel
Given that I am a user
When I navigate to the home page
Then the 'Schools' filter will be displayed on the filter panel