Feature: Site Visits

Scenario: Show Site Visit list
Given that I am a regular user
When I open dashboard for "Buganda, Rakai"
Then the Site Visit list contains:
    """
    Site Visit at Kotido DLG (DWO, DPO, DHO & CAO's Offices) 07/10/2013 UNICEF Basic nutrition devtrac
    """

Scenario: Paginate the Site Visit list
Given that I am a regular user
When I open dashboard for "Buganda"
And I click on the pagination link "4"  
Then the Site Visit list contains:
    """
    Site Visit at Kaweri All saints CoU 06/10/2013 UNICEF Basic nutrition, Infectious disease control devtrac
    Site Visit at Kalagi Catholic Church 06/10/2013 UNICEF Basic nutrition, Infectious disease control devtrac
    Site Visit at Kigoloba Catholic church 06/10/2013 UNICEF Basic nutrition, Infectious disease control devtrac
    Site Visit at Kacwi Church of Uganda 06/10/2013 UNICEF Basic nutrition, Infectious disease control devtrac
    Site Visit at Kerila Mosque, Apo Sub County (FHDs Monitoring) 04/10/2013 UNICEF Infectious disease control devtrac
    """

