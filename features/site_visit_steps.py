from lettuce import *
from page import *
from nose.tools import *
from time import *

@step(u'Then the Site Visit list contains:')
def then_the_site_visit_list_contains(step):
    assert_multi_line_equal.im_class.maxDiff = None
    assert_multi_line_equal(world.page.site_visit_list_content(), step.multiline)
