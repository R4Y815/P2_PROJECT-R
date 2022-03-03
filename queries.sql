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


