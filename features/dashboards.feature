#This is my first commit

Feature: Navigate dashboards

Scenario: Open national dashboard
Given that I am a regular user
When I go to the homepage
Then I see map of Uganda

Scenario: Open region dashboard
Given that I am a regular user
When I open dashboard for region "acholi"
Then I see Uganda map with region acholi displayed
Then region "acholi" will be selected

Scenario: Highlight a region
Given that I am a regular user
When I go to the homepage
And I hover over region "acholi"
Then region "acholi" will be highlighted

Scenario: Navigate to region
Given that I am a regular user
When I go to the homepage
And I click on region "acholi"
Then region "acholi" will be selected

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
And I hover over "Acholi, Gulu, Patiko"
Then "Acholi, Gulu, Patiko" will be highlighted
And I click on "Acholi, Gulu, Patiko"
Then "Acholi, Gulu, Patiko" will be selected

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

Scenario: Show national summary information
Given that I am a regular user
When I go to the homepage
Then The following information will be shown contextual panel
	"""
	Uganda
	Acholi - [# of] Districts
	[# of] Waterpoints
	[# of] Health centres
	[# of] Schools
    Population as of 2011 - #
	Percentage of children vaccinated against Diphtheria - #
    Percentage of children vaccinated against Measles - #
    Percentage of deliveries in Health Facilities - #
    Pit latrine coverage percentage - #
    Safe Water coverage percentage - #
	"""

Scenario: Show regional summary information
Given that I am a regular user
When I go to the homepage
And I click on region "acholi"
Then The following information will be shown contextual panel
	"""
	Uganda
	Acholi - [# of] Districts
	Population as of 2011 - #
	Percentage of children vaccinated against Diphtheria - #
    Percentage of children vaccinated against Measles - #
    Percentage of deliveries in Health Facilities - #
    Pit latrine coverage percentage - #
    Safe Water coverage percentage - #
	"""

Scenario: Show District summary information
Given that I am a regular user
When I open dashboard for "Acholi"
And I click on "Acholi, Gulu"
Then The forllowing information will be shown contextual panel
	"""
	Gulu
	[# of] Sub-counties
	[# of] Waterpoints
	[# of] Health centres
	[# of] Schools
	Population as of 2011 - 385,600
	Percentage of children vaccinated against Diphtheria - 1.08%
    Percentage of children vaccinated against Measles - 1.15%
    Percentage of deliveries in Health Facilities - 0.5%
    Pit latrine coverage percentage - 0.37%
    Safe Water coverage percentage - 0.89%
	"""
Scenario: Show sub county summary information
Given that I am a regular user
When I open dashboard for "Acholi"
And I click on "Acholi, Gulu"
Then "Acholi, Gulu" will be selected
And I hover over "Acholi, Gulu, Patiko"
Then "Acholi, Gulu, Patiko" will be highlighted
And I click on "Acholi, Gulu, Patiko"
Then The forllowing information will be shown contextual panel
	"""
	Patiko
	[# of] parishes
	[# of] Waterpoints
	[# of] Health centres
	[# of] Schools
	"""

Scenario: Show parish summary information
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Patiko"
And I hover over "Acholi, Gulu, Patiko, Pawel"
Then "Acholi, Gulu, Patiko, Pawel" will be highlighted
And I click on "Acholi, Gulu, Patiko, Pawel" 
Then The forllowing information will be shown on the 
	"""
	Pawel
	[# of] Waterpoints
	[# of] Health centres
	[# of] Schools
	"""