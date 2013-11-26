from lettuce import *
from pages.page import *
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


