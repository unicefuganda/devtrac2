from lettuce import *
from splinter import Browser
from page import Page
import datetime
import globals

window_sizes = {"phantomjs": [1280, 800], "firefox": [1280, 880]}
@before.all
def setup_all():
    browser = "phantomjs"
    globals.init() 
    world.browser = Browser(browser)
    world.browser.driver.set_window_size(window_sizes[browser][0], window_sizes[browser][1])

@before.each_scenario
def start_timings(scenario):    
    globals.method_timings[scenario.name] = { 'start': datetime.datetime.now() }


@after.each_scenario
def end_timing(scenario):
    globals.method_timings[scenario.name]['end'] = datetime.datetime.now()

@after.all
def teardown_all(self):
    world.browser.quit()
    # print ("Number of Waits = %s" % globals.wait_count)

    # for timing in globals.method_timings:
    #     diff = globals.method_timings[timing]['end'] - globals.method_timings[timing]['start']
    #     print ("Scenario %s = %s" % (timing, diff))
