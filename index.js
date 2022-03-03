/* eslint-disable max-len */
import pg from 'pg';
import express, { request } from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import axios from 'axios';

/* POSTGRESQL STACK BELOW */
/* Connecting database to server */
const { Pool } = pg;
const pgConnectionConfigs = {
  user: 'raytor27',
  host: 'localhost',
  database: 'project_2_db',
  port: 5432, // Postgres server always runs on this port
};

const pool = new Pool (pgConnectionConfigs);

const app = express();
const port = 3020;

/* cookie functinality within js */
app.use(cookieParser());

/* Override POST requests with query param ?_method=PUT to be PUT requests */
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: false }));

/* tells express how to serve static files and from 'public folder' */
app.use(express.static('public'));
// Set view engine
app.set('view engine', 'ejs');

/* query done callback */
const whenQueryDone = (error, result) => {
  /* this error is anything that goes wrong with the query */
  if (error) {
    console.log('error', error);
  } else {
    /* rows key has the data */
    console.log(result.rows);
  }
};

/* FN for Routes */
/* FN: get Setup Sheet*/
const showSetupSheet = (req, res) =>{
  const { setupId } = req.params;
  const setupIndex = [setupId];
  console.log(setupIndex);
  const setupSheetQuery = 'SELECT setups.id, users.name AS user_name, platforms.brand AS platform_brand, platforms.name AS platform_name, platforms.model, bodyshells.brand AS bs_brand, bodyshells.name AS bs_name, bodyshells.variant AS bs_variant, events.name AS event_name, tracks.name AS track_name, tracks.surface, tracks.layout, tracktimes.direction, tracktimes.lapcount, tracktimes.total_time, motor_size, motor_turn, esc_size, esc_setting, fdr, tires_brand, tires_frnt_shore,tires_rear_shore, diff_frnt_type, diff_frnt_oil_wght, diff_rear_type, diff_rear_oil_wght, wt_distro_front, wt_distro_rear, wt_distro_lft, wt_distro_rht, wt_distro_fr_rl, wt_distro_fl_rr, ride_ht_front, ride_ht_rear, susp_frnt_top_pos, susp_frnt_btn_pos, susp_rear_top_pos, susp_rear_btn_pos,susp_frnt_pist_holes, susp_rear_pist_holes, susp_frnt_spring_hardness, susp_rear_spring_hardness, susp_frnt_oil_wt, susp_rear_oil_wt, susp_frnt_rebound, susp_rear_rebound, camber_frnt, camber_rear, caster_frnt, toe_out_frnt, toe_in_rear, anti_roll_frnt_wire_thickness, anti_roll_rear_wire_thickness FROM setups INNER JOIN users ON setups.userid = users.id INNER JOIN platforms ON platform_id = platforms.id INNER JOIN bodyshells ON bodyshell_id = bodyshells.id INNER JOIN events ON setup_event_id = events.id INNER JOIN setups_tracktimes ON setups_tracktimes.setup_id = setups.id INNER JOIN tracktimes ON setups_tracktimes.tracktime_id = tracktimes.id INNER JOIN tracks ON tracks.id = tracktimes.track_id WHERE setups.id = $1;';

  pool.query(setupSheetQuery, setupIndex, (setupErr, setupResults) => {
    if (setupErr) {
      console.log('Error at setupSheetQuery =', setupErr);
      return;
    }
    console.log(setupResults.rows[0]);
    const resultOut = setupResults.rows[0];

    const content = {
      index: setupId,
      driverName: resultOut?.user_name,
      platformBrand: resultOut?.platform_brand,
      platformName: resultOut?.platform_name,
      model: resultOut?.model,
      bsBrand: resultOut?.bs_brand,
      bsName: resultOut?.bs_name,
      bsVariant: resultOut?.bs_variant,
      eventName: resultOut?.event_name,
      track: resultOut?.track_name,
      surface: resultOut?.surface,
      layout: resultOut?.layout,
      direction: resultOut?.direction,
      lapCount: resultOut?.lapcount,
      totalTime: resultOut?.total_time,
      motor: resultOut?.motor_size,
      turns: resultOut?.motor_turn,
      escSize: resultOut.esc_size,
      escSetting: resultOut.esc_setting,
      fdr: resultOut.fdr,
      tireBrand: resultOut.tires_brand,
      tiresFrntShore: resultOut.tires_frnt_shore,
      tiresRearShore: resultOut.tires_rear_shore,
      diffFrntType: resultOut.diff_frnt_type,
      diffFrntOil: resultOut.diff_frnt_oil_wght,
      diffRearType: resultOut.diff_rear_type,
      diffRearOil: resultOut.diff_rear_oil_wght,
      wtFrnt: resultOut.wt_distro_front,
      wtRear: resultOut.wt_distro_rear,
      wtLft: resultOut.wt_distro_lft,
      wtRht: resultOut.wt_distro_rht,
      wtFRRL: resultOut.wt_distro_fr_rl,
      wtFLRR: resultOut.wt_distro_fl_rr,
      rideHtFrnt: resultOut.ride_ht_front,
      rideHtRear: resultOut.ride_ht_rear,
      susFrntTopPos: resultOut.susp_frnt_top_pos,
      susFrntBtnPos: resultOut.susp_frnt_btn_pos,
      susRearTopPos: resultOut.susp_rear_top_pos,
      susRearBtnPos: resultOut.susp_rear_btn_pos,
      susFrntPistHoles: resultOut.susp_frnt_pist_holes,
      susRearPistHoles: resultOut.susp_rear_pist_holes,
      susFrntSpring: resultOut.susp_frnt_spring_hardness,
      susRearSpring: resultOut.susp_rear_spring_hardness,
      susFrntOil: resultOut.susp_frnt_oil_wt,
      susRearOil: resultOut.susp_rear_oil_wt,
      susFrntRebound: resultOut.susp_frnt_rebound,
      susRearRebound: resultOut.susp_rear_rebound,
      camberFrnt: resultOut.camber_frnt,
      camberRear: resultOut.camber_rear,
      casterFrnt: resultOut.caster_frnt,
      toeFrnt: resultOut.toe_out_frnt,
      toeRear: resultOut.toe_in_rear,
      antiRollFrnt: resultOut.anti_roll_frnt_wire_thickness,
      antiRollRear: resultOut.anti_roll_rear_wire_thickness,
    };
    res.render('setupSheet', content);
  });
}

