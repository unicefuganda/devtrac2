from lettuce import *
from page import *
from nose.tools import *
from time import *

@step(u'Given that I am a regular user')
def given_that_i_am_a_regular_user(step):
    world.page = Page(world.browser)

@step(u'When I open dashboard for (\w+)')
def when_i_open_dashboard_for_(step, district):
    world.page.visit_district_dashboard(district)

@step(u'When I go to the homepage')
def when_i_go_to_the_homepage(step):
    world.page.visit_national_dashboard()

@step(u'Then I see map of (.+)')
def then_i_see_map_of(step, title):
    assert_equals(world.page.title(), title)

@step(u'And It is centered on (.+), (.+) at (.+) zoom')
def and_it_is_centered_on(step, lat, lng, zoom):
    coordinates = [float(lat), float(lng)]
    world.page.wait_for(lambda page: page.current_position() == coordinates)
    assert_equals(world.page.current_position(), coordinates)
    assert_equals(world.page.current_zoom(), int(zoom))

@step(u'Then I see the layer "([^"]*)" displayed')
def then_i_see_the_layer_district_displayed(step, layer_name):    
     assert_in(layer_name, world.page.current_layers())

@step(u'When I click on (.+) district')
@step(u'And I click on (.+) district')
def when_i_click_on_district(step, district):
    world.page.click_on_district(district)

@step(u'When I hover over (.+) district')
@step(u'And I hover over (.+) district')
def when_i_hover_over_district(step, district):
    world.page.hover_over_district(district)

@step(u'Then the (.+) district will be selected')
def then_the_district_will_be_selected(step, district):
    assert_equals(world.page.selected_district(), district.lower())

@step(u'Then the (.+) district will be highlighted')
def then_the_district_will_be_highlighted(step, district):
    assert_equals(world.page.highlighted_district(), district.lower())

# 

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

#

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

@step(u'Then The back ground color of the search text field will change to hex FF9999')
def then_the_back_ground_color_of_the_search_text_field_will_change_to_hex_ff9999(step):
    assert True, 'This step must be implemented'