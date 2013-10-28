require 'iconv'
require 'csv'
require 'json'
require 'net/http'

@header = ''
@file_name = 'UNICEF_activities_formatted.csv'
@districts_file_name = 'UNICEF_districts.csv'

def read_file file_name
    lines = CSV.read(file_name)

    puts "Read main file #{file_name} (#{lines.size} lines)"

    lines
end

def clean_bad_bytes file_name
    clean_lines = []

    File.open(file_name, 'r') do |infile|
        while (line = infile.gets)
            clean_lines << clean_line(line)
        end
    end

    clean_lines
end

def clean_line line
    ic = Iconv.new('UTF-8//IGNORE', 'UTF-8')

    ic.iconv(line + ' ')[0..-2]
end

def write_new_file file_name, lines
    counter = 0
    File.open(file_name, "w") do |file|
        file.puts @header.join(',')
        counter += 1
        lines.each do |line|
            if line.size > 1
                counter += 1
                file.puts line.join(',')
            end
        end
    end

    puts "Wrote main file as #{file_name} (#{counter} lines)"
end

def remove_header lines
    lines.shift
end

def manipulate_data lines, districts_hash
    temp_lines = []
    old_lines = []

    lines.each do |line|
        districts = line[8]

        if districts.include?("|")
            districts = districts.split("|")
        else
            districts.to_a!
        end

        temp_districts = []
        districts.each do |dist|
            temp_districts << districts_hash[dist]
        end

        original_line = line
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

        puts "Done with line " + line[0]
    end

    old_lines.each do |line|
        lines.delete line
    end

    lines.concat temp_lines
end


def add_new_to_file_name file_name
    file_pieces = file_name.split('.')
    if file_pieces.size !=2
        raise 'File name should have only single extension'
    else
        file_pieces[0] + "_new." + file_pieces[1]
    end
end

def read_districts file_name
    File.open(file_name, "r") do |infile|
        while (line = infile.gets)
            @lines << line.split(',')
            @counter += 1
        end

        puts "Read districts file #{file_name} (#{@counter} lines)"
    end
end

def array_to_hash array
    hash = {}

    array.each do |line|
        hash[line[0]] = line[1]
    end

    hash
end

def get_google_location place
    url = "http://maps.googleapis.com/maps/api/geocode/json?address=#{format_address place}&sensor=true"
    resp = Net::HTTP.get_response(URI.parse(url))
    data = resp.body

    data = JSON.parse data

    results = {}
    results['lat'] = data['results'][0]['geometry']['location']['lat'].to_s
    results['lng'] = data['results'][0]['geometry']['location']['lng'].to_s

    results
end

def format_address address
    address.concat("%2C%20Uganda")
end

lines = read_file @file_name

@header = remove_header lines
@header[@header.size - 2] = 'DISTRICT'
@header.concat ['LAT', 'LONG']

districts = read_file @districts_file_name

puts "File read, now adding data"
new_lines = manipulate_data(lines, array_to_hash(districts))

counter = 1
lines.each do |line|
    line[0] = counter
    counter += 1
end

write_new_file add_new_to_file_name(@file_name), new_lines

