Feature: Map Markers
 
# Scenario: Show Water point Marker Summary Info
# Given that I am a regular user
# When I open dashboard for "Acholi, Gulu, Palaro"
# Then the "water-point" layer for "Acholi, Gulu" is displayed
# And I hover over a "water-point" marker at "3.1917, 32.3581" 
# Then the popup should have content: 
#     """
#     Deep Borehole Water Point
#     Functional: Functional (in use)
#     Management: Communal
#     """
   
Scenario: Cluster Water Point markers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Palaro"
Then the "water-point" marker for "Acholi, Gulu, Palaro, Mede" is "6" points

#Scenario: Show Health Center Marker Summary Info
#Given that I am a regular user
#When I open dashboard for "Acholi, Gulu, Odek"
#Then the "health-center" layer for "Acholi" is displayed
#And I hover over a "health-center" marker at "2.6618, 32.6234" 
#Then the popup should have content: 
#    """
#    Acet Health Center
#    Unit Type: HC 4
#    """

Scenario: Cluster health center markers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
Then the "health-center" marker for "Acholi, Gulu, Odek, Binya" is "2" points
# 
# Scenario: Show School Marker Summary Info
# Given that I am a regular user
# When I open dashboard for "Acholi, Gulu, Odek, Lamola"
# Then the "school" layer for "Acholi" is displayed
# And I hover over a "school" marker at "2.5885, 32.7447" 
# Then the popup should have content: 
#     """
#     Abella P.S School
#     Owner: Government
#     Type: Primary
#     """
# 
Scenario: Cluster school markers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
Then the "school" marker for "Acholi, Gulu, Odek, Palaro" is "3" points

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
Then the "water-point" layer for "Acholi, Gulu, Odek" is not displayed
When I toggle the 'water-point' checkbox
Then the "water-point" layer for "Acholi, Gulu, Odek" is displayed

Scenario: Filter health centers
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
And I toggle the 'health-center' checkbox
Then the "health-center" layer for "Acholi, Gulu, Odek" is not displayed
When I toggle the 'health-center' checkbox
Then the "health-center" layer for "Acholi, Gulu, Odek" is displayed

Scenario: Filter schools
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Odek"
And I toggle the 'school' checkbox
Then the "school" layer for "Acholi, Gulu, Odek" is not displayed
When I toggle the 'school' checkbox
Then the "school" layer for "Acholi, Gulu, Odek" is displayed