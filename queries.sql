-- USER not logged in, display setup sheet

-- FULL QUERY JOINING ALL TABLES
SELECT setups.id, users.name AS user_name, platforms.brand AS platform_brand, platforms.name AS platform_name, platforms.model, bodyshells.brand AS bs_brand, bodyshells.name AS bs_name, bodyshells.variant AS bs_variant, events.name AS event_name, tracks.name AS track_name, tracks.surface, tracks.layout, tracktimes.direction, tracktimes.lapcount, tracktimes.total_time, motor_size, motor_turn, esc_size, esc_setting, fdr, tires_brand, tires_frnt_shore,tires_rear_shore, diff_frnt_type, diff_frnt_oil_wght, diff_rear_type, diff_rear_oil_wght, wt_distro_front, wt_distro_rear, wt_distro_lft, wt_distro_rht, wt_distro_fr_rl, wt_distro_fl_rr, ride_ht_front, ride_ht_rear, susp_frnt_top_pos, susp_frnt_btn_pos, susp_rear_top_pos, susp_rear_btn_pos,susp_frnt_pist_holes, susp_rear_pist_holes, susp_frnt_spring_hardness, susp_rear_spring_hardness, susp_frnt_oil_wt, susp_rear_oil_wt, susp_frnt_rebound, susp_rear_rebound, camber_frnt, camber_rear, caster_frnt, toe_out_frnt, toe_in_rear, anti_roll_frnt_wire_thickness, anti_roll_rear_wire_thickness FROM setups 
INNER JOIN users ON setups.userid = users.id 
INNER JOIN platforms ON platform_id = platforms.id 
INNER JOIN bodyshells ON bodyshell_id = bodyshells.id 
INNER JOIN events ON setup_event_id = events.id 
INNER JOIN setups_tracktimes ON setups_tracktimes.setup_id = setups.id
INNER JOIN tracktimes ON setups_tracktimes.tracktime_id = tracktimes.id
INNER JOIN tracks ON tracks.id = tracktimes.track_id;


--- QUERY using tracktimes as main display
SELECT tracktimes.id AS track_id, date, event_name, tracks.name AS track_name, users.name AS user_name, tracktimes.direction, tracktimes.lapcount, tracktimes.total_time, types.name AS type_name, platforms.brand AS platform_brand, platforms.model AS platform_model, platforms.name AS platform_name, setups.id AS setup_id, setups.name AS setup_name, bodyshells.brand AS bodyshell_brand, bodyshells.name AS bodyshell_name, bodyshells.variant AS bodyshell_variant 
FROM tracktimes 
INNER JOIN tracks ON tracktimes.track_id = tracks.id
INNER JOIN users ON tracktime_user_id = users.id
INNER JOIN types ON tracktime_type_id = types.id
INNER JOIN platforms ON tracktime_platform_id = platforms.id
INNER JOIN setups ON tracktime_setup_id = setups.id
INNER JOIN bodyshells ON tracktime_bodyshell_id = bodyshells.id;


-- updating/edit Setups list
UPDATE setups SET 
name = $1,
userid = $2,
platform_id = $3,
motor_size = $4,
motor_turn = $5,
esc_size = $6,
esc_setting = $7,   
fdr = $8,
tires_brand = $9,
tires_frnt_shore = $10,
tires_rear_shore = $11,
diff_frnt_type = $12, 
diff_frnt_oil_wght = $13, 
diff_rear_type = $14, 
diff_rear_oil_wght = $15,
wt_distro_front = $16,
wt_distro_rear = $17,
wt_distro_lft = $18, 
wt_distro_rht = $19,
wt_distro_fr_rl = $20,
wt_distro_fl_rr = $21,
ride_ht_front = $22,
ride_ht_rear = $23,
susp_frnt_top_pos = $24,
susp_frnt_btn_pos = $25,
susp_frnt_pist_holes = $26,
susp_frnt_spring_hardness = $27,
susp_frnt_oil_wt = $28,
susp_frnt_rebound = $29,
susp_rear_top_pos = $30,
susp_rear_btn_pos = $31, 
susp_rear_pist_holes = $32,
susp_rear_spring_hardness = $33,
susp_rear_oil_wt = $34,
susp_rear_rebound = $35,
caster_frnt = $36,
camber_frnt = $37,
camber_rear = $38,
toe_out_frnt = $39,
toe_in_rear = $40,
anti_roll_frnt_wire_thickness = $41,
anti_roll_rear_wire_thickness = $42 
WHERE id = $43;

----tracktimes column header row names:
tracktimes.id AS track_id, 
date, 
event_name, 
tracks.name AS track_name, 
users.name AS user_name, 
tracktimes.direction, 
tracktimes.lapcount, 
tracktimes.total_time, 
types.name AS type_name, 
platforms.brand AS platform_brand, 
platforms.model AS platform_model, 
platforms.name AS platform_name, 
setups.id AS setup_id, 
setups.name AS setup_name, 
bodyshells.brand AS bodyshell_brand, 
bodyshells.name AS bodyshell_name, 
bodyshells.variant AS bodyshell_variant 

--UPDATE tracktimes
UPDATE tracktimes SET 
date = $1, 
event_name = $2, 
track_id = $3, 
tracktime_user_id = $4, 
direction = $5, 
lapcount = $6, 
total_time = $7, 
tracktime_type_id = $8, 
tracktime_platform_id = $9, 
tracktime_setup_id = $10, 
tracktime_bodyshell_id = $11 
WHERE id = $12;

--show all setups 
SELECT setups.id, platforms.brand, platforms.name AS platform_name, setups.motor_turn, setups.fdr, setups.name AS setup_name, users.name AS user_name
FROM setups
INNER JOIN platforms  ON setups.platform_id = platforms.id
INNER JOIN users ON setups.userid = users.id 
ORDER BY setups.id ASC;   


--SETUP DROPDOWN for NEW TRACKTIMES: 
SELECT  platforms.model, setups.id, setups.name
FROM setups
INNER JOIN platforms ON setups.platform_id = platforms.id;

