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
