from lettuce import *
from nose.tools import *
from time import *

@step(u'And I click on the project Icon at latitude "([^"]+)" and logitude "([^"]+)"')
def and_i_click_on_the_project_icon_at_latitude_and_logitude(step, lat, lng):
    world.page.click_marker_at(lat, lng)

@step(u'Then the project details are:')
def then_the_bottom_panel_contains_the_following_details(step):
    world.page.wait_for(lambda page: page.extra_info_content() == step.multiline)
    assert_multi_line_equal.im_class.maxDiff = None
    assert_multi_line_equal(world.page.extra_info_content(), step.multiline)

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
    world.page.wait_for(lambda page: page.marker_count_pins(locator) == int(num_projects))
    assert_equals(world.page.marker_count_pins(locator), int(num_projects))

@step(u'Then there are "([^"]*)" usaid projects in "([^"]*)"')
def there_are_usaid_projects(step, num_projects, locator): 
    world.page.wait_for(lambda page: page.marker_count_pins(locator) == int(num_projects))
    assert_equals(world.page.marker_count_pins(locator), int(num_projects))

@step(u'And there are no usaid projects in "([^"]*)"')
def there_are_no_usaid_projects(step, locator): 
    assert_false(world.page.marker_visible('usaid', locator));

@step(u'And I click on the project link "([^"]*)"')
def and_i_click_on_the_project_link(step, project):
    world.page.click_link(project);

@step(u'And I click on the pagination link "([^"]*)"')
def and_i_click_on_the_pagination_link(step, pager_link):
    world.page.click_link(pager_link);

@step(u'Then the project list contains:')
def then_the_project_list_contains(step):
    assert_multi_line_equal.im_class.maxDiff = None
    assert_multi_line_equal(world.page.project_list_content(), step.multiline)

@step(u'Then the color of the pin is \'([^\']*)\'')
def then_the_color_of_the_pin_is(step, color):
    assert_equals(len(world.page.find_pin_with_color(color)), 1)

@step(u'Then the Status filter displays options:')
def then_the_status_filter_displays_options(step):
    assert_multi_line_equal(world.page.status_choices(), step.multiline)

@step(u'Then the Sector filter displays options:')
def then_the_sector_filter_displays_options(step):
    assert_multi_line_equal(world.page.sector_choices(), step.multiline)

@step(u'Then the Implementing Partners filter displays options:')
def then_the_implementing_partners_filter_displays_options(step):
    

    world.page.wait_for(lambda page: page.implementing_partners_chosen_options() == step.multiline)
    assert_multi_line_equal.im_class.maxDiff = None
    assert_multi_line_equal(world.page.implementing_partners_chosen_options(), step.multiline)

@step(u'Then the Funding Partners filter displays options:')
def then_the_funding_partners_filter_displays_options(step):
    
    world.page.wait_for(lambda page: page.funding_partners_chosen_options() == step.multiline)
    assert_multi_line_equal(world.page.funding_partners_chosen_options(), step.multiline)

@step(u'Then I the projects legend labels are:')
def then_i_the_projects_legend_labels_are(step):
	assert_multi_line_equal.im_class.maxDiff = None
	assert_multi_line_equal(world.page.project_legend_content(), step.multiline)

@step(u'Then the legend color for "([^"]*)" is "([^"]*)"')
def then_the_legend_color_for_agency_is_colour(step, agency, color):
    assert world.page.has_legend_with(color, agency)

@step(u'And I choose accountable agency radio')
def and_i_choose_accountable_agency_radio(step):
    world.page.choose_accountable_agency()


