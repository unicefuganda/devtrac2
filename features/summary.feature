
Feature: Display Summary

Scenario: Show national summary information
Given that I am a regular user
When I go to the homepage
Then The following information will be shown contextual panel
    """
    Indicators
    Health Centers
    4,437
    Schools
    19,665
    Water Points
    81,543
    Regions
    13
    """

Scenario: Show regional summary information
Given that I am a regular user
When I open dashboard for "Acholi"
Then The following information will be shown contextual panel
    """
    Indicators
    Health Centers
    58
    Schools
    663
    Water Points
    4,788
    Districts
    8
    """

Scenario: Show District summary information
Given that I am a regular user
When I open dashboard for "Acholi"
And I click on "Acholi, Gulu"
Then The following information will be shown contextual panel
    """
    Indicators
    Health Centers
    22
    Schools
    210
    Water Points
    1,046
    Subcounties  
    15 
    2011 Population
    385,600
    Children vaccinated against Diphtheria
    108%
    Children vaccinated against Measles
    115%
    Deliveries in Health Facilities
    50%
    Pit latrine coverage percentage
    37%
    Safe Water coverage percentage
    89% 
    """
   # Population as of 2011 - 385,600
  # Percentage of children vaccinated against Diphtheria - 1.08%
  # Percentage of children vaccinated against Measles - 1.15%
  # Percentage of deliveries in Health Facilities - 0.5%
  # Pit latrine coverage percentage - 0.37%
  # Safe Water coverage percentage - 0.89%

Scenario: Show sub county summary information
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Patiko"
Then The following information will be shown contextual panel
    """
    Indicators
    Health Centers
    0
    Schools
    5
    Water Points
    41
    Parishes
    3
    """

Scenario: Show parish summary information
Given that I am a regular user
When I open dashboard for "Acholi, Gulu, Paicho, Pagik"
Then The following information will be shown contextual panel
    """
    Indicators
    Health Centers
    2
    Schools
    3
    Water Points
    22
    """

