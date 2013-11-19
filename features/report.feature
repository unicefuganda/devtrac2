Feature: Report

@report
Scenario: Export Basic Report
When I download the report for 'Buganda, Kalangala'
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