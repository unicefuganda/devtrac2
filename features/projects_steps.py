from lettuce import *
from page import *
from nose.tools import *
from time import *

@step(u'And I click on the project Icon at latitude "([^"]+)" and logitude "([^"]+)"')
def and_i_click_on_the_project_icon_at_latitude_and_logitude(step, lat, lng):
    world.page.click_marker_at(lat, lng)

@step(u'Then the bottom panel contains the following details:')
def then_the_bottom_panel_contains_the_following_details(step):
    world.page.take_screenshot();
    world.page.wait_for(lambda page: page.extra_info_content() == step.multiline)
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

@step(u'And I filter by Partner for "([^"]+)"')
def and_i_filter_by_partner(step, partner):
    world.page.filter_by_partner(partner)

@step(u'And I filter by Year for "([^"]+)"')
def and_i_filter_by_end_date(step, year):
    world.page.filter_by_year(year)

@step(u'And there are "([^"]*)" unicef projects in "([^"]*)"')
@step(u'Then there are "([^"]*)" unicef projects in "([^"]*)"')
def there_are_unicef_projects(step, num_projects, locator): 
    assert_equals(world.page.marker_count('unicef', locator), int(num_projects));

@step(u'Then there are "([^"]*)" usaid projects in "([^"]*)"')
def there_are_usaid_projects(step, num_projects, locator): 
    assert_equals(world.page.marker_count('usaid', locator), int(num_projects));

@step(u'And there are no usaid projects in "([^"]*)"')
def there_are_no_usaid_projects(step, locator): 
    assert_false(world.page.marker_visible('usaid', locator));

