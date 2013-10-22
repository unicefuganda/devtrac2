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

#
#Scenario: Display ureport panel
#Given that I am a regular user
#When I go to the homepage
#And I select a ureport question "Youth Fund"
#Then the bottom panel will be displayed
#
# 
# Scenario: Show highest response badge for a district
# Given that I am a regular user
# When I go to the homepage
# And I click on "Acholi"
# Then "Acholi" will be selected
# And I select a ureport question "Youth Fund"
# Then the bottom panel will be displayed
# And A badge indicating the highest reponse will be displayed for each district
# 
# Scenario: Show reponses at a regional level
# Given that I am a regular user
# When I go to the homepage
# And I click on "Acholi"
# Then "Acholi" will be selected
# And I select a ureport question "Youth Fund"
# Then the bottom panel will be displayed
# And 5 reponses for "Acholi" will be displayed on bottom panel
# 
# Scenario: Show reponses at a district level
# Given that I am a regular user
# When I open dashboard for "Acholi, Gulu"
# Then "Acholi, Gulu" will be selected
# And I select a ureport question "Youth Fund"
# Then the bottom panel will be displayed
# And 5 reponses for "Acholi, Gulu" will be displayed on bottom panel