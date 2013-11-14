Feature: Site Visits

Scenario: Show Site Visit list
Given that I am a regular user
When I open dashboard for "Buganda, Rakai"
Then the Site Visit list contains:
    """
    Site Visit at Kotido DLG (DWO, DPO, DHO & CAO's Offices)
    Open in DevTrac
    Date Visited: 7/10/13 Organisation: UNICEF Sectors: Basic nutrition
    """
Scenario: Paginate the Site Visit list
Given that I am a regular user
When I open dashboard for "Buganda"
And I click on the pagination link "4"  
Then the Site Visit list contains:
    """
    Kikandwa Mosque
    Open in DevTrac
    Date Visited: 4/10/13 Organisation: UNICEF Sectors: Basic nutrition, Infectious disease control
    Site Visit at Adilang Chapel
    Open in DevTrac
    Date Visited: 6/10/13 Organisation: UNICEF Sectors:
    Site Visit at Amyel Catholic Church
    Open in DevTrac
    Date Visited: 6/10/13 Organisation: UNICEF Sectors:
    Site Visit at Annina Mosque, Apo Sub County (FHDs Monitoring)
    Open in DevTrac
    Date Visited: 4/10/13 Organisation: UNICEF Sectors: Infectious disease control
    Site Visit at Arivu Church, Arivu Sub County (FHDs Monitoring)
    Open in DevTrac
    Date Visited: 6/10/13 Organisation: UNICEF Sectors: Infectious disease control
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
When I open dashboard for "Bunyoro, Hoima"
Then the "site-visit-point" layer for "Bunyoro, Hoima" is displayed
And I hover over a "site-visit-point" marker at "1.4312, 31.3519" 
Then the popup should have content: 
    """
    Site Visit At Lokpe HC II
    Subject:
    """

Scenario: Display Site Visit details
Given that I am a regular user
When I open dashboard for "Ankole, Mbarara, Kakoba"
And I click on the site visit Icon at "-0.6054, 30.6621"
Then the site visit details should have content:
    """
    Author: Juliet Alyek Ochero
    Date visited: 10/10/13
    Subject:  
    Organisation: UNICEF
    Place Type: Place of Worship
    Summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque varius tellus id mi dapibus vehicula vitae quis elit. Sed porttitor dolor consectetur elit egestas mollis. Curabitur non ante porttitor, pharetra metus eu, blandit neque. Curabitur eget rutrum sapien. Vestibulum blandit massa quis turpis laoreet, et ornare justo ornare. Etiam aliquet faucibus neque at ornare. Quisque vestibulum, erat in scelerisque ornare, ipsum quam elementum felis, sed congue elit urna sit amet mauris. Sed porta volutpat dui vitae accumsan. Nullam id dignissim orci. Duis interdum elit eu massa facilisis nullam.
    Location: Mbaru Catholic Church
    Link: devtrac
    Image Large:   
    Image Small:   
    """


Scenario: Show Site Visit details by clicking site visit link
Given that I am a regular user
When I open dashboard for "Ankole, Mbarara, Kakoba"
And I click on the site visit link "Site Visit at Mbaru Catholic Church"
Then the site Visit details should have content:
  """
    Author: Juliet Alyek Ochero
    Date visited: 10/10/13
    Subject:  
    Organisation: UNICEF
    Place Type: Place of Worship
    Summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque varius tellus id mi dapibus vehicula vitae quis elit. Sed porttitor dolor consectetur elit egestas mollis. Curabitur non ante porttitor, pharetra metus eu, blandit neque. Curabitur eget rutrum sapien. Vestibulum blandit massa quis turpis laoreet, et ornare justo ornare. Etiam aliquet faucibus neque at ornare. Quisque vestibulum, erat in scelerisque ornare, ipsum quam elementum felis, sed congue elit urna sit amet mauris. Sed porta volutpat dui vitae accumsan. Nullam id dignissim orci. Duis interdum elit eu massa facilisis nullam.
    Location: Mbaru Catholic Church
    Link: devtrac
    Image Large:   
    Image Small:   
    """
