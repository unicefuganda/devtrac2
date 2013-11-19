from lettuce import *
from nose.tools import *
from time import *

# contextual panel info

@step(u'Then The following information will be shown contextual panel')
def then_the_following_information_will_be_shown_contextual_panel(step):
    world.page.wait_for(lambda page: page.summary_panel_content() == step.multiline) 
    assert_equals(world.page.summary_panel_content(), step.multiline);
    
@step(u'Then The forllowing information will be shown on the')
def then_the_forllowing_information_will_be_shown_on_the(step):
    assert True, 'This step must be implemented'    