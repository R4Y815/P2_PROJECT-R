INSERT INTO users ( name ) VALUES 
('Lewis Hamilton');


INSERT INTO categories ( name ) VALUES 
('OFFROAD'),
('ONROAD');

INSERT INTO types (name) VALUES
('1/10 ELECTRIC TC'),
('1/12 PAN');

INSERT INTO bodyshells (bodyshell_type_id, brand, name, bs_model, variant) VALUES 
(1, 'ZOORACING', 'ZOODIAC', 'ZR-0007-07', 'STANDARD'),
(1, 'ZOORACING', 'DOGSBOLLOX', 'ZR-0005-07', 'STANDARD'),
(1, 'ZOORACING', 'DOGSBOLLOX', 'ZR-0005-05', 'ULTRALIGHT');


INSERT INTO platforms (category_id, platform_type_id, brand, name, model ) VALUES 
(2, 1, '3Racing', 'ADVANCE 21M', 'KIT-ADVANCE 21M' );


INSERT INTO tracks (name, climate, surface, layout, location) VALUES 
('Tsukuba RC Park', 'INDOOR', 'CARPET', 'TECHNICAL', 'Ibaraki, JAPAN'),
('Shirakaba 2in1 Circuit', 'OUTDOOR', 'ASPHALT', 'MIXED', 'NAGANO, JAPAN');


INSERT INTO events (name, date, event_type_id, event_user_id, event_track_id) VALUES 
('2018 JMRRCA Japanese National Championship Day 3/3', '2022-07-22', 1, 1, 2 );


INSERT INTO tracktimes (event_id, track_id, tracktime_user_id, direction, lapcount, total_time, tracktime_type_id, tracktime_platform_id) VALUES 
(1, 2, 1, 'CW', 41, '8:10.492', 1, 1);


INSERT INTO setups 
(
userid, 
platform_id, 
setup_tracktimes_id,
setup_event_id,
bodyshell_id,
motor_size,
motor_turn, 
esc_size,
esc_setting,
fdr,
tires_brand,
tires_frnt_shore,
tires_rear_shore,
diff_frnt_type, 
diff_frnt_oil_wght, 
diff_rear_type, 
diff_rear_oil_wght,
wt_distro_front,
wt_distro_rear,
wt_distro_lft, 
wt_distro_rht,
wt_distro_fr_rl,
wt_distro_fl_rr,
ride_ht_front,
ride_ht_rear,
susp_frnt_top_pos,
susp_frnt_btn_pos,
susp_rear_top_pos,
susp_rear_btn_pos, 
susp_frnt_pist_holes,
susp_rear_pist_holes,
susp_frnt_spring_hardness,
susp_rear_spring_hardness,
susp_frnt_oil_wt,
susp_rear_oil_wt,
susp_frnt_rebound,
susp_rear_rebound,
camber_frnt,
camber_rear,
caster_frnt,
toe_out_frnt,
toe_in_rear,
anti_roll_frnt_wire_thickness,
anti_roll_rear_wire_thickness) 
VALUES (
1, 
1,
1,
1,
2,
540,
17.5,
'120A',
'BLINKY',
4.27, 
'SHIMIZU',
'36S',
'36S',
'spool',
0,
'GEAR DIFF',
5000, 
40,
60, 
47,
53,
52,
49,
5.3,
5.5,
'center',
'outer',
'center',
'outer',
3,
4,
'medium',
'medium',
450,
550,
'zero rebound',
'zero rebound',
2.0,
1.5,
-0.5, 
2.0,
2.5,
1.3,
1.5
);

INSERT INTO setups_tracktimes (setup_id, tracktime_id) VALUES 
(1, 1);