from lettuce import *
from page import *
from nose.tools import assert_equals
from time import *

@step(u'When I open dashboard for (\w+)')
def when_i_open_dashboard_for_(step, district):
    world.page = Page(world.browser)
    world.page.visit("http://localhost:5000/#/district/%s" % district)
    sleep(0.5)
    

@step(u'Then I see (.+) as the title')
def then_i_see_kamapala_title(step, title):
	assert_equals(world.page.title(), title)