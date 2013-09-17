import time
import itertools
class Page:
    base_url = "http://localhost:5000"
    
    def __init__(self, browser):
        self.browser = browser

    def visit_national_dashboard(self):
        self.browser.visit("%s/" % self.base_url)

    def visit_district_dashboard(self, district_name):
        self.browser.visit("%s/district/%s" % (self.base_url, district_name))

    def visit_subcounty_dashboard(self, district_name, subcounty_name):
        self.browser.visit("%s/district/%s/%s" % (self.base_url, district_name, subcounty_name))

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

    def selected_layer(self, level):
        return self.browser.evaluate_script("window.map.getSelectedLayer('%s')" % level.lower())

    def highlighted_layer(self, layer_name):
        return self.browser.evaluate_script("window.map.getHighlightedLayer('%s')" % layer_name.lower())

    def click_on_layer(self, name, layer_name):
        self.browser.execute_script("window.map.clickLayer('%s', '%s')" % (layer_name.lower(), name.lower()))

    def hover_over(self, name, layer_name):
        self.browser.execute_script("window.map.highlightLayer('%s', '%s')" % (layer_name.lower(), name.lower()))

    def wait_for(self, function):
        for _ in itertools.repeat(None, 10):
            if (function(self)):    
                break
            time.sleep(0.5)


