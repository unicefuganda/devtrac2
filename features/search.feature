# Feature file for search functionality

Feature: Search

Scenario: Display search field
Given That I am a regular user
When I go to the national dashboard
Then A search text box, with watermarked text 'Search for District or sub-county' in it, will be displayed next to the header 'Devtrac Global'

Scenario: Search for a Valid District
Given That I am a regular user
When I go to the national dashboard
And Enter 'Gulu' into the search text box
And Press Enter
Then the map Uganda - Gulu will be displayed
And  Centered on 2.8762, 32.4767 at 8 zoom

Scenario: Search for an invalid District
Given that I am a regular user
When I go to the national dashboard
And Enter 'I Dont Exist District' into the search text box
And Press Enter
Then The back ground color of the search text field will change to hex FF9999
