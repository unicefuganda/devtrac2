import time
import itertools
from pprint import pprint
import globals

class Page:
    
    def __init__(self, browser):
        self.browser = browser

    def visit_national_dashboard(self):
        self.browser.visit("%s/?basemap=test" % globals.base_url)

    def visit_dashboard(self, location_name):
        locations = location_name.lower().split(", ")
        url = ""
        if (len(locations) > 0):
            url += ("/%s" % locations[0]) 

        if (len(locations) > 1):
            url += ("/%s" % locations[1]) 

        if (len(locations) > 2):
            url += ("/%s" % locations[2]) 

        if (len(locations) > 3):
            url += ("/%s" % locations[3]) 
        self.browser.visit("%s/dashboard%s?basemap=test" % (globals.base_url, url))

    def breadcrumbs(self):
        crumbs = map(lambda crumb:crumb.text, self.browser.find_by_css("#location .breadcrumb li"))
        return " - ".join([crumb for crumb in crumbs if crumb != ""])

    def quit(self):
        self.browser.quit()

    def current_position(self):
        center = self.browser.evaluate_script("window.map.getCenter()")
        return [round(center[0], 4), round(center[1], 4)]

    def current_zoom(self):
        zoom = self.browser.evaluate_script("window.map.getZoom()")
        return int(zoom)

    def displayedLayerNames(self):
        return self.browser.evaluate_script("window.map.displayedLayerNames()")        

    def selected_layer(self):
        return self.browser.evaluate_script("window.map.getSelectedLayer()")

    def hash_location(self, location_name):
        locations = location_name.lower().split(", ")
        region_name = ("'%s'" % locations[0]) if len(locations) > 0 else "null"
        district_name = ("'%s'" % locations[1]) if len(locations) > 1 else "null"
        subcounty_name = ("'%s'" % locations[2]) if len(locations) > 2 else "null"
        parish_name = ("'%s'" % locations[3]) if len(locations) > 3 else "null"
        return "{ region: %s, district: %s, subcounty: %s, parish: %s}" % (region_name, district_name, subcounty_name, parish_name)

    def take_screenshot(self):
        self.browser.driver.save_screenshot('tmp/screenshots/screenshot_%s.png' % time.strftime("%m-%d-%I-%H:%I:%M:%S"))

    def highlighted_layer(self):
        return self.browser.evaluate_script("window.map.getHighlightedLayer();")

    def click_on_layer(self, location_name):
        location_hash = self.hash_location(location_name)
        self.browser.execute_script("window.map.clickLayer(%s)" % location_hash)

    def click_on_marker(self, layer, lat, lng):
        self.browser.execute_script("window.map.clickMarkerAt('%s', '%s', '%s');" % (layer, lat, lng))

    def is_displayed(self, location_name):
        location_hash = self.hash_location(location_name)
        return self.browser.evaluate_script("window.map.isDisplayed(%s)" % location_hash)

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

    def marker_count(self, layer, locator):
        content = self.browser.find_by_css(str( ".%s-cluster-icon[data-locator='%s']" % (layer, locator.lower())))
        return int(content.text)

    def marker_count_pins(self,locator):
        self.click_on_layer(locator)
        content = self.browser.find_by_css(".leaflet-marker-pane .pin")
        return len(content)

    def marker_visible(self, layer, locator):
        content = self.browser.find_by_css(str( ".%s-cluster-icon[data-locator='%s']" % (layer, locator.lower())))
        return len(content) > 0

    def popup_content(self):
        return self.browser.find_by_css(".marker-popup").text

    def toggle_filter_panel(self):
        self.browser.find_by_css(".filter-panel .close-panel").click()

    def is_filter_panel_expanded(self):
        return len(self.browser.find_by_css(".filter-panel.expanded")) > 0

    def toggle_checkbox(self, checkboxkey):
        return self.browser.find_by_css(str("#%s-checkbox" % checkboxkey)).click()

    def is_indicator_layer_hidden(self):
        return self.browser.evaluate_script("window.map.isIndicatorLayerHidden()")

    def indicator_legend_label(self):
        return self.browser.find_by_css(".heatmap-legend .legend-header").text

    def change_indicator(self, indicator_name):
        self.browser.find_link_by_text("Indicators").click()
        self.take_screenshot()
        self.browser.find_by_css(str("#filters-form .toggle[data-indicator='%s']" % indicator_name)).click()

    def is_indicator_layer_displayed(self, indicator_name): 
        return self.browser.evaluate_script("window.map.isIndicatorLayerDisplayed('%s')" % indicator_name)

    def summary_panel_content(self):
        return self.browser.find_by_css('#summary').text

    def site_visit_details_content(self):
        return self.browser.find_by_css('#site-visit-details ul').text

    def extra_info_content(self):
        return self.browser.find_by_css('#project-details').text

    def project_list_content(self):
        elements = map(lambda element: element.text, self.browser.find_by_css('.project'))
        return "\n".join(elements);

    def site_visit_list_content(self):

        
        elements = map(lambda element: element.text, self.browser.find_by_css('#site-visit-list .site-visit'))

        return "\n".join(elements);

    def select_ureport_question(self, abbreviation):
        toggle_css = str(".ureport-questions .toggle[data-question='%s']" % abbreviation)
        self.wait_for(lambda x: self.browser.find_by_css(toggle_css).visible)
        return self.browser.find_by_css(toggle_css).click();

    def ureport_results(self):
        return self.browser.find_by_css(".ureport-results .legend").text

    def wait_for_element_exists(self, selector):
        self.wait_for(lambda page: len(self.browser.find_by_css(selector)) > 0)
        return self.browser.find_by_css(selector)

    def wait_for_element_visible(self, selector):
        self.wait_for(lambda page: self.browser.find_by_css(selector).visible)
        return self.browser.find_by_css(selector)

    def wait_for(self, function):
        for _ in itertools.repeat(None, 10):
            globals.wait_count += 1
            result = function(self)
            if (result):    
                return
            time.sleep(0.5)
        raise Exception('wait for timed out after 5 seconds')

    def click_marker_at(self, lat, lng):
        marker = self.wait_for_element_exists(str("div[data-lat='%s'][data-lng='%s']" % (lat, lng)))
        marker.click()

    def __filter_chosen__(self, parentId, value):
        container = self.browser.find_by_css("#%s .chosen-container" % parentId)
        container.click()
        text_list = list([elem.text for elem in container.find_by_css(".chosen-results li")])
        index = text_list.index(value)
        container.find_by_css(str(".chosen-results li:nth-child(%s)" % (index +1))).click()

    def filter_by_sector(self, sector): 
        self.browser.find_link_by_text("Projects/Partners").click()
        self.__filter_chosen__('project-sector', sector)
    
    def __chosen_options__(self, parentId):
        container = self.browser.find_by_css("#%s .chosen-container" % parentId)
        container.click()
        options = list([elem.text for elem in container.find_by_css(".chosen-results li")])
        return "\n".join(options)

    def __checkbox_choices__(self, parentId):
        choiceElements = self.browser.find_by_css("#%s .checkbox label" % parentId)
        choices = list([elem.text for elem in choiceElements])
        return "\n".join(choices)
       

    def filter_by_status(self, status): 
        self.browser.find_link_by_text("Projects/Partners").click()
        
        values = self.browser.find_by_value(status).click()
       
    def filter_by_implementing_partner(self, implementing_partner): 
        self.browser.find_link_by_text("Projects/Partners").click()
        self.__filter_chosen__('project-implementing-partner', implementing_partner)
       
    def filter_by_partner(self, partner): 
        self.browser.find_link_by_text("Projects/Partners").click()
        self.browser.choose("organisationsRadio",'FUNDING');
        self.__filter_chosen__("accounting-selector","UNICEF");
       
    def filter_by_year(self, year): 
        self.browser.find_link_by_text("Projects/Partners").click()
        self.__filter_chosen__('project-year', year);

    def status_choices(self):
        return self.__checkbox_choices__("project-status")

    def sector_chosen_options(self):
        return self.__chosen_options__("project-sector")

    def implementing_partners_chosen_options(self):
        return self.__chosen_options__("project-implementing-partner")

    def funding_partners_chosen_options(self):
        return self.__chosen_options__("accounting-selector")

    def accounting_partners_chosen_options(self):
        return self.__chosen_options__("funding-selector")

    def scroll_to_bottom(self): 
        self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    def click_link(self, link_name):
        self.browser.find_link_by_text(str(link_name)).click();

    def click_site_visit_link(self, site_visit_link):
        self.browser.find_link_by_partial_text(str(site_visit_link)).click();

    def click_site_visit_pagination_link(self, count):
        self.browser.find_by_css("#site-visit-list .pagination ul li:nth-child(%s) a" % (int(count) + 1)).click()

    def find_pin_with_color(self, color):
        return self.browser.find_by_css(str("span[data-colorselected='%s'][class='legend-color']" % color));

    def select_project(self, projectName):
        self.browser.find_by_css(str(".icon-inner[data-project-name='%s']" % projectName)).click()

    def get_pins_for_project(self, projectName):
        return self.browser.find_by_css(str(".selected-icon.icon-inner[data-project-name='%s']" % projectName))

    def project_legend_content(self):
        elements = map(lambda element: element.text, self.browser.find_by_css('.partner-legend .legend-label'))
        return "\n".join(elements);

    def has_legend_with(self, color, agency):
        element = self.browser.find_by_css(str("span[data-colorselected='%s'][class='legend-label']" % color));
        return len(element) > 0 and element.text == agency

    def choose_accountable_agency(self):
        self.browser.find_link_by_text("Projects/Partners").click()
        self.browser.choose("organisationsRadio",'FINANCIAL');

    def legend_header_for(self, selector):
        return self.browser.find_by_css("%s .legend-header" % selector).text

    def partner_legend_title(self):
        return self.legend_header_for(".partner-legend")

    def places_legend_title(self):
        return self.legend_header_for(".places-legend")

    def places_legend_content(self):
        elements = map(lambda element: element.text, self.browser.find_by_css('.places-legend li'))
        valid_elements = filter(lambda element: element != '', elements)
        return "\n".join(valid_elements);

    def click_next_link(self):
        next = self.wait_for_element_visible(".right")
        self.browser.find_by_css(".right").click()

    def carousel_image_src(self):
        element = self.browser.find_by_css('.carousel-inner div img');
        return len(element)

    def hover_over_cluster(self, layer, locator):
        self.browser.find_by_css(str( ".%s-cluster-icon[data-locator='%s']" % (layer, locator.lower()))).mouse_over()

    def click_a_cluster(self, layer, locator):
        self.browser.find_by_css(str( ".%s-cluster-icon[data-locator='%s']" % (layer, locator.lower()))).click()

    def project_panel_display(self):
        return self.browser.find_by_css("#project-list").visible

    def site_visit_panel_display(self):
        return self.browser.find_by_css("#site-visit-list").visible

    def click_on_the_about_devtracglobal_link(self):
        self.browser.find_by_css('.footer-container').click()

    def display_about_popup(self):
        return self.browser.find_by_css('#aboutModal')


        


       
        
        
        


        

        
        