const showDashBoard = (req, res) => {
 res.render('userDashBoard');
};

const showNewSetupForm = (req, res) => {
  const results = Promise.all([
    pool.query('SELECT * FROM users;'),
    pool.query('SELECT * FROM platforms'),
    pool.query('SELECT * FROM bodyshells'),
    pool.query('SELECT * FROM events'),
    pool.query('SELECT * FROM tracks'),
/*     pool.query('SELECT * FROM tracktimes'), */
    
  ]).then((allResults) => {
    /* console.log(allResults); */
    console.log(allResults[0].rows);
    console.log(allResults[1].rows);
    console.log(allResults[2].rows);
    console.log(allResults[3].rows);
    console.log(allResults[4].rows);
    /* console.log(allResults[5].rows); */
  });
  

  /* res.send('testing new Promise setup. See console messages.'); */
  res.render('newSetupSheet');
};

const sendNewSetup = (req, res) => {
  const formSubmitted = req.body;
  const formData = JSON.parse(JSON.stringify(formSubmitted));
  console.log(formData);
  const setupInput = [
    formData.motor_size,
    formData.motor_turn,
    formData.esc_size,
    formData.esc_setting,
    formData.fdr,
    formData.tires_brand,
    formData.tires_frnt_shore,
    formData.tires_rear_shore,
    formData.diff_frnt_type,
    formData.diff_frnt_oil_wght,
    formData.diff_rear_type,
    formData.diff_rear_oil_wght,
    formData.wt_distro_front,
    formData.wt_distro_rear,
    formData.wt_distro_lft,
    formData.wt_distro_rht,
    formData.wt_distro_fr_rl,
    formData.wt_distro_fl_rr,
    formData.ride_ht_front,
    formData.ride_ht_rear,
    formData.susp_frnt_top_pos,
    formData.susp_frnt_btn_pos,
    formData.susp_rear_top_pos,
    formData.susp_rear_btn_pos,
    formData.susp_frnt_pist_holes,
    formData.susp_rear_pist_holes,
    formData.susp_frnt_spring_hardness,
    formData.susp_rear_spring_hardness,
    formData.susp_frnt_oil_wt,
    formData.susp_rear_oil_wt,
    formData.susp_frnt_rebound,
    formData.susp_rear_rebound,
    formData.camber_frnt,
    formData.camber_rear,
    formData.caster_frnt,
    formData.toe_out_frnt,
    formData.toe_in_rear,
    formData.anti_roll_frnt_wire_thickness,
    formData.anti_roll_rear_wire_thickness,
  ];

  const newSetupQuery = 'INSERT INTO setups (motor_size, motor_turn, esc_size, esc_setting, fdr, tires_brand, tires_frnt_shore, tires_rear_shore, diff_frnt_type, diff_frnt_oil_wght, diff_rear_type, diff_rear_oil_wght,wt_distro_front, wt_distro_rear, wt_distro_lft, wt_distro_rht, wt_distro_fr_rl,wt_distro_fl_rr, ride_ht_front, ride_ht_rear, susp_frnt_top_pos,susp_frnt_btn_pos, susp_rear_top_pos, susp_rear_btn_pos, susp_frnt_pist_holes,susp_rear_pist_holes, susp_frnt_spring_hardness, susp_rear_spring_hardness,susp_frnt_oil_wt, susp_rear_oil_wt, susp_frnt_rebound, susp_rear_rebound,camber_frnt, camber_rear, caster_frnt, toe_out_frnt, toe_in_rear,anti_roll_frnt_wire_thickness, anti_roll_rear_wire_thickness) VALUES ($1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39);';

  pool.query(newSetupQuery, setupInput, (errorSetup, resultsSetup) => {
    if(errorSetup) {
      console.log('Error at Setup Query Submission', errorSetup);
      return;
    }
    res.send('setup Form data successfully posted out towards Database. Please check DB to ensure data received properly.');
  });
};

