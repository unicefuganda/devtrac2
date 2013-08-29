import xlrd
import time
from collections import defaultdict

def welcome_to_excel_reader():
    return 'you just entered excel reader package'


def get_worksheet_names(file):
    workbook = xlrd.open_workbook(file)
    return workbook.sheet_names()


def get_worksheet_data(file):
    workbook = xlrd.open_workbook(file)
    worksheet = workbook.sheet_by_name(workbook.sheet_names()[0])
    row_count = worksheet.nrows-1
    col_count = worksheet.ncols-1
    rows = []
    curr_row = 2
    output = {}    
    while curr_row < row_count:
        curr_row += 1
        curr_col = -1
        row = []
        while curr_col < col_count:
            curr_col +=1
            col_value = worksheet.cell_value(curr_row, curr_col)
            row.append(col_value)
        record = add_record(row)       
        rows.append(record)        
        output['results'] = get_summary(rows)
    return output


def add_record(row):
    record = {'id': row[0],'district': row[1],'subcounty': row[2],'school': row[3],'use_status': row[4]}
    return record

def get_summary(rows):
    districts = defaultdict(list)
    #start = time.time()  
    for row in rows:                
        districts[row['district']].append({'id':row['id'],'subcounty':row['subcounty'],'school':row['school']})

    return  districts

