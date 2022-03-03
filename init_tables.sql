CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE types (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE bodyshells (
  id SERIAL PRIMARY KEY,
  bodyshell_type_id INTEGER, 
  CONSTRAINT fk_type
      FOREIGN KEY (bodyshell_type_id)
      REFERENCES types(id),
  brand TEXT,
  name TEXT,
  bs_model TEXT,
  variant TEXT
);

CREATE TABLE platforms (
  id SERIAL PRIMARY KEY,
  category_id INTEGER,
  CONSTRAINT fk_category
      FOREIGN KEY(category_id)
      REFERENCES categories(id),
  platform_type_id INTEGER, 
  CONSTRAINT fk_type
      FOREIGN KEY (platform_type_id)
      REFERENCES types(id),
  brand TEXT,
  name TEXT,
  model TEXT
);

CREATE TABLE tracks (
  id SERIAL PRIMARY KEY,
  name TEXT,
  climate TEXT,
  surface TEXT,
  layout TEXT,
  location TEXT
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY, 
  name TEXT,
  date DATE,
  event_type_id INTEGER,
  CONSTRAINT fk_type
      FOREIGN KEY(event_type_id)
      REFERENCES types(id),
  event_user_id INTEGER,
  CONSTRAINT fk_user
      FOREIGN KEY(event_user_id)
      REFERENCES users(id),
  event_track_id INTEGER, 
  CONSTRAINT fk_track
      FOREIGN KEY(event_track_id)
      REFERENCES tracks(id)
);

CREATE TABLE tracktimes (
  id SERIAL PRIMARY KEY,
  event_id INTEGER, 
  CONSTRAINT fk_event
      FOREIGN KEY(event_id)
      REFERENCES events(id),
  track_id INTEGER, 
  CONSTRAINT fk_track 
      FOREIGN KEY(track_id)
      REFERENCES tracks(id),
  tracktime_user_id INTEGER,
  CONSTRAINT fk_user 
      FOREIGN KEY(tracktime_user_id)
      REFERENCES users(id),
  direction TEXT, 
  lapcount INTEGER,
  total_time TEXT,
tracktime_type_id INTEGER, 
  CONSTRAINT fk_type    
      FOREIGN KEY(tracktime_type_id)
      REFERENCES types(id),
tracktime_platform_id INTEGER, 
  CONSTRAINT fk_platform
      FOREIGN KEY(tracktime_platform_id)
      REFERENCES platforms(id)
);

CREATE TABLE setups (
id SERIAL PRIMARY KEY, 
userid INTEGER,
CONSTRAINT fk_user
    FOREIGN KEY(userid)
    REFERENCES users(id),
platform_id INTEGER,
CONSTRAINT fk_platform
    FOREIGN KEY(platform_id)
    REFERENCES platforms(id),
setup_tracktimes_id INTEGER,
CONSTRAINT fk_track 
    FOREIGN KEY(setup_tracktimes_id)
    REFERENCES tracks(id),
setup_event_id INTEGER,
    FOREIGN KEY(setup_event_id)
    REFERENCES events(id),
bodyshell_id INTEGER,
  CONSTRAINT fk_bodyshell
    FOREIGN KEY(bodyshell_id)
    REFERENCES bodyshells(id), 
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


--JOIN TABLE TRACK and SETUP
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



