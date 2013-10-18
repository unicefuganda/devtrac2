from lettuce import *
from splinter import Browser

window_sizes = {"phantomjs": [1280, 800], "firefox": [1280, 880]}
@before.all
def setup_all():
    browser = "phantomjs"
    world.browser = Browser(browser)
    world.browser.driver.set_window_size(window_sizes[browser][0], window_sizes[browser][1])

@after.all
def teardown_all(self):
    world.browser.quit()