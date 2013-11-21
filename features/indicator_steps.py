from lettuce import *
from nose.tools import *
from time import *

@step(u'Then the indicator layer is not displayed')
def then_the_indicator_layer_is_not_displayed(step):
    assert world.page.is_indicator_layer_hidden()

@step(u'When I change indicator to "([^"]*)"')
def when_i_change_indicator(step, indicator_name):
    world.page.change_indicator(indicator_name)
    
@step(u'Then the "([^"]*)" indicator layer is displayed')
def then_the_indicator_layer_is_displayed(step, indicator_name):
    IsDisplayed = world.page.is_indicator_layer_displayed(indicator_name)
    assert_true(IsDisplayed)

@step(u'And the indicator map label is "([^"]*)"')
def then_the_indicator_layer_is_displayed(step, indicator_name):
    indicator_label = world.page.indicator_name_label()
    assert_equals(indicator_label, indicator_name)


