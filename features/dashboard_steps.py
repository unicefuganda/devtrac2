from lettuce import *
from page import *
from nose.tools import assert_equals
from time import *

@step(u'Given that I am a regular user')
def given_that_i_am_a_regular_user(step):
    pass

@step(u'When I open dashboard for (\w+)')
def when_i_open_dashboard_for_(step, district):
    world.page = Page(world.browser)
    world.page.visit_district_dashboard(district)

@step(u'When I go to the homepage')
def when_i_go_to_the_homepage(step):
    world.page = Page(world.browser)
    world.page.visit_national_dashboard()

@step(u'Then I see map of (.+)')
def then_i_see_map_of(step, title):
    assert_equals(world.page.title(), title)


@step(u'And It is centered on (.+), (.+)')
def and_it_is_centered_on(step, lat, lng):
    assert_equals(world.page.current_position(), [float(lat), float(lng)])