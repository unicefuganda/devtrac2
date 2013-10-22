Copy (
 SELECT rhm.id AS ID, rhm.text, ll.type_id, ll.name,  ll.name AS district, pp.question, pr.poll_id, pp.response_type, pp.type, rc.village_name AS nonstandard_village, uc.village AS standard_village, uc.facility, vl.type_id AS village_type_id, vlp.name AS parish
 FROM poll_poll pp
 INNER JOIN poll_response pr ON pp.ID = pr.poll_id
 INNER JOIN ureport_contact uc ON uc.id = pr.contact_id
 INNER JOIN rapidsms_httprouter_message rhm ON rhm.ID = pr.message_id
 INNER JOIN rapidsms_connection rcon ON rhm.connection_id = rcon.id 
 INNER JOIN rapidsms_contact rc ON rcon.contact_id = rc.id 
 INNER JOIN locations_location ll ON ll.id = uc.reporting_location_id 
 LEFT OUTER JOIN locations_location vl ON vl.name = uc.village
 LEFT OUTER JOIN locations_location vlp ON vl.type_id = 'village' AND vl.parent_id = vlp.id OR vl.type_id = 'parish' AND vl.id = vlp.id

 
 WHERE pr.poll_id IN (165, 180, 200, 551) --AND ll.name = 'Gulu' 
 ) 
 To '/Users/Thoughtworker/work/devtrac2/db/ureport_messages_test.csv' WITH CSV HEADER;


Copy (
SELECT ll.name as district, pp.id AS poll_id, pcat.name AS category, COUNT(1) AS count, pcat.id AS category_id
FROM poll_poll pp
INNER JOIN poll_response pr ON pp.ID = pr.poll_id
INNER JOIN poll_responsecategory prc ON prc.response_id = pr.id
INNER JOIN poll_category pcat ON prc.category_id = pcat.id
INNER JOIN ureport_contact uc ON uc.id = pr.contact_id
INNER JOIN rapidsms_httprouter_message rhm ON rhm.ID = pr.message_id
INNER JOIN rapidsms_connection rcon ON rhm.connection_id = rcon.id 
INNER JOIN rapidsms_contact rc ON rcon.contact_id = rc.id 
INNER JOIN locations_location ll ON ll.id = rc.reporting_location_id 

WHERE pr.poll_id IN (165) AND district = 'Gulu'
GROUP BY ll.name, ll.type_id, pp.id, pcat.id
) 
To '/Users/Thoughtworker/work/devtrac2/db/ureport_poll_categories.csv' WITH CSV HEADER;

Copy(
SELECT pp.id AS ID, pp.name AS abbreviation, pp.question, array_to_string(ARRAY(SELECT name FROM poll_category WHERE poll_id = pp.id ), ',') AS categories
FROM poll_poll pp
 WHERE pp.id IN (165, 180, 200, 551) --AND ll.name = 'Gulu' 
)
To '/Users/Thoughtworker/work/devtrac2/db/poll_questions.csv' WITH CSV HEADER;
