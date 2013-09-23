# Feature file for markers on a map

Feature: Map Markers

Scenario: Add water point markers to map
Given that I am a user
When I navigate to the 'Palaro' sub county
Then 'blue' water point circle markers will be displayed on the map

Scenario: Marker Clustering
Given that I am a user
When I navigate to 'Kisoro' District
And Markers are displayed on top of each other
Then Then marker clusters of water points will be displayed instead
Scenario: Add health centre markers to map
Given that I am a user
When I navigate to 'Ssisa' sub county
Then health centre marker icons will be displayed on the map

Scenario: Add school markers to map
Given that I am a user
When I navigate to 'Odek' sub county
Then school marker icons will be displayed on the map

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

Scenario: Hover over a marker
Given that I am a regular user
When I open dashboard for Gulu Palaro
And I hover over a "water-point" marker at "3.1917, 32.3581" 
Then the popup should have content: 
    """
    Deep borehole
    Functional status: Functional (in use)
    Management: Communal
    """

Scenario: Hide Marker Summary Info
Given that I am a regular user
When I open dashboard for Gulu Palaro
And I hover over a "water-point" marker at "3.1917, 32.3581" 
Then the popup should have content: 
    """
    Deep borehole
    Functional status: Functional (in use)
    Management: Communal
    """
When I hover away from a "water_point" marker at "3.1917, 32.3581"
Then the summary information is removed
    
Scenario: Add water point markers
Given that I am a regular user
When I open dashboard for Gulu Palaro
Then the "water-point" cluster marker at "3.2713, 32.3560" is for "6" points
