from lettuce import *
from page import *
from nose.tools import *
from time import *

@step(u'And I click on the project Icon at latitude "([^"]+)" and logitude "([^"]+)"')
def and_i_click_on_the_project_icon_at_latitude_and_logitude(step, lat, lng):
    world.page.click_marker_at(lat, lng)

@step(u'Then the bottom panel contains the following details:')
def then_the_bottom_panel_contains_the_following_details(step):
    assert_equals(world.page.extra_info_content(), step.multiline)

@step(u'And I filter by Sector for "([^"]+)"')
def and_i_filter_by_sector(step, sector):
    world.page.filter_by_sector(sector)

@step(u'And I filter by Status for "([^"]+)"')
def and_i_filter_by_sector(step, status):
    world.page.filter_by_status(status)

@step(u'And I filter by Implementing Partner for "([^"]+)"')
def and_i_filter_by_implementing_partner(step, implementing_partner):
    world.page.filter_by_implementing_partner(implementing_partner)

@step(u'Then there are "([^"]*)" unicef projects in "([^"]*)"')
def there_are_unicef_projects(step, num_projects, locator): 
    assert_equals(world.page.marker_count('unicef', locator), int(num_projects));

@step(u'Then there are "([^"]*)" usaid projects in "([^"]*)"')
def there_are_usaid_projects(step, num_projects, locator): 
    assert_equals(world.page.marker_count('usaid', locator), int(num_projects));
