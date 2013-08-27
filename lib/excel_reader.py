import xlrd

def welcome_to_excel_reader():
	return 'you just entered excel reader package'

def get_worksheet_names(file):
	workbook = xlrd.open_workbook(file)
	return workbook.sheet_names()
	

def get_worksheet_data(file):
	workbook = xlrd.open_workbook(file)
	worksheets = workbook.sheet_names()
	worksheet_list = []
	for worksheet_name in worksheets:
		worksheet = workbook.sheet_by_name(worksheet_name)
		worksheet_list.append(worksheet)
	return worksheet_list


