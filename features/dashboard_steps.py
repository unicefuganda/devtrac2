from lettuce import *
from page import *
from nose.tools import assert_equals
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
     assert_equals(world.page.current_layer(), layer_name)

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

@step(u'When I click on Gulu from the national dashboard')
def when_i_click_on_gulu_from_the_national_dashboard(step, district):
#assert False

@step(u'Then Gulu district will be displayed on the map')
def then_gulu_district_will_be_displayed_on_the_map(step, district):
#assert False

@step(u'And The map will be centered to 32.429742872960915, 2.836377471066367')
def and_the_map_will_be_centered_to_32_429742872960915_2_836377471066367(step, district):
#assert False