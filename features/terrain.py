from lettuce import *
from splinter import Browser

@before.all
def setup_all():
    world.browser = Browser("phantomjs")
    world.browser.driver.set_window_size(1280,800)

# @after.each_scenario
# def get_screenshot(self): 
#     world.browser.driver.get_screenshot_as_file('tmp/screenshot.png')

@after.all
def teardown_all(self):
    world.browser.quit()