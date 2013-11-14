from lettuce import *
from page import *
from nose.tools import *
from time import *

@step(u'Then the Site Visit list contains:')
def then_the_site_visit_list_contains(step):
    assert_multi_line_equal.im_class.maxDiff = None
    assert_multi_line_equal(world.page.site_visit_list_content(), step.multiline)

@step(u'And I click on the site visit Icon at "([^"]*), ([^"]*)"')
def and_i_click_on_the_site_visit_icon_at_latitude_and_logitude(step, lat, lng):
    world.page.click_marker_at(lat, lng)

@step(u'Then the site visit details should have content:')
def then_the_site_visit_details_should_have_content(step):
   assert_multi_line_equal.im_class.maxDiff = None
   assert_multi_line_equal(world.page.site_visit_details_content(), step.multiline)

@step(u'And I click on the site visit link "([^"]*)"')
def and_i_click_on_the_site_visit_link(step, site_visit):
   world.page.click_site_visit_link(site_visit);

@step(u'And I click on site visit pagination link "([^"]*)"')
def and_i_click_on_the_pagination_link(step, pager_link):
    world.page.click_site_visit_pagination_link(pager_link);