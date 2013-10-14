Copy (
 SELECT rhm.id, rhm.text, ll.type_id, ll.name AS district, pp.question, pr.poll_id, pp.response_type, pp.type
 FROM poll_poll pp
 INNER JOIN poll_response pr ON pp.ID = pr.poll_id
 INNER JOIN rapidsms_httprouter_message rhm ON rhm.ID = pr.message_id
 INNER JOIN rapidsms_connection rcon ON rhm.connection_id = rcon.id 
 INNER JOIN rapidsms_contact rc ON rcon.contact_id = rc.id 
 INNER JOIN locations_location ll ON ll.id = rc.reporting_location_id 
 WHERE pr.poll_id IN (165, 180, 200, 551) AND ll.name = 'Gulu')
 To '/Users/Thoughtworker/work/devtrac2/db/ureport_messages_test.csv' WITH CSV HEADER;
