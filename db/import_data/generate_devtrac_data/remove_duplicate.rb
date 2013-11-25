require 'iconv'
require 'csv'
require 'json'
require 'net/http'
require_relative 'file_accessor'

def print_list list
  list.each do |line|
    p line
    puts
    puts
  end

  puts list.size
end

fa = FileAccessor.new

list_of_activities = fa.read_file("../../project_activities_latest.csv", false)

unique_activities = list_of_activities.uniq { |e| e[12] && e[13] }

duplicated_activities = list_of_activities - unique_activities


duplicated_activities.map! do |activity|
  activity[0..11] + [[activity[12], activity[13]]]
end

duplicated_activities_grouped = duplicated_activities.group_by do |activity|
  activity[12]
end

def round_digits(float)
  float.round(4)
end

def random_change_number
  [*-100..100].map { |e| e.to_f / 1001 }.sample
end

#print_list duplicated_activities_grouped
def generate_random_lat_long lat_long
  new_lat = round_digits(lat_long[0].to_f + random_change_number)
    new_lng = round_digits(lat_long[1].to_f + random_change_number)


    if new_lat < -1.2
      lat_long = generate_random_lat_long lat_long
    else
      lat_long[0] = new_lat.to_s
    end


    if new_lng > 34
      lat_long = generate_random_lat_long lat_long
    else
      lat_long[1] = new_lng.to_s
    end

    lat_long
end



edited_activities = duplicated_activities_grouped.each do |group|

  group[1].each do |duplicated_activity|
    lat_long = duplicated_activity[12]

    randomized_lat_long = generate_random_lat_long(lat_long)

    duplicated_activity[12] = randomized_lat_long[0]
    duplicated_activity[13] = randomized_lat_long[1]

    puts duplicated_activity[12] + ' : ' + duplicated_activity[13]
  end
end


edited_activities = edited_activities.map { |activity| activity[1] }
list = []

edited_activities.each do |activity|
  activity.each do |act|
    list << act
  end
end

new_list = list + unique_activities

def sort_list_by_first_number(new_list)
  sorter = ->(a, b) { a[0].to_i <=> b[0].to_i }

  new_list.sort(& sorter)
end

new_list = sort_list_by_first_number(new_list)

#print_list new_list

fa.write_new_file 'activities_without_duplicated_coordinated.csv', new_list

#puts non_duplicated_activities.uniq { |e| e[12] && e[13] }.size == non_duplicated_activities.size
