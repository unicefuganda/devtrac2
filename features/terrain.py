from lettuce import *
from splinter import Browser

@before.each_scenario
def setup_all(self):
	world.browser = Browser("phantomjs")

@after.each_scenario
def teardown_all(self):
	world.browser.quit()