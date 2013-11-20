Feature: Report

Scenario: Basic Report Content
When I open the report for 'Buganda, Kalangala'
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

# This test basically makes sure that the client is able to download a pdf 
# esentially just checks it's not a 500, very hard to test the content of a pdf
# best we can do probably

Scenario: Download Report
When I download the report for 'Buganda, Kalangala'
Then the file is a pdf