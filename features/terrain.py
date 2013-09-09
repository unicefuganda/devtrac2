from lettuce import *
from splinter import Browser

@before.all
def setup_all():
	world.browser = Browser("firefox")

@after.all
def teardown_all(self):
	world.browser.quit()