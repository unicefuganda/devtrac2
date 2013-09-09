class Page:
    base_url = "http://localhost:5000/#"
    
    def __init__(self, browser):
        self.browser = browser

    def visit_district(self, district_name):
        self.browser.visit("%s/district/%s" % (self.base_url, district_name))

    def title(self):
        return self.browser.find_by_css("#location .district_name").first.value

    def quit(self):
        self.browser.quit()