# Feature file for markers on a map

Feature: Map Markers

Scenario: Add water point markers
Given that I am a user
When I navigate to the 'Palaro' sub county
Then 'blue' water point circle markers will be displayed on the map

Scenario: Marker Clustering
Given that I am a user
When I navigate to 'Kisoro' District
Then Then marker clusters of water points will be displayed