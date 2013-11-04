Feature: Projects
Scenario: Display extra project information
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
And I click on the project Icon at latitude "2.8193" and logitude "32.3848"
Then the bottom panel contains the following details:
    """
	Project Name: Preventing and Responding to Violence against Children and support to keep children alive
	Accountable Agency: UNICEF
	Implementing Partner: World Council of Churches
	Sector: Development 
	Actual Duration: 23/01/2010 - 23/07/2010
	Planned Duration: 23/01/2010 - 23/07/2010
	Status: Post-completion
	Description: Preventing and Responding to Violence against Children and support to keep children alive
    """

@wip
Scenario: Filter by Sector
Given that I am a regular user
When I go to the homepage
And I filter by Sector for "Basic Education"
Then there are "8" unicef projects in "Acholi"

@wip
Scenario: Filter by Status
Given that I am a regular user
When I go to the homepage
And I filter by Status for "Completion"
Then there are "1" usaid projects in "Teso"

@wip
Scenario: Filter by Implementing Partner
Given that I am a regular user
When I open dashboard for "Teso"
And I filter by Implementing Partner for "Africare"
Then there are "1" unicef projects in "Teso, Amuria"

@wip
Scenario: Filter by Partner
Given that I am a regular user
When I go to the homepage
And I filter by Partner for "UNICEF"
Then there are "34" unicef projects in "Acholi"
And there are no usaid projects in "Acholi"

@wip
Scenario: Filter by Year
Given that I am a regular user
When I go to the homepage
And I filter by Year for "2011"
Then there are "5" unicef projects in "Acholi"





