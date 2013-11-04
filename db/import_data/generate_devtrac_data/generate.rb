require 'iconv'
require 'csv'
require 'json'
require 'net/http'
require_relative 'file_accessor'

@test = (ARGV.first == 'test' ? true : false)

@header = ''
@file_name = 'USAID_activities_formatted.csv'
@districts_file_name = 'UNICEF_districts.csv'


def manipulate_data lines, districts_hash
    temp_lines = []
    old_lines = []

    lines.each do |original_line|
        districts = split_districts line[8].clone

        temp_districts = lookup_district_names districts, districts_hash

        old_lines << line

        temp_districts.each do |t_d|
            unless t_d.nil?
                original_line[8] = t_d
                original_line_clone = original_line.clone
                google_data = get_google_location(t_d.clone)
                original_line_clone.push google_data['lat'].to_f.round(4)
                original_line_clone.push google_data['lng'].to_f.round(4)
                temp_lines.push original_line_clone
            end
        end

        puts "Done with line " + original_line[0]
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
    if districts.include?("|")
        split_districts = districts.split("|")
    else
        split_districts = [districts]
    end

    split_districts
end

def array_to_hash array
    hash = {}

    array.each do |line|
        hash[line[0]] = line[1]
    end

    hash
end

def get_google_location place
    results = {}

    if @test == true
        results['lat'] = '1.00'
        results['lng'] = '1.00'
        results
    else
        url = "http://maps.googleapis.com/maps/api/geocode/json?address=#{format_address place}&sensor=true"
        resp = Net::HTTP.get_response(URI.parse(url))
        data = resp.body

        data = JSON.parse data

        results['lat'] = data['results'][0]['geometry']['location']['lat'].to_s
        results['lng'] = data['results'][0]['geometry']['location']['lng'].to_s

        results
    end
end

def format_address address
    address.concat("%2C%20Uganda")
end

file_accessor = FileAccessor.new
districts = file_accessor.read_file @districts_file_name, false

lines = file_accessor.read_file @file_name, true

puts "File read, now adding data"
new_lines = manipulate_data(lines, array_to_hash(districts))

file_accessor.write_new_file @file_name, new_lines

