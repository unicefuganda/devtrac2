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

Scenario: Show Marker Summary Info
Given that I am a regular user
When I  hover over the water point maker at 23.0000, 11.0000
Then a summary of information about the marker is displayed

Scenario: Hide Marker Summary Info
Given that I am a regular user
And the summary information about the water point marker at ... is displayed
When I hover away from a marker
Then the summary information is removed

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