const showAllPlatforms = (req, res) => {
  const queryAllPlatforms = 'SELECT * FROM platforms;';
  pool.query(queryAllPlatforms, (ptfmErrors, ptfmResults) => {
    if (ptfmErrors) {
      console.log('ERROR @ PLATFORM QUERY =', ptfmErrors);
      return;
    }
    console.log(ptfmResults.rows);
    const content = { platforms: ptfmResults.rows };
    res.render('platforms', content);
  });
};

const showAllTypes = (req, res) => {
  const queryAllTypes = 'SELECT * FROM Types;';
  pool.query(queryAllTypes, (typeErrors, typeResults) => {
    if (typeErrors) {
      console.log('ERROR @ TYPE QUERY =', typeErrors);
      return;
    }
    console.log(typeResults.rows);
    const content = { types: typeResults.rows };
    res.render('types', content);
  });
};

const showAllCategories = (req, res) => {
  const queryAllCategories = 'SELECT * FROM categories;';
  pool.query(queryAllCategories, (catErrors, catResults) => {
    if (catErrors) {
      console.log('ERROR @ CATEGORY QUERY =', catErrors);
      return;
    }
    console.log(catResults.rows);
    const content = { categories: catResults.rows };
    res.render('categories', content);
  });
};

const showAllEvents = (req, res) => {
  const queryAllEvents = 'SELECT * FROM events;';
  pool.query(queryAllEvents, (eventErrors, eventResults) => {
    if (eventErrors) {
      console.log('ERROR @ EVENTS QUERY =', eventErrors);
      return;
    }
    console.log(eventResults.rows);
    const content = { events: eventResults.rows };
    res.render('events', content);
  });
};

const showAllTracks = (req, res) => {
  const queryAllTracks = 'SELECT * FROM tracks;';
  pool.query(queryAllTracks, (trackErrors, trackResults) => {
    if (trackErrors) {
      console.log('ERROR @ TRACKS QUERY =', trackErrors);
      return;
    }
    console.log(trackResults.rows);
    const content = { tracks: trackResults.rows };
    res.render('tracks', content);
  });
};

const showAllTrackTimes = (req, res) => {
  const queryAllTrackTimes = 'SELECT * FROM TrackTimes;';
  pool.query(queryAllTrackTimes, (trackTimesErrors, trackTimesResults) => {
    if (trackTimesErrors) {
      console.log('ERROR @ TRACKTIMES QUERY =', trackTimesErrors);
      return;
    }
    console.log(trackTimesResults.rows);
    const content = { tracktimes: trackTimesResults.rows };
    res.render('tracktimes', content);
  });
};

const showAllBodyshells = (req, res) => {
  const queryAllBodyshells = 'SELECT * FROM bodyshells;';
  pool.query(queryAllBodyshells, (bodyshellsErrors, bodyshellsResults) => {
    if (bodyshellsErrors) {
      console.log('ERROR @ BODYSHELLS QUERY =', bodyshellsErrors);
      return;
    }
    console.log(bodyshellsResults.rows);
    const content = { bodyshells: bodyshellsResults.rows };
    res.render('bodyshells', content);
  });
};

const showAllUsers = (req, res) => {
  const queryAllUsers = 'SELECT * FROM users;';
  pool.query(queryAllUsers, (usersErrors, usersResults) => {
    if (usersErrors) {
      console.log('ERROR @ USERS QUERY =', usersErrors);
      return;
    }
    console.log(usersResults.rows);
    const content = { users: usersResults.rows };
    res.render('users', content);
  });
};

/* ROUTES */
app.get('/setup/:setupId', showSetupSheet); /* Single Setup Page */
app.get('/setup', showNewSetupForm); /* Create New Setup */
app.post('/setup', sendNewSetup); /* Post Setup body */

app.get('/categories', showAllCategories); /* Show All Categories */
app.get('/types', showAllTypes); /* Show All Types */
app.get('/platforms', showAllPlatforms); /* List All Platforms */
app.get('/events', showAllEvents); /* Show All Events */
app.get('/tracks', showAllTracks); /* Show All Tracks */
app.get('/tracktimes', showAllTrackTimes); /* Show All Track Times */
app.get('/bodyshells', showAllBodyshells); /* Show All Bodies */
app.get('/users', showAllUsers); /* Show All Users */



/* ROUTE: USER DASHBOARD PAGE */
app.get('/user-dashboard', showDashBoard);


/* ALL SETUP SHEETS OF USER */



/* ALL PLATFORMS OF USER */
/* ALL EVENTS ON SERVER */




app.listen(port, () => console.log('listening on Port:', port));