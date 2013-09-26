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

@step(u'Then the "([^"]*)" cluster marker at "([^"]*), ([^"]*)" is for "([^"]*)" points')
def then_the_cluster_marker_at_latlng_is_for_num_points(step, layer, lat, lng, num_points):
    assert_equals(world.page.cluster_count(layer, lat, lng), int(num_points));


@step(u'When I toggle the \'([^\']*)\' checkbox')
@step(u'And I toggle the \'([^\']*)\' checkbox')
def and_i_uncheck_the_key_checkbox(step, checkboxkey):
    world.page.toggle_checkbox(checkboxkey)

@step(u'Then \'([^\']*)\' water point circle markers will be displayed on the map')
def then_group1_water_point_circle_markers_will_be_displayed_on_the_map(step, group1):
    assert True, 'This step must be implemented'


#is this step possible?
@step(u'And Markers are displayed on top of each other')
def and_markers_are_displayed_on_top_of_each_other(step):
    assert True, 'This step must be implemented'

@step(u'Then Then marker clusters of water points will be displayed instead')
def then_then_marker_clusters_of_water_points_will_be_displayed_instead(step):
    assert True, 'This step must be implemented'

@step(u'When I  hover over the water point maker at 23.0000, 11.0000')
def when_i_hover_over_the_water_point_maker_at_23_0000_11_0000(step):
    assert True, 'This step must be implemented'
@step(u'Then a summary of information about the marker is displayed')
def then_a_summary_of_information_about_the_marker_is_displayed(step):
    assert True, 'This step must be implemented'
@step(u'And the summary information about the water point marker at ... is displayed')
def and_the_summary_information_about_the_water_point_marker_at_is_displayed(step):
    assert True, 'This step must be implemented'
@step(u'When I hover away from a marker')
def when_i_hover_away_from_a_marker(step):
    assert True, 'This step must be implemented'
@step(u'Then the summary information is removed.')
def then_the_summary_information_is_removed(step):
    assert True, 'This step must be implemented'
@step(u'Then the summary information is removed')
def then_the_summary_information_is_removed(step):
    assert True, 'This step must be implemented'

@step(u'When I navigate to \'([^\']*)\' sub county')
def when_i_navigate_to_group1_sub_county(step, group1):
    assert True, 'This step must be implemented'
@step(u'Then health centre marker icons will be displayed on the map')
def then_health_centre_marker_icons_will_be_displayed_on_the_map(step):
    assert True, 'This step must be implemented'
@step(u'Then school marker icons will be displayed on the map')
def then_school_marker_icons_will_be_displayed_on_the_map(step):
    assert True, 'This step must be implemented'
@step(u'When I navigate to the home page')
def when_i_navigate_to_the_home_page(step):
    assert True, 'This step must be implemented'
@step(u'Then the \'([^\']*)\' filter will be displayed on the filter panel')
def then_the_group1_filter_will_be_displayed_on_the_filter_panel(step, group1):
    assert True, 'This step must be implemented'
    
@step(u'When I hover away from a "([^"]*)" marker at "([^"]*)"')
def when_i_hover_away_from_a_group1_marker_at_group2(step, group1, group2):
    assert True, 'This step must be implemented'

# Toggle on off scenarios for toggle on/off filters for schools, waterpoints, healthcentres

@step(u'When I check the \'([^\']*)\' checkbox')
def when_i_check_the_group1_checkbox(step, group1):
    assert True, 'This step must be implemented'
@step(u'And I open the dashboard for  "([^"]*)"')
def and_i_open_the_dashboard_for_group1(step, group1):
    assert True, 'This step must be implemented'
@step(u'When I uncheck the \'([^\']*)\' checkbox')
def when_i_uncheck_the_group1_checkbox(step, group1):
    assert True, 'This step must be implemented'
@step(u'Then the "([^"]*)" cluster marker at "([^"]*)" will be removed from the map')
def then_the_group1_cluster_marker_at_group2_will_be_removed_from_the_map(step, group1, group2):
    assert True, 'This step must be implemented'    


