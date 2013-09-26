from lettuce import *
from splinter import Browser

@before.all
def setup_all():
    world.browser = Browser("phantomjs")
    world.browser.driver.set_window_size(1280,800)

@after.all
def teardown_all(self):
    world.browser.quit()