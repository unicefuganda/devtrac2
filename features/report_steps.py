from lettuce import *
from pages.report_page import *
from nose.tools import *
import os
import urllib2


@step(u'When I open the report for \'([^\']*)\'')
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


@step(u'When I download the report for \'([^\']*)\'')
def download_report(step, locator):
    world.report_page = ReportPage(world.browser)
    world.report_page.download_report(locator)

@step(u'Then the file is a pdf')
def then_the_file_is_a_pdf(step):
    assert_equals(world.report_page.file_content_type(), 'application/pdf')

    