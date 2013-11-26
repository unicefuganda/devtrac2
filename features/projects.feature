
Feature: Projects
@wip
Scenario: Display extra project information
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
And I click on the project Icon at latitude "2.7164" and logitude "32.3418"
Then the project details are:
    """
    Accountable Agency: UNICEF
    Financial Organization: CUAMM
    Implementing Partner: Doctors with Africa
    Sector: STD control including HIV/AIDS
    Actual Duration: -
    Planned Duration: 1/1/13 - 31/12/2014
    Status: Implementation
    Description: Responding to Chronic Emergency in Karamoja Phase IV
    Locations: 
    Agago District, Kiteny Parish
    Agago District, Kiteny Parish
    Amuru District, Palwong Parish
    Amuru District, Palwong Parish
    Gulu District, Lapainat West Parish
    Gulu District, Lapainat West Parish
    Kitgum District, Koch Parish
    Kitgum District, Koch Parish
    Lamwo District, Paluga Parish
    Lamwo District, Paluga Parish
    Nwoya District, Agonga Parish
    Nwoya District, Agonga Parish
    Pader District, Ngoto Parish
    Pader District, Ngoto Parish
    """

Scenario: Filter by Sector
Given that I am a regular user
When I go to the homepage
And I filter by Sector for "STD control including HIV/AIDS"
Then there are "13" unicef project locations in "Acholi"

Scenario: Filter by Status
Given that I am a regular user
When I go to the homepage
And I filter by Status for "Completion"
Then there are "2" usaid projects in "Teso"

Scenario: Filter by Implementing Partner
Given that I am a regular user
When I open dashboard for "Teso"
And I filter by Implementing Partner for "Chemonics"
Then there is "1" unicef project in "Teso, Kumi"

Scenario: Filter by Partner
Given that I am a regular user
When I go to the homepage
And I filter by Partner for "UNICEF"
Then there are "27" unicef project locations in "Acholi"
And there are no usaid projects in "Acholi"

Scenario: Filter by Year
Given that I am a regular user
When I go to the homepage
And I filter by Year for "2011"1

@wip
#commented out because phantomjs can't get dialog contents
Scenario: Show project list
Given that I am a regular urio: Show project details by clicking project link
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
And I click on the pagination link "2"	
Then the project list contains:
    """
    Strengthening Decentralization for Sustainability (SDS)
    Planned Dates: 4/19/10 -
    Funding Org: USAID Accountable Agency: USAID Implementing Partner: Cardno Emerging Markets
    Strengthening Local Government Responses to OVC (SUNRISE OVC)
    Planned Dates: 6/15/10 -
    Funding Org: USAID Accountable Agency: USAID Implementing Partner: International HIV/AIDS Alliance
    Support to keeping the children and women Alive, Safe and Learning
    Planned Dates: -
    Funding Org: UNICEF Accountable Agency: UCS-UEC Implementing Partner: Uganda Catholic Secretariat/Uganda Episcopal Conference
    Technical Management Agency for the Civil Society Fund (TMA-CSF)
    Planned Dates: 2/3/10 - 2/2/13
    Funding Org: USAID Accountable Agency: USAID Implementing Partner: Chemonics
    """

Scenario: Filter by Partner Legend
Given that I am a regular user
When I go to the homepage
And I filter by Partner for "UNICEF"
Then the color of the pin is 'red'

@wipp
Scenario: Sync funding partner with other filters
Given that I am a regular user
When I go to the homepage
And I filter by Partner for "UNICEF"
Then the Status filter displays options:
    """
    Implementation
    Pipeline/identification
    Post-completion
    """
Then the Sector filter displays options:
    """
    Medical services
    Multisector aid
    Multisector aid for basic social services
    Personnel development for population and reproductive health
    Primary education
    Public sector financial management
    Reproductive health care
    Research/scientific institutions
    Road transport
    STD control including HIV/AIDS
    Social/ welfare services
    Strengthening civil society
    Support to national NGOs
    Tourism policy and administrative management
    Waste management/disposal
    """
Then the Implementing Partners filter displays options:
"""
    Action for Community Development
    Advocates Coalition for Dwevelopment and Environment
    Arbeiter Samariter Bund
    Association of Volunteers in International Service (AVSI) Foundation
    Bangladesh Rural Advancement Committee
    Battery Operated Systems for Community Outreach
    Baylor College of Medicine Childrens Foundation-Uganda
    Christian Couseling Fellowship
    Church Of Uganda
    Doctors with Africa
    Elizabeth Glaser Pediatric AIDS Foundation
    Forum for Education NGOs in Uganda
    GOAL UGANDA
    Girl Education Movement - Uganda
    Institute for International Cooperation and Development
    Malaria Consortium
    Mothers to Mothers
    Northern Uganda Health Integration To Enhance Services
    The Uganda Assciation of Women Lawyers
    Uganda Catholic Secretariat/Uganda Episcopal Conference
    Uganda Muslim Supreme Council
    Voluntary Services Oversees
"""

Scenario: Sync Implementing partner with other filters
Given that I am a regular user
When I go to the homepage
And I filter by Implementing Partner for "Chemonics"
Then the Status filter displays options:
"""
Completion
"""
Then the Sector filter displays options:
"""
Basic nutrition
"""
Then the Funding Partners filter displays options:
"""
USAID
"""

Scenario: Sync Sector with other filters
Given that I am a regular user
When I go to the homepage
And I filter by Sector for "Basic nutrition"
Then the Status filter displays options:
    """
    Completion
    Implementation
    """
Then the Funding Partners filter displays options:
    """
    USAID
    """
Then the Implementing Partners filter displays options:
    """
    Cardno Emerging Markets
    Chemonics
    Elizabeth Glaser Pediatric AIDS Foundation
    """

Scenario: Sync Status with other filters
Given that I am a regular user
When I go to the homepage
And I filter by Status for "Completion"
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
Basic nutrition
"""

Scenario: View Default Funding Partner Legend
Given Given that I am a regular user
When I go to the homepage
Then the accountable agency legend header is "Funding Agencies"
Then the projects legend labels are:
"""
USAID
UNICEF
"""
Then the legend color for "USAID" is "red"
Then the legend color for "UNICEF" is "blue"

Scenario: View Default Accuntable Agency Legend
Given Given that I am a regular user
When I go to the homepage
And I choose accountable agency radio
Then the accountable agency legend header is "Accountable Agencies"
Then the projects legend labels are:
"""
USAID
ACODE
FIDA
BOSCO
Others
"""
Then the legend color for "USAID" is "red"
Then the legend color for "ACODE" is "blue"
Then the legend color for "FIDA" is "green"
Then the legend color for "BOSCO" is "darkslateblue"
Then the legend color for "Others" is "#D5D5D5"

Scenario: View Default Places Legend
Given Given that I am a regular user
When I go to the homepage
Then the places legend header is "Places"
Then the places legend labels are:
"""
Schools
"""

Scenario: Synchronise Places legend with water-point filter
Given that I am a regular user
When I go to the homepage  
And I toggle the 'water-point' checkbox
Then the places legend labels are:
"""
Schools
Water Points
"""

Scenario: Synchronise Places legend with water-point filter
Given that I am a regular user
When I go to the homepage  
And I toggle the 'health-center' checkbox
Then the places legend labels are:
"""
Schools
Health Centers
"""

Scenario: Synchronise Places legend with site-visits filter
Given that I am a regular user
When I open dashboard for "Acholi,"
Then the places legend labels are:
"""
Schools
Site Visits
"""










