from lettuce import *
from page import *
from nose.tools import *
from time import *

@step(u'Given that I am a regular user')
def given_that_i_am_a_regular_user(step):
    world.page = Page(world.browser)

@step(u'When I open dashboard for "([^"]*)"')
def when_i_open_dashboard_for_(step, location_name):
    world.page.visit_dashboard(location_name)

@step(u'When I go to the homepage')
def when_i_go_to_the_homepage(step):
    world.page.visit_national_dashboard()

@step(u'Then I see map of (.+)')
def then_i_see_map_of(step, title):
    world.page.wait_for(lambda page: title == page.breadcrumbs())
    assert_equals(world.page.breadcrumbs(), title)

@step(u'Then the "([^"]*)" layer for "([^"]*)" is displayed')
def then_i_see_the_layer__displayed(step, layer_name, location_name):
    name = "%s - %s" % (layer_name.lower(), location_name.lower())
    world.page.wait_for(lambda page: name in page.displayedLayerNames())
    assert_in(name, world.page.displayedLayerNames())

@step(u'Then the "([^"]*)" layer for "([^"]*)" is not displayed')
def then_i_see_layer_for_checkboxkey_is_not_displayed(step, layer_name, location_name):
     name = "%s - %s" % (layer_name.lower(), location_name.lower())
     world.page.wait_for(lambda page: not (name in page.displayedLayerNames()))
     assert_not_in(name, world.page.displayedLayerNames())

@step(u'When I click on \"(.+)\"')
@step(u'And I click on \"(.+)\"')
def when_i_click_on_layer(step, location_name):
    world.page.click_on_layer(location_name)

@step(u'When I hover over \"(.+)\"$')
@step(u'And I hover over \"(.+)\"$')
def when_i_hover_over(step, location_name):
    world.page.hover_over(location_name)

@step(u'Then \"(.+)\" will be selected')
def then_the_location_will_be_selected(step, location_name):
    world.page.wait_for(lambda page: page.selected_layer() == location_name.lower())
    assert_equals(world.page.selected_layer(), location_name.lower())

@step(u'Then \"(.+)\" will be highlighted')
def then_the_location_will_be_highlighted(step, location_name):
    world.page.wait_for(lambda page: page.highlighted_layer() == location_name.lower())
    assert_equals(world.page.highlighted_layer(), location_name.lower())

@step(u'And I click on the district breadcrumb link')
def and_i_click_on_the_breadcrumb_link(step):
    world.page.click_district_breadcrumb()

@step(u'And I click on the national breadcrumb link')
def and_i_click_on_the_breadcrumb_link(step):
    world.page.click_national_breadcrumb()

# STEPS to be implemented

@step(u'When I go to the home page')
def when_i_go_to_the_home_page(step):
    assert True, 'This step must be implemented'

@step(u'Then A white Div html element will be displayed at the top of the page')
def then_a_white_div_html_element_will_be_displayed_at_the_top_of_the_page(step):
    assert True, 'This step must be implemented'

@step(u'And It will be of Height 150px')
def and_it_will_be_of_height_150px(step):
    assert True, 'This step must be implemented'

@step(u'Then A header \'([^\']*)\' will be displayed on the left side of the header bar')
def then_a_header_group1_will_be_displayed_on_the_left_side_of_the_header_bar(step, group1):
    assert True, 'This step must be implemented'

@step(u'When I go to the national dashboard')
def when_i_go_to_the_national_dashboard(step):
    assert True, 'This step must be implemented'

@step(u'Then A search text box, with watermarked text \'([^\']*)\' in it, will be displayed next to the header \'([^\']*)\'')
def then_a_search_text_box_with_watermarked_text_group1_in_it_will_be_displayed_next_to_the_header_group2(step, group1, group2):
    assert True, 'This step must be implemented'

@step(u'And Enter \'([^\']*)\' into the search text box')
def and_enter_group1_into_the_search_text_box(step, group1):
    assert True, 'This step must be implemented'

@step(u'And Press Enter')
def and_press_enter(step):
    assert True, 'This step must be implemented'

@step(u'Then the map Uganda - Gulu will be displayed')
def then_the_map_uganda_gulu_will_be_displayed(step):
    assert True, 'This step must be implemented'

@step(u'And  Centered on 2.8762, 32.4767 at 8 zoom')
def and_centered_on_2_8762_32_4767_at_8_zoom(step):
    assert True, 'This step must be implemented'

@step(u'Then The back ground color of the search text field will change to hex FF6666')
def then_the_back_ground_color_of_the_search_text_field_will_change_to_hex_ff6666(step):
    assert True, 'This step must be implemented'

@step(u'And I navigate to "([^"]*)"')
def and_i_navigate_to_group1(step, group1):
    assert True, 'This step must be implemented'
@step(u'Then a page with an error message is displayed')
def then_a_page_with_an_error_message_is_displayed(step):
    assert True, 'This step must be implemented'
@step(u'And the page has a link to the homepage')
def and_the_page_has_a_link_to_the_homepage(step):
    assert True, 'This step must be implemented'

@step(u'When I open dashboard for region "([^"]*)"')
def when_i_open_dashboard_for_region_group1(step, group1):
    assert True, 'This step must be implemented'
@step(u'Then region "([^"]*)" will be selected')
def then_region_group1_will_be_selected(step, group1):
    assert True, 'This step must be implemented'
@step(u'And I hover over region "([^"]*)"')
def and_i_hover_over_region_group1(step, group1):
    assert True, 'This step must be implemented'
@step(u'Then region "([^"]*)" will be highlighted')
def then_region_group1_will_be_highlighted(step, group1):
    assert True, 'This step must be implemented'
@step(u'And I click on region "([^"]*)"')
def and_i_click_on_region_group1(step, group1):
    assert True, 'This step must be implemented'
@step(u'Then I see Uganda map with region acholi displayed')
def then_i_see_uganda_map_with_region_acholi_displayed(step):
    assert True, 'This step must be implemented'