--JOIN SETUPS and TRACKTIMES
CREATE TABLE setups_tracktimes (
  id SERIAL PRIMARY KEY,
  setup_id INTEGER,
  CONSTRAINT fk_setup
      FOREIGN KEY(setup_id)
      REFERENCES setups(id),
  tracktime_id INTEGER,
  CONSTRAINT fk_tracktime
      FOREIGN KEY(tracktime_id)
      REFERENCES tracktimes(id)
);

INSERT INTO setups_tracktimes (setup_id, tracktime_id) VALUES 
(1, 1);



--JOIN BODYSHELL and TRACKTIMES
CREATE TABLE bodyshells_tracktimes (
  id SERIAL PRIMARY KEY,
  bodyshell_id INTEGER,
  CONSTRAINT fk_bodyshell
      FOREIGN KEY(bodyshell_id)
      REFERENCES bodyshells(id),
  tracktime_id INTEGER,
  CONSTRAINT fk_tracktime
      FOREIGN KEY(tracktime_id)
      REFERENCES tracktimes(id)
);

INSERT INTO bodyshells_tracktimes (bodyshell_id, tracktime_id) VALUES 
(2, 1);


-- JOIN TABLE for USERS  and TRACKS
CREATE TABLE activityTracker (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  CONSTRAINT fk_user
      FOREIGN KEY(user_id)
      REFERENCES users(id),
  tracks_id INTEGER,
  CONSTRAINT fk_tracks
      FOREIGN KEY(tracks_id)
      REFERENCES trackss(id)
);

--SETUPS spare 2313hrs
CREATE TABLE setups (
id SERIAL PRIMARY KEY, 
name TEXT,
userid INTEGER,
CONSTRAINT fk_user
    FOREIGN KEY(userid)
    REFERENCES users(id),
platform_id INTEGER,
CONSTRAINT fk_platform
    FOREIGN KEY(platform_id)
    REFERENCES platforms(id),
motor_size TEXT,
motor_turn TEXT,
esc_size TEXT,
esc_setting TEXT,   
fdr NUMERIC,
tires_brand TEXT,
tires_frnt_shore TEXT,
tires_rear_shore TEXT,
diff_frnt_type TEXT, 
diff_frnt_oil_wght INTEGER, 
diff_rear_type TEXT, 
diff_rear_oil_wght INTEGER,
wt_distro_front NUMERIC,
wt_distro_rear NUMERIC,
wt_distro_lft NUMERIC, 
wt_distro_rht NUMERIC,
wt_distro_fr_rl NUMERIC,
wt_distro_fl_rr NUMERIC,
ride_ht_front NUMERIC,
ride_ht_rear NUMERIC,
susp_frnt_top_pos TEXT,
susp_frnt_btn_pos TEXT,
susp_rear_top_pos TEXT,
susp_rear_btn_pos TEXT, 
susp_frnt_pist_holes INTEGER,
susp_rear_pist_holes INTEGER,
susp_frnt_spring_hardness TEXT,
susp_rear_spring_hardness TEXT,
susp_frnt_oil_wt INTEGER,
susp_rear_oil_wt INTEGER,
susp_frnt_rebound TEXT,
susp_rear_rebound TEXT,
camber_frnt NUMERIC,
camber_rear NUMERIC,
caster_frnt NUMERIC,
toe_out_frnt NUMERIC,
toe_in_rear NUMERIC,
anti_roll_frnt_wire_thickness NUMERIC,
anti_roll_rear_wire_thickness NUMERIC
);