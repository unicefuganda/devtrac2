# Feature file for search functionality

Feature: Search

@wip
Scenario: Display search field
Given That I am a regular user
When I go to the homepage
Then A search text box, with watermarked text 'Search for District/sub-county/parish' in it, will be displayed next to the header 'Devtrac Global'

@wip
Scenario: Search for a Valid District
Given That I am a regular user
When I go to the homepage
And Enter 'Gulu' into the search text box
And Press Enter
Then 'Acholi, Gulu' will be selected

@wip
Scenario: Search for an invalid District/Parish/Subcounty
Given that I am a regular user
When I go to the homepage
And Enter 'I Dont Exist District' into the search text box
And Press Enter
Then The back ground color of the search text field will change to hex FF6666

@wip
Scenario: Search for a Valid sub county
Given that I am a regular user
When I go to the homepage
And Enter 'Patiko' into the search text box
And Press Enter
Then 'Acholi, Gulu, Patiko' will be selected

@wip
Scenario: Search for a Valid Parish
Given that I am a regular user
When I go to the homepage
And Enter 'Pawel' into the search text box
And Press Enter
Then 'Acholi, Gulu, Patiko, Pawel' will be selected
