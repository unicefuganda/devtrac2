Feature: Site Visits

Scenario: Show Site Visit list
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
Then the Site Visit list contains:
    """
    Koch Kalang
    Open in DevTrac
    Date Visited: 12/03/2013 Sectors: Education and training in water supply and sanitation
    Site Visit at Monitoring ECD orientation training for DIS, DHI, FBOs, DPOs EO on Licensing and Registration of ECD centres
    Open in DevTrac
    Date Visited: 27/02/2013 Sectors: Early childhood education
    """

Scenario: Paginate the Site Visit list
Given that I am a regular user
When I open dashboard for "Acholi"
And I click on site visit pagination link "3"  
Then the Site Visit list contains:
    """
    Site Visit at Ogom Telela
    Open in DevTrac
    Date Visited: 05/03/2013 Sectors: Primary education
    Site Visit at PATIRA
    Open in DevTrac
    Date Visited: 12/03/2013 Sectors: Education facilities and training, Primary education
    Site Visit at Pader District HQs
    Open in DevTrac
    Date Visited: 05/03/2013 Sectors:
    Site Visit at Pagak P.7 School
    Open in DevTrac
    Date Visited: 28/02/2013 Sectors: Primary education
    Site Visit at Refugee Camp
    Open in DevTrac
    Date Visited: 28/10/2013 Sectors:
    """

Scenario: Filter Site visit points
Given that I am a regular user
When I open dashboard for "Bunyoro, Hoima"
And I toggle the 'site-visit-point' checkbox
Then the "site-visit-point" layer for "Bunyoro, Hoima" is not displayed
When I toggle the 'site-visit-point' checkbox
Then the "site-visit-point" layer for "Bunyoro, Hoima" is displayed

Scenario: Show Site Visit Marker Summary Info
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
Then the "site-visit-point" layer for "Acholi, Gulu" is displayed
And I hover over a "site-visit-point" marker at "2.7193, 32.2186"
Then the popup should have content: 
    """
    Koch Kalang
    Subject: Education and training in water supply and sanitation
    """

Scenario: Display Site Visit details
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
And I click on the site visit Icon at "2.7193, 32.2186"
Then the site visit details should have content:
    """
    Author: Rabbin Mike Drabe
    Date visited: 12/03/2013
    Subject: Education and training in water supply and sanitation
    Place Type: Primary School
    Location: Koch Ongako Open Location In Devtrac
    Summary: Before UNICEF intervention, water and sanitation provision in Nwoya schools was non-existent or in an appalling state. UNICEF/District programmes have since put in hardware that has significantly improved the coverage of latrines, drinking and washing water. More investment has been made in hygiene education. Another major effort to monitor and re-plan district wide, and without more investment in water and sanitation for the surrounding communities, the sustainability of the hardware and the consolidation of behaviour change may be lost.
    """


Scenario: Show Site Visit details by clicking site visit link
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
And I click on the site visit link "Koch Kalang"
Then the site visit details should have content:
    """
    Author: Rabbin Mike Drabe
    Date visited: 12/03/2013
    Subject: Education and training in water supply and sanitation
    Place Type: Primary School
    Location: Koch Ongako Open Location In Devtrac
    Summary: Before UNICEF intervention, water and sanitation provision in Nwoya schools was non-existent or in an appalling state. UNICEF/District programmes have since put in hardware that has significantly improved the coverage of latrines, drinking and washing water. More investment has been made in hygiene education. Another major effort to monitor and re-plan district wide, and without more investment in water and sanitation for the surrounding communities, the sustainability of the hardware and the consolidation of behaviour change may be lost.
    """
And I click on next on carousel
Then the image src is "/static/images/site-visit/site-visit_2.jpeg"


Scenario: Do not Display Site Visit Panel When There is no Site visit
Given that I am a regular user
When I open dashboard for "Bunyoro, Hoima"
Then the Site Visit panel should not be displayed


