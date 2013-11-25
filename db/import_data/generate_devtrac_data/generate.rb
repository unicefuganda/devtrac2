require 'iconv'
require 'csv'
require 'json'
require 'net/http'
require_relative 'file_accessor'

@test = (ARGV.first == 'test' ? true : false)

@output = (ARGV[1] == 'clean' ? true : false )

@header = ''
@file_name = 'USAID_dataset.csv'
@districts_file_name = 'UNICEF_districts.csv'
@sectors_file_name = 'USAID_sectors.csv'
@status_file_name = 'USAID_statuses.csv'


def replace_districts lines, districts_hash
    temp_lines = []
    old_lines = []

    counter = 0
    lines.each do |original_line|

        if !original_line[8]
            next
        end

        districts = split_districts original_line[8].clone

        temp_districts = lookup_district_names districts, districts_hash

        old_lines << original_line

        temp_districts.each do |t_d|
            unless t_d.nil?
                original_line[8] = t_d
                original_line_clone = original_line.clone
                google_data = get_google_location(t_d.clone)
                puts "..............."
                p google_data
                original_line_clone.push google_data['lat'].to_f.round(4)
                original_line_clone.push google_data['lng'].to_f.round(4)
                temp_lines.push original_line_clone
            end
        end
        counter+=1
        puts "Done with line #{ counter }"
    end

    old_lines.each do |line|
        lines.delete line
    end

    lines.concat temp_lines
end

def replace_sectors lines, sectors_hash
    temp_lines = []
    old_lines = []
    counter = 0
    lines.each do |original_line|

        if !original_line[11]
            next
        end

        sectors = split_sectors original_line[11].clone

        temp_sectors = lookup_sector_names sectors, sectors_hash

        old_lines << original_line

        temp_sectors.each do |t_s|
            unless t_s.nil?
                original_line[11] = t_s
                original_line_clone = original_line.clone
                temp_lines.push original_line_clone
            end
        end
        counter+=1
        puts "Done with line #{ counter }"
    end

    old_lines.each do |line|
        lines.delete line
    end

    lines.concat temp_lines
end

def replace_statuses lines, status_hash
    temp_lines = []
    old_lines = []
    counter = 0
    lines.each do |original_line|

        if !original_line[10]
            next
        end

        statuses = split_status original_line[10].clone

        temp_statuses = lookup_status_names statuses, status_hash

        old_lines << original_line

        temp_statuses.each do |t_s|
            unless t_s.nil?
                original_line[10] = t_s
                original_line_clone = original_line.clone
                temp_lines.push original_line_clone
            end
        end
        counter+=1
        puts "Done with line #{ counter }"
    end

    old_lines.each do |line|
        lines.delete line
    end

    lines.concat temp_lines
end

def lookup_district_names districts, districts_hash
    temp_districts = []

    districts.each do |dist|
        temp_districts << districts_hash[dist]
    end

    temp_districts
end

def split_districts districts
    split_data districts
end

def split_data piped_data
    if piped_data.include?("|")
        new_data = piped_data.split("|")
    else
        new_data = [piped_data]
    end

    new_data
end

def split_sectors sector
    split_data sector
end

def split_status status
    split_data status
end

def lookup_sector_names sectors, sectors_hash
    temp_sectors = []

    sectors.each do |sect|
        temp_sectors << sectors_hash[sect]
    end
    temp_sectors
end

def lookup_status_names status, status_hash
    temp_statuses = []

    status.each do |st|
        temp_statuses << status_hash[st]
    end
    temp_statuses
end

def array_to_hash array
    hash = {}

    array.each do |line|
        hash[line[0]] = line[1]
    end

    hash
end

def round_digits(float)
  float.round(4)
end

def random_change_number
  [*-100..100].map { |e| e.to_f / 1001 }.sample
end

def offset_lat_long lat_long
    new_lat = round_digits(lat_long['lat'].to_f + random_change_number)
    new_lng = round_digits(lat_long['lng'].to_f + random_change_number)

    lat_long['lat'] = new_lat.to_s
    lat_long['lng'] = new_lng.to_s

    10.times {
        if new_lat < -1.2
          lat_long['lat'] = (new_lat.to_f + random_change_number).to_s
        end

        if new_lng > 34
          lat_long['lng'] = (new_lng.to_f + random_change_number).to_s
        end
    }

    lat_long
end

def get_google_location place
    results = {}

    if @test == true
        results['lat'] = '1.00'
        results['lng'] = '1.00'
        offset_lat_long results
    else
        url = "http://maps.googleapis.com/maps/api/geocode/json?address=#{format_address place}&sensor=true"
        resp = Net::HTTP.get_response(URI.parse(url))
        data = resp.body

        data = JSON.parse data

        results['lat'] = data['results'][0]['geometry']['location']['lat'].to_s
        results['lng'] = data['results'][0]['geometry']['location']['lng'].to_s
        p results
        offset_lat_long results
    end
end

def format_address address
    address.concat("%2C%20Uganda")
end

file_accessor = FileAccessor.new

if @output 
    # # clean project files bad bytes
    # clean_lines = file_accessor.clean_bad_bytes @file_name
    # file_accessor.write_new_file @file_name, clean_lines, true

    # #clean district file bad bytes
    # clean_district_lines = file_accessor.clean_bad_bytes @districts_file_name
    # file_accessor.write_new_file @districts_file_name, clean_district_lines, true

    # #clean sector file bad bytes
    # clean_sector_lines = file_accessor.clean_bad_bytes @sectors_file_name
    # file_accessor.write_new_file @sectors_file_name, clean_sector_lines, true

    #clean status file bad bytes
    clean_status_lines = file_accessor.clean_bad_bytes @status_file_name
    file_accessor.write_new_file @status_file_name, clean_status_lines, true

else
    # replace sectors
    temp_file = file_accessor.add_temp_to_file_name @file_name
    sectors_temp_file = file_accessor.add_temp_to_file_name @sectors_file_name

    lines = file_accessor.read_file temp_file
    sectors = file_accessor.read_file sectors_temp_file

    new_lines = replace_sectors(lines, array_to_hash(sectors))
    file_accessor.write_new_file @file_name, new_lines, false

    # replace statuses
    new_file = file_accessor.add_new_to_file_name @file_name
    status_temp_file = file_accessor.add_temp_to_file_name @status_file_name

    lines = file_accessor.read_file new_file
    statuses = file_accessor.read_file status_temp_file

    new_lines = replace_statuses(lines, array_to_hash(statuses))
    file_accessor.write_new_file @file_name, new_lines, false  

    # replace districts and create latitudes and longitudes
    temp_file = file_accessor.add_new_to_file_name @file_name
    districts_temp_file = file_accessor.add_temp_to_file_name @districts_file_name

    lines = file_accessor.read_file temp_file
    districts = file_accessor.read_file districts_temp_file

    puts "File read, now adding data"
    new_lines = replace_districts(lines, array_to_hash(districts))
    file_accessor.write_new_file @file_name, new_lines, false

end



