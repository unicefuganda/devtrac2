Feature: Site Visits

Scenario: Show Site Visit list
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
Then the Site Visit list contains:
    """
    Site Visit at Bardege ICT Youth Centre
    Date Visited: 29/01/2013 Sectors: Basic life skills for youth and adults
    Site Visit at OHCHR Gulu Office
    Date Visited: 12/12/2012 Sectors: Human rights
    Site Visit at Ongako, War Child site
    Date Visited: 28/01/2013 Sectors: Basic life skills for youth and adults
    """

Scenario: Paginate the Site Visit list
Given that I am a regular user
When I open dashboard for "Acholi"
And I click on site visit pagination link "3"  
Then the Site Visit list contains:
    """
    Site Visit at Ongako, War Child site
    Date Visited: 28/01/2013 Sectors: Basic life skills for youth and adults
    Site Visit at Pagak P.7 School
    Date Visited: 28/02/2013 Sectors: Primary education
    Site Visit at Palabek Kal Ps
    Date Visited: 13/11/2012 Sectors: Primary education
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
And I hover over a "site-visit-point" marker at "2.8295, 32.3971"
Then the popup should have content: 
    """
    Site Visit At OHCHR Gulu Office
    Subject: Human rights
    """

Scenario: Display Site Visit details
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Paicho, Angaya"
And I click on the site visit Icon at "2.8295, 32.3971"
Then the site visit details should have content:
    """
    Author: Jacob Opiyo
    Date visited: 12/12/2012
    Subject: Human rights
    Place Type: Office
    Summary: The resource center contains academic publications and resources on human rights, transitional justice and peace building, as well as reading space and computers with internet access. The purpose of the center is to provide access to information on the aforementioned topics, thereby enhancing the knoweldge of relevant stakeholders in Acholi and contribute to the on going peace and recovery process
    """


Scenario: Show Site Visit details by clicking site visit link
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Paicho, Angaya"
And I click on the site visit link "Site Visit at OHCHR Gulu Office"
Then the site visit details should have content:
    """
    Author: Jacob Opiyo
    Date visited: 12/12/2012
    Subject: Human rights
    Place Type: Office
    Summary: The resource center contains academic publications and resources on human rights, transitional justice and peace building, as well as reading space and computers with internet access. The purpose of the center is to provide access to information on the aforementioned topics, thereby enhancing the knoweldge of relevant stakeholders in Acholi and contribute to the on going peace and recovery process
    """
And I click on next on carousel
Then the image src is "/static/images/site-visit/site-visit_2.jpeg"


Scenario: Do not Display Site Visit Panel When There is no Site visit
Given that I am a regular user
When I open dashboard for "Bunyoro, Hoima"
Then the Site Visit panel should not be displayed


