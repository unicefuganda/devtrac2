from lettuce import *
from page import *
from nose.tools import *
from time import *

@step(u'Then the indicator layer is not displayed')
def then_the_indicator_layer_is_not_displayed(step):
    assert world.page.is_indicator_layer_hidden()

@step(u'When I change indicator to "([^"]*)"')
def when_i_change_indicator(step, indicator_name):
    world.page.change_indicator(indicator_name)
    
@step(u'Then the "([^"]*)" indicator layer is displayed')
def then_the_indicator_layer_is_displayed(step, indicator_name):
    world.page.is_indicator_layer_displayed(indicator_name)

@step(u'When I navigate to the \'([^\']*)\' sub county')
def when_i_navigate_to_the_group1_sub_county(step, group1):
    assert True, 'This step must be implemented'
@step(u'When I navigate to \'([^\']*)\' District')
def when_i_navigate_to_group1_district(step, group1):
    assert True, 'This step must be implemented'
@step(u'When I hover over the water point maker at 23.0000, 11.0000')
def when_i_hover_over_the_water_point_maker_at_23_0000_11_0000(step):
    assert True, 'This step must be implemented'

 #Scenario for show indicator heat map

@step(u'When I navigate to the national dashboard')
def when_i_navigate_to_the_national_dashboard(step):
    assert True, 'This step must be implemented'
@step(u'Then The \'([^\']*)\' indicator heap map will be displayed')
def then_the_group1_indicator_heap_map_will_be_displayed(step, group1):
    assert True, 'This step must be implemented'

 #Scenario for show heat map legend

@step(u'Then the \'([^\']*)\' heat map will be shown with the content:')
def then_the_group1_heat_map_will_be_shown_with_the_content(step, group1):
    assert True, 'This step must be implemented'

