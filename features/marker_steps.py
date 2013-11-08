from lettuce import *
from page import *
from nose.tools import *
from time import *

# Steps to be implemented

@step(u'And I hover over a "(.*)" marker at "([^"]*), ([^"]*)"')
def and_i_hover_over_a_marker_at_lnglat(step, layer, lat, lng):
    world.page.hover_over_popup(layer, lat, lng)

@step(u'Then the popup should have content:')
def then_the_pop_should_have_content(step):
    assert_equals(world.page.popup_content(), step.multiline);

@step(u'Then the "([^"]*)" marker for "([^"]*)" is "([^"]*)" points')
def then_the_cluster_marker_at_latlng_is_for_num_points(step, layer, locator, num_points):
    assert_equals(world.page.marker_count(layer, locator), int(num_points));


@step(u'When I toggle the \'([^\']*)\' checkbox')
@step(u'And I toggle the \'([^\']*)\' checkbox')
def and_i_uncheck_the_key_checkbox(step, checkboxkey):
    world.page.toggle_checkbox(checkboxkey)

@step(u'And I select a pin for the "([^"]*)" Project on the map')
def when_i_select_a_pin_for_the_group1_on_the_map(step, project_name):
    world.page.select_project(project_name);

@step(u'Then locations relating to the "([^"]*)" will be highlighted on the map')
def then_locations_relating_to_the_group1_will_be_highlighted_on_the_map(step, project_name):
    assert_true(len(world.page.get_pins_for_project(project_name)) > 0);

