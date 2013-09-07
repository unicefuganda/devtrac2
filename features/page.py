class Page(object):

	def __init__(self, browser):
		self.browser = browser

	def visit(self, url):
		self.browser.visit(url)

	def title(self):
		return self.browser.find_by_css("h1").first.value

	def quit(self):
		self.browser.quit()