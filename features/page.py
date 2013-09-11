import time
import itertools
class Page:
    base_url = "http://localhost:5000"
    
    def __init__(self, browser):
        self.browser = browser

    def visit_district_dashboard(self, district_name):
        self.browser.visit("%s/district/%s" % (self.base_url, district_name))

    def visit_national_dashboard(self):
        self.browser.visit("%s/" % self.base_url)

    def title(self):
        return self.browser.find_by_css("#location .title").first.value

    def quit(self):
        self.browser.quit()

    def current_position(self):
        center = self.browser.evaluate_script("window.map.getCenter()")
        return [round(center[0], 4), round(center[1], 4)]

    def current_zoom(self):
        zoom = self.browser.evaluate_script("window.map.getZoom()")
        return int(zoom)

    def current_layer(self):
        return self.browser.evaluate_script("window.map.getLayer()")        

    def selected_district(self):
        return self.browser.evaluate_script("window.map.getSelectedDistrict()")

    def highlighted_district(self):
        return self.browser.evaluate_script("window.map.getHighlightedDistrict()")

    def click_on_district(self, district):
        self.browser.execute_script("window.map.selectDistrict('%s')" % district.lower())

    def hover_over_district(self, district):
        self.browser.execute_script("window.map.highlightDistrict('%s')" % district.lower())

    def wait_for(self, function):
        for _ in itertools.repeat(None, 10):
            if (function()):
                break
            print "wait 2"
            time.sleep(2)


