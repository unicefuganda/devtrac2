git checkout db/projects_activities.csv
cd db/import_data/generate_devtrac_data
ruby remove_duplicate.rb
mv activities_without_duplicated_coordinated_new.csv ../../projects_activities.csv
cd ../../../
python db/import_data/projects.py
