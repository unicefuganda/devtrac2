Feature: Projects
Scenario: Display extra project information
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
And I click on the project Icon at latitude "2.8193" and logitude "32.3848"
Then the project details are:
    """
	Accountable Agency: UNICEF
    Financial Organizatin: CDC
	Implementing Partner: World Council of Churches
	Sector: Development
	Actual Duration: 23/01/2010 - 23/07/2010
	Planned Duration: 23/01/2010 - 23/07/2010
	Status: Post-completion
	Description: Preventing and Responding to Violence against Children and support to keep children alive
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

Scenario: Show project list
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
Then the project list contains:
	"""
	UNICEF JICA World Council of Churches Preventing and Responding to Violence against Children and support to keep children alive 25/01/2011 - 25/07/2011
    UNICEF KFW Vountary Services Overseas Quality Education through BRMS and ECD and VSO volunteers 25/01/2011 - 25/07/2011
    UNICEF AfDB The Uganda Assciation of Women Lawyers STRENGTHENING PARLIAMENATRY OVERSIGHT 28/01/2013 - 28/07/2013
    UNICEF EU Gulu United to Save the Children Organization Strengthening Reintegration of Young Mothers with children Formerly Associated with the LRA 28/01/2013 - 28/07/2013
	"""


Scenario: Show project details by clicking project link
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
And I click on the project link "STRENGTHENING PARLIAMENATRY OVERSIGHT"
Then the project details are:
    """
	Accountable Agency: UNICEF
    Financial Organizatin: AfDB
	Implementing Partner: The Uganda Assciation of Women Lawyers
	Sector: Basic life skills for youths and Adults
	Actual Duration: 28/01/2013 - 28/07/2013
	Planned Duration: 28/01/2013 - 28/07/2013
	Status: Post-completion
	Description: STRENGTHENING PARLIAMENATRY OVERSIGHT
    """

Scenario: Paginate the project list
Given that I am a regular user
When I open dashboard for "Acholi"
And I click on the pagination link "4"	
Then the project list contains:
	"""
	UNICEF JICA Forum of Education NGOs in Uganda (FENU) Strengthening peace building, education policy and practice at national and regional level 23/01/2010 - 23/07/2010
    UNICEF ICEIDA Italian Development Coorperation Support to keep children and mothers ALIVE through provision of a comprehensive Health, Nutrition and HIV/AIDS packages for Northern Uganda 23/01/2010 - 23/07/2010
    UNICEF Japan Italian Development Coorperation Support to keep children and mothers ALIVE through provision of a comprehensive Health, Nutrition and HIV/AIDS packages for Northern Uganda 25/01/2011 - 25/07/2011
    UNICEF JICA Italian Development Coorperation Support to keep children and mothers ALIVE through provision of a comprehensive Health, Nutrition and HIV/AIDS packages for Northern Uganda 27/01/2012 - 27/07/2012
	"""

