import globals
import time
import urllib
import urllib2


class ReportPage:

    def __init__(self, browser):
        self.browser = browser

    def open_report(self, locator):
        self.browser.visit("%s/print?locator=%s" % (globals.base_url, urllib.quote(locator, '')))

    def project_names(self): 
        project_names = [elem.text for elem in self.browser.find_by_css(".projects h3")]
        return "\n".join(project_names)

    def site_visits(self): 
        project_names = [elem.text for elem in self.browser.find_by_css(".siteVisits h3")]
        return "\n".join(project_names)

    def summary(self): 
        return self.browser.find_by_id("summary").text

    def download_report(self, locator):
        self.report = urllib2.urlopen('%s/devtrac_report/%s' % (globals.base_url, urllib.quote(locator, '')))

    def file_content_type(self):
        return self.report.info()['Content-Type']
    
        
        