Feature: Report

Scenario: Basic Report Content
When I open the report for 'Buganda, Kalangala'
Then the header contains 
    """
    Kalangala District
    Buganda Region
    """
Then the listed projects should be
    """
    Envision
    Kalangala Infrastructure Services (KIS)
    Quality Education Through BRMS And ECD And VSO Volunteers
    STRIDES For Family Health
    Strengthening Decentralization For Sustainability (SDS)
    Strengthening Local Government Responses To OVC (SUNRISE OVC)
    Technical Management Agency For The Civil Society Fund (TMA-CSF)
    """
And the listed sites visits should be
    """
    Site Visit At Amyel Catholic Church
    Site Visit At Arivu Church, Arivu Sub County (FHDs Monitoring)
    """
And the summary should be
    """
    Health Centers
    16
    Schools
    26
    Water Points
    221
    Subcounties
    7
    2011 Population
    62,000
    Children vaccinated against Diphtheria
    218%
    Children vaccinated against Measles
    105%
    Deliveries in Health Facilities
    12%
    Pit latrine coverage percentage
    56%
    Safe Water coverage percentage
    56%
    """

Scenario: Ureport data on report
When I open the report for 'Buganda, Gulu'
And it includes ureport question 'Do you know of any children in your community that are of school going age but are not in school? If yes, how many do you know?' with the answer 'Yes but only 1 because of long distance.'

# This test basically makes sure that the client is able to download a pdf 
# esentially just checks it's not a 500, very hard to test the content of a pdf
# best we can do probably

Scenario: Download Report
When I download the report for 'Buganda, Kalangala'
Then the file is a pdf

Scenario: Add Map to report
When I open the report for 'Acholi, Gulu, Paicho'
Then the "parish" layer for "Acholi, Gulu, Paicho" is displayed
And the funding partner legend contains
    """
    USAID
    UNICEF
    """
And the places legend contains
    """
    Schools
    Site Visits
    """

