Feature: Projects
@wip
Scenario: Display extra project information
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
And I click on the project Icon at latitude "2.8193" and logitude "32.3848"
Then the bottom panel contains the following details:
    """
	Project Name:Preventing and Responding to Violence against Children and support to keep children alive
	Partner:UNICEF
	Implementer:World Council of Churches
	District:Gulu
	Sector:Development 
	Start Actual:25/01/2011
	Start Planned:25/01/2011
	End Actual:25/07/2011
	End Planned:25/07/2011
	Status:Post-completion
	Description:Preventing and Responding to Violence against Children and support to keep children alive
    """


Scenario: Filter by Sector
Given that I am a regular user
When I go to the homepage
And I filter by Sector for "Basic Education"
Then there are "8" unicef projects in "Acholi"

Scenario: Filter by Status
Given that I am a regular user
When I go to the homepage
And I filter by Status for "Completion"
Then there are "1" usaid projects in "Teso"

Scenario: Filter by Implementing Partner
Given that I am a regular user
When I open dashboard for "Teso"
And I filter by Implementing Partner for "Africare"
Then there are "1" unicef projects in "Teso, Amuria"

Scenario: Filter by Partner
Given that I am a regular user
When I go to the homepage
And I filter by Partner for "UNICEF"
Then there are "34" unicef projects in "Acholi"
And there are no usaid projects in "Acholi"

Scenario: Filter by Year
Given that I am a regular user
When I go to the homepage
And I filter by Year for "2011"
Then there are "5" unicef projects in "Acholi"





