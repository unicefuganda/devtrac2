Feature: Projects

Scenario: Display extra project information
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
And I click on the project Icon at latitude "2.8193" and logitude "32.3848"
Then the project details are:
    """
	Accountable Agency: UNICEF
    Financial Organization: CDC
	Implementing Partner: World Council of Churches
	Sector: Development
	Actual Duration: 23/01/2010 - 23/07/2010
	Planned Duration: 23/01/2010 - 23/07/2010
	Status: Post-completion
	Description: Preventing and Responding to Violence against Children and support to keep children alive
    Locations: 
    Agago District, Paluti Parish
    Amuru District, Parubanga Parish
    Gulu District, Angaya Parish
    Kaabong District, Sangar Parish
    Kitgum District, Lamit Parish
    Lamwo District, Ywaya Parish
    Nwoya District, Alero Kal Parish
    Pader District, Koyo Parish
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
    Preventing and Responding to Violence against Children and support to keep children alive
    Planned Dates: 25/01/2011 - 25/07/2011
    Funding
    UNICEF  
    Accountable
    JICA  
    Implementing
    World Council of Churches
    Quality Education through BRMS and ECD and VSO volunteers
    Planned Dates: 25/01/2011 - 25/07/2011
    Funding
    UNICEF  
    Accountable
    KFW  
    Implementing
    Vountary Services Overseas
    STRENGTHENING PARLIAMENATRY OVERSIGHT
    Planned Dates: 28/01/2013 - 28/07/2013
    Funding
    UNICEF  
    Accountable
    AfDB  
    Implementing
    The Uganda Assciation of Women Lawyers
    Strengthening Reintegration of Young Mothers with children Formerly Associated with the LRA
    Planned Dates: 28/01/2013 - 28/07/2013
    Funding
    UNICEF  
    Accountable
    EU  
    Implementing
    Gulu United to Save the Children Organization                                            
	"""


Scenario: Show project details by clicking project link
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
And I click on the project link "STRENGTHENING PARLIAMENATRY OVERSIGHT"
Then the project details are:
    """
	Accountable Agency: UNICEF
    Financial Organization: AfDB
	Implementing Partner: The Uganda Assciation of Women Lawyers
	Sector: Basic life skills for youths and Adults
	Actual Duration: 28/01/2013 - 28/07/2013
	Planned Duration: 28/01/2013 - 28/07/2013
	Status: Post-completion
	Description: STRENGTHENING PARLIAMENATRY OVERSIGHT
    Locations:
    Gulu District, Bar-dege Ward Parish
    """

Scenario: Paginate the project list
Given that I am a regular user
When I open dashboard for "Teso"
And I click on the pagination link "3"	
Then the project list contains:
	"""
	STRENGTHENING PARLIAMENATRY OVERSIGHT
    Planned Dates: 23/01/2010 - 23/07/2010
    Funding
    UNICEF  
    Accountable
    Canada  
    Implementing
    The Uganda Assciation of Women Lawyers
    STRIDES for Family Health
    Planned Dates: 28/01/2013 - 28/07/2013
    Funding
    USAID  
    Accountable
    Norway  
    Implementing
    Management Sciences for Health (MSH)
    Scaling up HIV/AIDS comprehensive HIV/AIDS prevention, care and treatment through the Faith Based Network
    Planned Dates: 21/01/2009 - 21/07/2009
    Funding
    USAID  
    Accountable
    USAID  
    Implementing
    Inter-Religious Council of Uganda (IRCU)
    Securing Ugandan's Rights to Essential Medicines (SURE)
    Planned Dates: 27/01/2012 - 27/07/2012
    Funding
    USAID  
    Accountable
    JICA  
    Implementing
    Management Sciences for Health (MSH)
    Stop Malaria Project (SMP)
    Planned Dates: 28/01/2013 - 28/07/2013
    Funding
    USAID  
    Accountable
    Canada  
    Implementing
    Johns Hopkins University (JHU/CCP)
	"""
	
Scenario: Filter by Partner Legend
Given that I am a regular user
When I go to the homepage
And I filter by Partner for "UNICEF"
Then the color of the pin is 'red'

Scenario: Sync funding partner with other filters
Given that I am a regular user
When I go to the homepage
And I filter by Partner for "UNICEF"
Then the Status filter displays options:
    """
    Post-completion
    """
Then the Sector filter displays options:
    """
    Agriculture
    Basic Education
    Basic life skills for youths and Adults
    Development
    Social, Small and medium-sized enterprises
    """
Then the Implementing Partners filter displays options:
    """
    Africare
    Arbeiter Samariter Bund
    Bangladesh Rural Advancement Committee
    Battery Operated Systems for Community Outreach
    C&D
    Christian Couseling Fellowship
    Community Support for Capacity Development
    Doctors with Africa CUAMM
    Elizabeth Glaser Pediatric AIDS Foundation
    Forum of Education NGOs in Uganda (FENU)
    GOAL
    Gulu United to Save the Children Organization
    Healthy Child
    Italian Development Coorperation
    Kaihura Primary School
    Kitgum Concerned Women Association
    Malaria Consortium
    Mothers to Mothers
    Netherlands Development Organization
    REACH
    Save the Children in Uganda (SCiU)
    Straight Talk Foundation (STF)
    TPO - Uganda
    The Uganda Assciation of Women Lawyers
    Vountary Services Overseas
    WATER MISSIONS UGANDA (WMU)
    World Council of Churches
    """

Scenario: Sync Implementing partner with other filters
Given that I am a regular user
When I go to the homepage
And I filter by Implementing Partner for "Africare"
Then the Status filter displays options:
    """
    Post-completion
    """
Then the Sector filter displays options:
    """
    Basic Education
    """
Then the Funding Partners filter displays options:
    """
    UNICEF
    """

Scenario: Sync Sector with other filters
Given that I am a regular user
When I go to the homepage
And I filter by Sector for "Basic Education"
Then the Status filter displays options:
    """
    Post-completion
    """
Then the Funding Partners filter displays options:
    """
    UNICEF
    USAID
    """
Then the Implementing Partners filter displays options:
    """
    Africare
    Arbeiter Samariter Bund
    Bangladesh Rural Advancement Committee
    Battery Operated Systems for Community Outreach
    C&D
    Italian Development Coorperation
    """

Scenario: Sync Status with other filters
Given that I am a regular user
When I go to the homepage
And I filter by Status for "Cancelled"
Then the Funding Partners filter displays options:
    """
    USAID
    """
Then the Implementing Partners filter displays options:
    """
    Chemonics
    """
Then the Sector filter displays options:
    """
    Agriculture
    """




