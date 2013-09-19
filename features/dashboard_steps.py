from lettuce import *
from page import *
from nose.tools import *
from time import *

@step(u'Given that I am a regular user')
def given_that_i_am_a_regular_user(step):
    world.page = Page(world.browser)

@step(u'When I open dashboard for (\w+)$')
def when_i_open_district_dashboard_for_(step, district):
    world.page.visit_district_dashboard(district)

@step(u'When I open dashboard for (\w+) (\w+)$')
def when_i_open_subcounty_dashboard_for_(step, district, subcounty):
    world.page.visit_subcounty_dashboard(district, subcounty)

@step(u'When I go to the homepage')
def when_i_go_to_the_homepage(step):
    world.page.visit_national_dashboard()

@step(u'Then I see map of (.+)')
def then_i_see_map_of(step, title):
    world.page.wait_for(lambda page: title == page.breadcrumbs())
    assert_equals(world.page.breadcrumbs(), title)

@step(u'And It is centered on (.+), (.+) at (.+) zoom')
def and_it_is_centered_on(step, lat, lng, zoom):
    coordinates = [float(lat), float(lng)]
    world.page.wait_for(lambda page: page.current_position() == coordinates)
    assert_equals(world.page.current_position(), coordinates)
    assert_equals(world.page.current_zoom(), int(zoom))

@step(u'And I see the layer "([^"]*)" displayed')
@step(u'Then I see the layer "([^"]*)" displayed')
def then_i_see_the_layer_district_displayed(step, layer_name):
    world.page.wait_for(lambda page: layer_name in page.current_layers())
    assert_in(layer_name.lower(), world.page.current_layers())

@step(u'When I click on \"(.+)\" in \"(.+)\"')
@step(u'And I click on \"(.+)\" in \"(.+)\"')
def when_i_click_on_layer(step, name, layer_name):
    world.page.click_on_layer(name, layer_name)

@step(u'When I hover over \"(.+)\" in \"(.+)\"$')
@step(u'And I hover over \"(.+)\" in \"(.+)\"$')
def when_i_hover_ove(step, district, level):
    world.page.hover_over(district.lower(), level.lower())

@step(u'Then \"(.+)\" in \"(.+)\" will be selected')
def then_the_district_will_be_selected(step, name, level):
    world.page.wait_for(lambda page: page.selected_layer(level.lower()) == name.lower())
    assert_equals(world.page.selected_layer(level.lower()), name.lower())

@step(u'Then \"(.+)\" in \"(.+)\" will be highlighted')
def then_the_district_will_be_highlighted(step, district, layer_name):
    assert_equals(world.page.highlighted_layer(layer_name), district.lower())

@step(u'And I click on the district breadcrumb link')
def and_i_click_on_the_district_breadcrumb_link(step):
    world.page.click_district_breadcrumb()

@step(u'And I click on the national breadcrumb link')
def and_i_click_on_the_national_breadcrumb_link(step):
    world.page.click_national_breadcrumb()

# STEPS to be implemented

@step(u'And I navigate to "([^"]*)"')
def and_i_navigate_to_group1(step, group1):
    assert True, 'This step must be implemented'

@step(u'Then a page with an error message is displayed')
def then_a_page_with_an_error_message_is_displayed(step):
    assert True, 'This step must be implemented'
    
@step(u'And the page has a link to the homepage')
def and_the_page_has_a_link_to_the_homepage(step):
    assert True, 'This step must be implemented'