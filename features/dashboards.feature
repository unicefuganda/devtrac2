#This is my first commit

Feature: Navigate dashboards

Scenario: Open national dashboard
Given that I am a regular user
When I go to the homepage
Then I see map of Uganda

Scenario: Open region dashboard
Given that I am a regular user
When I open dashboard for "Acholi"
Then I see map of Uganda - Acholi Region
Then "Acholi" will be selected

Scenario: Highlight a region
Given that I am a regular user
When I go to the homepage
And I hover over "Acholi"
Then "Acholi" will be highlighted

Scenario: Navigate to region
Given that I am a regular user
When I go to the homepage
And I click on "Acholi"
Then "Acholi" will be selected

Scenario: Open district dashboard
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
Then I see map of Uganda - Acholi - Gulu District
Then "Acholi, Gulu" will be selected

Scenario: Highlight a District
Given that I am a regular user
When I open dashboard for "Lango"
And I hover over "Lango, Lira"
Then "Lango, Lira" will be highlighted

Scenario: Navigate to District
Given that I am a regular user
When I open dashboard for "Acholi"
And I click on "Acholi, Gulu"
Then "Acholi, Gulu" will be selected

Scenario: Open subcountry dashboard
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Patiko"
Then I see map of Uganda - Acholi - Gulu - Patiko Subcounty
Then "Acholi, Gulu, Patiko" will be selected

Scenario: Navigate to Subcounty
Given that I am a regular user
When I open dashboard for "Acholi"
And I click on "Acholi, Gulu"
Then "Acholi, Gulu" will be selected

Scenario: Navigate by breadcrumb
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Patiko"
And I click on the district breadcrumb link
Then I see map of Uganda - Acholi - Gulu District
And I click on the national breadcrumb link
Then I see map of Uganda

Scenario: Navigate to Parish
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Patiko"
And I hover over "Acholi, Gulu, Patiko, Pawel"
Then "Acholi, Gulu, Patiko, Pawel" will be highlighted
And I click on "Acholi, Gulu, Patiko, Pawel" 
Then "Acholi, Gulu, Patiko, Pawel" will be selected

Scenario: Navigate to Incorrect URL
Given that I am a regular user
When I go to the homepage
And I navigate to "../district/hulu" 
Then a page with an error message is displayed 
And the page has a link to the homepage
    