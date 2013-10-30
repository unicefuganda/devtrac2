from lettuce import *
from page import *
from nose.tools import *
from time import *

@step(u'And I click on the project Icon at latitude "([^"]+)" and logitude "([^"]+)"')
def and_i_click_on_the_project_icon_at_latitude_and_logitude(step, lat, lng):
    world.page.click_marker_at(lat, lng)

@step(u'Then the bottom panel contains the following details:')
def then_the_bottom_panel_contains_the_following_details(step):
    for details in step.hashes:
        assert_true(details['detail'] in world.page.extra_info_content())