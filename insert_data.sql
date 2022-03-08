INSERT INTO users ( name, email, hashed_password ) VALUES 
('Lewis Hamilton', 'Lewis@SilverArrows.com', '5af0c6c085fcd91b5cc2ceea2e566220a0c2f64bc0ee059632136bcf92d2a015f54ebd6f6bf7478062ded1f7f3a4b07101ccf7c081abdfd2d00a9b5d6119e826' ),
('Valerie Bottas', 'Valerie@SilverArrows.com', 'ecb0cf4985d998b2b66cabc99c1ea29ba854fbbccc73b95c0c733f6b11bdad836bf946a84f4154748545c540184d253bf6d8e2b7c4dfd4f02241fd9084f78a40'),
('Fernando Alonso', 'Fernando@McLaren.com', 'ecb0cf4985d998b2b66cabc99c1ea29ba854fbbccc73b95c0c733f6b11bdad836bf946a84f4154748545c540184d253bf6d8e2b7c4dfd4f02241fd9084f78a40');

INSERT INTO types (name) VALUES
('1/10 ELECTRIC TC'),
('1/12 PAN');

INSERT INTO bodyshells (bodyshell_type_id, brand, name, bs_model, variant) VALUES 
(1, 'ZOORACING', 'ZOODIAC', 'ZR-0007-07', 'STANDARD'),
(1, 'ZOORACING', 'DOGSBOLLOX', 'ZR-0005-07', 'STANDARD'),
(1, 'ZOORACING', 'DOGSBOLLOX', 'ZR-0005-05', 'ULTRALIGHT');


INSERT INTO platforms (platform_type_id, brand, name, model ) VALUES 
(1, '3Racing', 'ADVANCE 21M', 'KIT-ADVANCE 21M' ),
(1, 'Mugen Seki', 'MTC2', 'A2003-A'),
(1, 'Mugen Seki', 'MTC2', 'A2003-C'),
(1, 'XRAY', 'T4(2020)', '300026');


INSERT INTO tracks (name, climate, surface, layout, location) VALUES 
('Tsukuba RC Park', 'INDOOR', 'CARPET', 'TECHNICAL', 'Ibaraki, JAPAN'),
('Shirakaba 2in1 Circuit', 'OUTDOOR', 'ASPHALT', 'MIXED', 'NAGANO, JAPAN');

INSERT INTO setups 
(
name,  
userid, 
platform_id, 
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
'Technical Monster',  
1,  
1,
540,
'17.5T',
'120A',
'BLINKY',
4.27, 
'SHIMIZU',
'36S',
'36S',
'SPOOL',
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
'middle',
'outer',
'middle',
'outer',
3,
4,
'medium',
'medium',
450,
550,
'zero',
'zero',
2.0,
1.5,
-0.5, 
2.0,
2.5,
1.3,
1.5
);


INSERT INTO tracktimes ( date, event_name, track_id, direction, tracktime_user_id, lapcount, total_time, tracktime_type_id, tracktime_platform_id, tracktime_setup_id, tracktime_bodyshell_id ) VALUES
('2017-07-22', '2018 JMRCA Japanese National Championship Day 3/3', 2, 'CW', 1, 41, 505495, 1, 1, 1, 1);

