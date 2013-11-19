from lettuce import *
from pages.report_page import *
from nose.tools import *

@step(u'When I download the report for \'([^\']*)\'')
def when_i_download_the_report_for_group1(step, locator):
    world.report_page = ReportPage(world.browser)
    world.report_page.open_report(locator)

@step(u'Then the listed projects should be')
def then_the_listed_projects_should_be(step):
    assert_multi_line_equal.im_class.maxDiff = None
    assert_multi_line_equal(world.report_page.project_names(), step.multiline)

@step(u'And the listed sites visits should be')
def and_the_listed_sites_visits_should_be(step):
    assert_multi_line_equal.im_class.maxDiff = None
    assert_multi_line_equal(world.report_page.site_visits(), step.multiline)