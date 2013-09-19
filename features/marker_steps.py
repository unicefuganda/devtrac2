from lettuce import *
from page import *
from nose.tools import *
from time import *

# Steps to be implemented


@step(u'Given that I am a user')
def given_that_i_am_a_user(step):
    assert True, 'This step must be implemented'
@step(u'When I navigate to the \'([^\']*)\' sub county')
def when_i_navigate_to_the_group1_sub_county(step, group1):
    assert True, 'This step must be implemented'
@step(u'Then \'([^\']*)\' water point circle markers will be displayed on the map')
def then_group1_water_point_circle_markers_will_be_displayed_on_the_map(step, group1):
    assert True, 'This step must be implemented'
@step(u'When I navigate to \'([^\']*)\' District')
def when_i_navigate_to_group1_district(step, group1):
    assert True, 'This step must be implemented'
@step(u'Then Then marker clusters of water points will be displayed')
def then_then_marker_clusters_of_water_points_will_be_displayed(step):
    assert True, 'This step must be implemented'