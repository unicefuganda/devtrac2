from lettuce import *
from page import *
from nose.tools import *
from time import *


@step(u'And I select ureport question "([^"]*)"')
def and_i_select_ureport_question(step, question):
    world.page.select_ureport_question(question)

@step(u'Then I should see a pie chart of')
def then_i_should_see_a_pie_chart_of(step):
    world.page.wait_for(lambda page: page.ureport_results() == step.multiline)
    assert_equals(world.page.ureport_results(), step.multiline)

@step(u'And I select a ureport question "([^"]*)"')
def and_i_select_a_ureport_question_group1(step, group1):
    assert True, 'This step must be implemented'
@step(u'Then the bottom panel will be displayed')
def then_the_bottom_panel_will_be_displayed(step):
    assert True, 'This step must be implemented'
@step(u'And A badge indicating the highest reponse will be displayed for each district')
def and_a_badge_indicating_the_highest_reponse_will_be_displayed_for_each_district(step):
    assert True, 'This step must be implemented'
@step(u'And 5 reponses for "([^"]*)" will be displayed on bottom panel')
def and_5_reponses_for_group1_will_be_displayed_on_bottom_panel(step, group1):
    assert True, 'This step must be implemented'