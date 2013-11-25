from lettuce import *
from nose.tools import *
from time import *


@step(u'And I select ureport question "([^"]*)"')
def and_i_select_ureport_question(step, question):
    world.page.select_ureport_question(question)

@step(u'Then I should see a pie chart of')
def then_i_should_see_a_pie_chart_of(step):
    world.page.wait_for(lambda page: page.ureport_results() == step.multiline)
    assert_equals(world.page.ureport_results(), step.multiline)