import time
import itertools
class Page:
    base_url = "http://localhost:5000"
    
    def __init__(self, browser):
        self.browser = browser

    def visit_national_dashboard(self):
        self.browser.visit("%s/?test=true" % self.base_url)

    def visit_district_dashboard(self, district_name):
        self.browser.visit("%s/district/%s?test=true" % (self.base_url, district_name))

    def visit_subcounty_dashboard(self, district_name, subcounty_name):
        self.browser.visit("%s/district/%s/%s?test=true" % (self.base_url, district_name, subcounty_name))

    def breadcrumbs(self):
        crumbs = map(lambda crumb:crumb.value, self.browser.find_by_css("#location .breadcrumb a"))
        return " - ".join([crumb for crumb in crumbs if crumb != ""])

    def quit(self):
        self.browser.quit()

    def current_position(self):
        center = self.browser.evaluate_script("window.map.getCenter()")
        return [round(center[0], 4), round(center[1], 4)]

    def current_zoom(self):
        zoom = self.browser.evaluate_script("window.map.getZoom()")
        return int(zoom)

    def current_layers(self):
        return self.browser.evaluate_script("window.map.getLayers()")        

    def selected_layer(self):
        return self.browser.evaluate_script("window.map.getSelectedLayer()")

    def hash_location(self, location_name):
        locations = location_name.lower().split(", ")
        district_name = ("'%s'" % locations[0]) if len(locations) > 0 else "null"
        subcounty_name = ("'%s'" % locations[1]) if len(locations) > 1 else "null"
        parish_name = ("'%s'" % locations[2]) if len(locations) > 2 else "null"
        return "{ district: %s, subcounty: %s, parish: %s}" % (district_name, subcounty_name, parish_name)

    def take_screenshot(self):
        self.browser.driver.save_screenshot('screenshot_%s.png' % time.strftime("%m-%d-%I-%H:%I:%M:%S"))

    def highlighted_layer(self):
        return self.browser.evaluate_script("window.map.getHighlightedLayer();")

    def click_on_layer(self, location_name):
        location_hash = self.hash_location(location_name)
        self.browser.execute_script("window.map.clickLayer(%s)" % location_hash)

    def is_displayed(self, location_name):
        location_hash = self.hash_location(location_name)
        self.browser.evaluate_script("window.map.isDisplayed(%s)" % location_hash)

    def hover_over(self, location_name):
        self.wait_for(lambda page: page.is_displayed(location_name))
        location_hash = self.hash_location(location_name)
        self.browser.execute_script("window.map.highlightLayer(%s)" % location_hash)

    def click_district_breadcrumb(self):
        self.browser.find_by_css("#location .breadcrumb .district-crumb").first.click()

    def click_national_breadcrumb(self):
        self.browser.find_by_css("#location .breadcrumb .national-crumb").first.click()

    def hover_over_popup(self, layer, lat, lng):
        self.browser.execute_script("window.map.openPopupForMarkerAt('%s', '%s', '%s');" % (layer, lat, lng))

    def cluster_count(self, layer, lat, lng):
        time.sleep(2)
        content = self.browser.find_by_css(".cluster-icon [data-lat='%s'][data-lng='%s']" % (lat, lng)).text
        return int(content)

    def popup_content(self):
        return self.browser.find_by_css(".marker-popup").text

    def wait_for(self, function):
        for _ in itertools.repeat(None, 10):
            if (function(self)):    
                break
            time.sleep(0.5)


