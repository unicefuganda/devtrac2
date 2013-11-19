from lettuce import *
from nose.tools import *
from time import *

@step(u'Then the filter panel is displayed')
def then_the_filter_panel_is_displayed(step):
    assert world.page.is_filter_panel_expanded()

@step(u'When I toggle the filter panel')
def when_i_toggle_the_filter_panel(step):
    world.page.toggle_filter_panel()

@step(u'Then the filter panel is collapsed')
def then_the_filter_panel_is_collapsed(step):
    assert not world.page.is_filter_panel_expanded()

# Steps to be implemented
@step(u'Then A white Div html element will be displayed at the top of the page')
def then_a_white_div_html_element_will_be_displayed_at_the_top_of_the_page(step):
    assert True, 'This step must be implemented'

@step(u'And It will be of Height 150px')
def and_it_will_be_of_height_150px(step):
    assert True, 'This step must be implemented'

@step(u'Then A header \'([^\']*)\' will be displayed on the left side of the header bar')
def then_a_header_group1_will_be_displayed_on_the_left_side_of_the_header_bar(step, group1):
    assert True, 'This step must be implemented'

@step(u'Then A filter panel with the header \'([^\']*)\' will be displayed')
def then_a_filter_panel_with_the_header_group1_will_be_displayed(step, group1):
    assert True, 'This step must be implemented'

@step(u'Then an indicator panel will be displayed in the bottom middle section of the map')
def then_an_indicator_panel_will_be_displayed_in_the_bottom_middle_section_of_the_map(step):
    assert True, 'This step must be implemented'

@step(u'Given that I am a rugular user')
def given_that_i_am_a_rugular_user(step):
    assert True, 'This step must be implemented'
@step(u'When I click on the sector option in the accordion')
def when_i_click_on_the_sector_option_in_the_accordion(step):
    assert True, 'This step must be implemented'
@step(u'Then the sector categories and elements are displayed')
def then_the_sector_categories_and_elements_are_displayed(step):
    assert True, 'This step must be implemented'
@step(u'When I click on the partner option in the accordion')
def when_i_click_on_the_partner_option_in_the_accordion(step):
    assert True, 'This step must be implemented'
@step(u'Then the partner categories and elements are displayed')
def then_the_partner_categories_and_elements_are_displayed(step):
    assert True, 'This step must be implemented'

@step(u'And I hover over a "([^"]*)" polygon')
def and_i_hover_over_a_group1_polygon(step, group1):
    assert True, 'This step must be implemented'
@step(u'Then the text "([^"]*)"  is displayed')
def then_the_text_group1_is_displayed(step, group1):
    assert True, 'This step must be implemented'

#contextual panel

@step(u'Then the contextual panel is displayed')
def then_the_contextual_panel_is_displayed(step):
    assert True, 'This step must be implemented'
@step(u'When I toggle the contextual panel')
def when_i_toggle_the_contextual_panel(step):
    assert True, 'This step must be implemented'
@step(u'Then the contextual panel is collapsed')
def then_the_contextual_panel_is_collapsed(step):
    assert True, 'This step must be implemented'    