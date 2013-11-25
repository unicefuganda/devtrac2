Feature: Ureport

Scenario: Show pie chart of ureport results for district
Given that I am a regular user
When I open dashboard for "Acholi, Gulu"
And I select ureport question "Barriers to Farming"
Then I should see a pie chart of 
    """
    Climate - 46%
    Lack Of Capital - 27%
    Poor Farming Methods - 12%
    Pests And Diseases - 9%
    Lack Of Land - 5%
    """