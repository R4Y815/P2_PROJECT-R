/* eslint-disable max-len */
import pg from 'pg';
import express, { request } from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import jsSHA from 'jssha';
import moment from 'moment';

/* POSTGRESQL STACK BELOW */

/* OLD POSTGRESQL STCK BELOW */
/* ==================================================== */
/* Connecting database to server */
 const { Pool } = pg;


/*const pgConnectionConfigs = {
  user: 'raytor27',
  host: 'localhost',
  database: 'project_2_db',
  port: 5432, // Postgres server always runs on this port
}; */
/* ==================================================== */

/* NEW CONNECTION STACK SWITCH BELOW: FOR HEROKU */ 

let pgConnectionConfigs;

/* test to see if the env var is set. The we know we are in Heroku */
if (process.env.DATABASE_URL) {
  /* pg will take in the entire value and use it to connect */
  pgConnectionConfigs = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  };
} else {
  /* this will be the same value as before */
  pgConnectionConfigs = {
    user: 'raytor27',
    host: 'localhost',
    database: 'project_2_db',
    port: 5432, // Postgres server always runs on this port
  };
}

const pool = new Pool (pgConnectionConfigs);

const app = express();
/* const port = 3020; */
const PORT = process.env.PORT || 3004;

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

/* HELPER FUNCTION: CONVERT total_time from mins:secs:TEXT ms INTO ms INTEGER */
const convertTextToMs = (timeText) => {
  const mins = Number(timeText.split(':')[0]);
  const secs = Number(timeText.split(':')[1].split('.')[0]);
  const millisecs = Number(timeText.split(':')[1].split('.')[1]);
  return mins * 60 * 1000 + secs * 1000 + millisecs;
};

/* HELPER FUNCTION: CONVERT from ms INTEGER into   mins:secs: ms TEXT */
const convertMsToText = (timeMs) => {
  const minsStr = (timeMs / 60000).toString().split('.')[0];
  const secsStr = ((timeMs % 60000) / 1000).toString().split('.')[0];
  const msStr = ((timeMs % 60000) / 1000).toString().split('.')[1];
  return minsStr + ':' + secsStr + '.' + msStr;
};

/* CONVERT JS Date Datatype into STRING */
function dateToStr(inputDate, format) {
  /* parse the input date */
  const date = new Date(inputDate);
  /* extract the parts of the date */
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  /* replace the month */
  format = format.replace("MM", month.toString().padStart(2, 0));
  /* replace the year */
  if (format.indexOf("YYYY") > -1) {
    format = format.replace("YYYY", year.toString());
  } else if (format.indexOf("YY") > -1) {
    format = format.replace("YY", year.toString().substr(2,2));
  }
  /* replace the day */
  format = format.replace("DD", day.toString().padStart(2,"0"));

  return format;
}

/* HELPER FN: convert to DateTimeZone of JS */
const dispDateCPUStr = (dateTZformat) => {
  const dateStr1 = dateTZformat.toISOString().split('T')[0];
  const yyyy = dateStr1.split('-')[0];
  const mm = dateStr1.split('-')[1];
  /* Additional + 1 is added to correct date display to local date in GMT +8 TZ */
  const ddNmbr = Number(dateStr1.split('-')[2]) + 1;
  const dd = ddNmbr.toString().padStart(2,"0");
  const correctedDateStr = yyyy + '-' + mm + '-' + dd;
  console.log('corrected date =', correctedDateStr);
return correctedDateStr;
};



/* FN for Routes */
/* FN: get Setup Sheet*/
const showSetupSheet = (req, res) =>{
  const { setupId } = req.params;
  const setupIndex = [setupId];
  console.log(setupIndex);
  const setupSheetQuery = 'SELECT setups.id, setups.name AS setup_name, users.name AS user_name, platforms.brand AS platform_brand, platforms.name AS platform_name, platforms.model, motor_size, motor_turn, esc_size, esc_setting, fdr, tires_brand, tires_frnt_shore,tires_rear_shore, diff_frnt_type, diff_frnt_oil_wght, diff_rear_type, diff_rear_oil_wght, wt_distro_front, wt_distro_rear, wt_distro_lft, wt_distro_rht, wt_distro_fr_rl, wt_distro_fl_rr, ride_ht_front, ride_ht_rear, susp_frnt_top_pos, susp_frnt_btn_pos, susp_rear_top_pos, susp_rear_btn_pos,susp_frnt_pist_holes, susp_rear_pist_holes, susp_frnt_spring_hardness, susp_rear_spring_hardness, susp_frnt_oil_wt, susp_rear_oil_wt, susp_frnt_rebound, susp_rear_rebound, camber_frnt, camber_rear, caster_frnt, toe_out_frnt, toe_in_rear, anti_roll_frnt_wire_thickness, anti_roll_rear_wire_thickness FROM setups INNER JOIN users ON setups.userid = users.id INNER JOIN platforms ON platform_id = platforms.id WHERE setups.id = $1;';

  pool.query(setupSheetQuery, setupIndex, (setupErr, setupResults) => {
    if (setupErr) {
      console.log('Error at setupSheetQuery =', setupErr);
      return;
    }
    console.log(setupResults.rows[0]);
    const resultOut = setupResults.rows[0];

    const content = {
      index: setupId,
      setupName: resultOut.setup_name,
      creator: resultOut?.user_name,
      platformBrand: resultOut?.platform_brand,
      platformName: resultOut?.platform_name,
      model: resultOut?.model,
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
    pool.query('SELECT * FROM users ORDER BY name ASC;'),
    pool.query('SELECT * FROM platforms ORDER BY brand ASC;'),
  ]).then((allResults) => {
    /* console.log(allResults); */
    /* console.log(allResults[0].rows); */
    /* console.log(allResults[1].rows); */
    /* HAS TO BE CHANGED TO USER GIVEN BY COOKIES */
    const content = { users: allResults[0].rows, platforms: allResults[1].rows };
    /* console.log(content.users[0].name); */

    res.render('newSetupSheet', content);
  });
};

const sendNewSetup = (req, res) => {
  const formSubmitted = req.body;
  const formData = JSON.parse(JSON.stringify(formSubmitted));
  console.log('formData =', formData);
  const setupInput = [
    formData.setupName,
    formData.userId,
    formData.platformId,
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
    formData.susFrntTopPos,
    formData.susFrntBtnPos,
    formData.susRearTopPos,
    formData.susRearBtnPos,
    formData.susFrntPistHoles,
    formData.susRearPistHoles,
    formData.susFrntSpring,
    formData.susRearSpring,
    formData.susFrntOil,
    formData.susRearOil,
    formData.susFrntRebound,
    formData.susRearRebound,
    formData.camberFrnt,
    formData.camberRear,
    formData.casterFrnt,
    formData.toeFrnt,
    formData.toeRear,
    formData.antiRollFrnt,
    formData.antiRollRear,
  ];

  const newSetupQuery = 'INSERT INTO setups (name, userid, platform_id, motor_size, motor_turn, esc_size, esc_setting, fdr, tires_brand, tires_frnt_shore, tires_rear_shore, diff_frnt_type, diff_frnt_oil_wght, diff_rear_type, diff_rear_oil_wght,wt_distro_front, wt_distro_rear, wt_distro_lft, wt_distro_rht, wt_distro_fr_rl,wt_distro_fl_rr, ride_ht_front, ride_ht_rear, susp_frnt_top_pos,susp_frnt_btn_pos, susp_rear_top_pos, susp_rear_btn_pos, susp_frnt_pist_holes,susp_rear_pist_holes, susp_frnt_spring_hardness, susp_rear_spring_hardness,susp_frnt_oil_wt, susp_rear_oil_wt, susp_frnt_rebound, susp_rear_rebound,camber_frnt, camber_rear, caster_frnt, toe_out_frnt, toe_in_rear, anti_roll_frnt_wire_thickness, anti_roll_rear_wire_thickness) VALUES ($1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42) RETURNING id;';

  pool.query(newSetupQuery, setupInput, (errorSetup, resultsSetup) => {
    if(errorSetup) {
      console.log('ERROR @ SETUP QUERY =', errorSetup);
      return;
    }
    const setupId = resultsSetup.rows[0].id;
    /* res.send('setup Form data successfully posted out towards Database. Please check DB to ensure data received properly.'); */
    res.redirect(301, `http://localhost:${PORT}/setup/${setupId}`);
  });
};

const showSetupEdit = (req, res) => {
  const { setupId } = req.params;
  const setupIndexData = [setupId];
  const results = Promise.all([
    pool.query('SELECT * from users ORDER BY name ASC;'),
    pool.query('SELECT * FROM platforms ORDER BY brand ASC;'),
    pool.query('SELECT setups.id, setups.name, setups.userid, users.name AS user_name, setups.platform_id, platforms.brand AS platform_brand, platforms.name AS platform_name, platforms.model, motor_size, motor_turn, esc_size, esc_setting, fdr, tires_brand, tires_frnt_shore,tires_rear_shore, diff_frnt_type, diff_frnt_oil_wght, diff_rear_type, diff_rear_oil_wght, wt_distro_front, wt_distro_rear, wt_distro_lft, wt_distro_rht, wt_distro_fr_rl, wt_distro_fl_rr, ride_ht_front, ride_ht_rear, susp_frnt_top_pos, susp_frnt_btn_pos, susp_rear_top_pos, susp_rear_btn_pos,susp_frnt_pist_holes, susp_rear_pist_holes, susp_frnt_spring_hardness, susp_rear_spring_hardness, susp_frnt_oil_wt, susp_rear_oil_wt, susp_frnt_rebound, susp_rear_rebound, camber_frnt, camber_rear, caster_frnt, toe_out_frnt, toe_in_rear, anti_roll_frnt_wire_thickness, anti_roll_rear_wire_thickness FROM setups INNER JOIN users ON setups.userid = users.id INNER JOIN platforms ON platform_id = platforms.id WHERE setups.id = $1;', setupIndexData),
  ]).then((allResults) => {
    const content = {
      id: setupId,
      users: allResults[0].rows,
      platforms: allResults[1].rows,
      setup: allResults[2].rows[0],
    };
/*     console.log('setup motor_size=', content.setup.motor_size);
    console.log('Mechanic name =', content.setup.user_name); */
 /*    console.log('content.setup =', content.setup); */
    res.render('editSetup', content);
  });
}

const sendEditedSetup = (req, res) => {
  /* console.log('req.params =', req.params); */
  const { setupId } = req.params;
  const setupEditData = JSON.parse(JSON.stringify(req.body));
  /* console.log('setupEditData =', setupEditData); */
  const editInputsArr = Object.values(setupEditData);
  editInputsArr.push(setupId);
  console.log('editInputsArr =', editInputsArr);
  const editSetupQuery = 'UPDATE setups SET name = $1, userid = $2, platform_id = $3,motor_size = $4, motor_turn = $5, esc_size = $6, esc_setting = $7, fdr = $8,tires_brand = $9, tires_frnt_shore = $10, tires_rear_shore = $11,diff_frnt_type = $12, diff_frnt_oil_wght = $13, diff_rear_type = $14, diff_rear_oil_wght = $15,wt_distro_front = $16, wt_distro_rear = $17, wt_distro_lft = $18, wt_distro_rht = $19, wt_distro_fr_rl = $20, wt_distro_fl_rr = $21, ride_ht_front = $22, ride_ht_rear = $23, susp_frnt_top_pos = $24, susp_frnt_btn_pos = $25,susp_frnt_pist_holes = $26, susp_frnt_spring_hardness = $27, susp_frnt_oil_wt = $28,susp_frnt_rebound = $29, susp_rear_top_pos = $30, susp_rear_btn_pos = $31, susp_rear_pist_holes = $32, susp_rear_spring_hardness = $33, susp_rear_oil_wt = $34,susp_rear_rebound = $35, caster_frnt = $36, camber_frnt = $37, camber_rear = $38,toe_out_frnt = $39, toe_in_rear = $40, anti_roll_frnt_wire_thickness = $41,anti_roll_rear_wire_thickness = $42 WHERE id = $43;';
  pool.query(editSetupQuery, editInputsArr, (err, results) => {
    if (err) {
      console.log('ERROR @ editSetupQuery submission = ', err);
      return;
    }
    res.redirect(301, `http://localhost:${PORT}/setup/${setupId}`);
  });
};

const showAllSetups = (req, res) => {
  const queryAllSetups = 'SELECT setups.id, setups.name, platforms.brand, platforms.name AS platform_name, setups.motor_turn, setups.fdr, setups.name AS setup_name, users.name AS user_name FROM setups INNER JOIN platforms  ON setups.platform_id = platforms.id INNER JOIN users ON setups.userid = users.id ORDER BY setups.id ASC;';
  pool.query(queryAllSetups, (err, results) => {
    if(err) {
      console.log('ERROR @ queryAllSetups =', err);
      return;
    }
    console.log(results.rows);
    const content = { setups: results.rows,};
    res.render('setups', content);
  });
};

const deleteSetup = (req, res) => {
  const { setupId } = req.params;
  const delDataId = [ setupId ];
  const delSetupQuery = 'DELETE FROM setups WHERE id = $1;';
  pool.query(delSetupQuery, delDataId, (err, results) => {
    if(err) {
      console.log('ERROR @ delSetupQuery submission =', err);
      return;
    }
    res.redirect(301, `http://localhost:${PORT}/setups`);
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

/* const showAllEvents = (req, res) => {
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
}; */

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

const showAllTrackTimes = (req, res) => {
  const queryAllTrackTimes = 'SELECT tracktimes.id AS tracktimes_id, date, event_name, tracks.name AS track_name, users.name AS user_name, tracktimes.direction, tracktimes.lapcount, tracktimes.total_time, types.name AS type_name, platforms.brand AS platform_brand, platforms.model AS platform_model, platforms.name AS platform_name, setups.id AS setup_id, setups.name AS setup_name, bodyshells.brand AS bodyshell_brand, bodyshells.name AS bodyshell_name, bodyshells.variant AS bodyshell_variant FROM tracktimes INNER JOIN tracks ON tracktimes.track_id = tracks.id INNER JOIN users ON tracktime_user_id = users.id INNER JOIN types ON tracktime_type_id = types.id INNER JOIN platforms ON tracktime_platform_id = platforms.id INNER JOIN setups ON tracktime_setup_id = setups.id INNER JOIN bodyshells ON tracktime_bodyshell_id = bodyshells.id ORDER BY tracktimes_id ASC;';
  pool.query(queryAllTrackTimes, (trackTimesErrors, trackTimesResults) => {
    if (trackTimesErrors) {
      console.log('ERROR @ TRACKTIMES QUERY =', trackTimesErrors);
      return;
    }
    console.log('trackTimesResults.rows =', trackTimesResults.rows);
    const outputs = trackTimesResults.rows;
    outputs.forEach((output) => {
      output.timeStr = convertMsToText(output.total_time);
      output.dateStr = dateToStr(output.date, 'DD-MM-YYYY');
      /* output.dateStr = dispDateCPUStr(output.date); */
    });
    const content = { tracktimes: outputs };
    console.log('content =', content);
    res.render('tracktimes', content);
  });
};


const showNewTracktimeForm = (req, res) => {
  const results = Promise.all([
    pool.query('SELECT * FROM tracks ORDER BY name ASC'),
    pool.query('SELECT * FROM users ORDER BY name ASC;'),
    pool.query('SELECT * FROM types'),
    pool.query('SELECT * FROM platforms ORDER BY brand ASC'),
    pool.query('SELECT  platforms.name AS platform_name, platforms.model, setups.id, setups.name FROM setups INNER JOIN platforms ON setups.platform_id = platforms.id;'),
    pool.query('SELECT * FROM bodyshells ORDER by brand ASC'),
  ]).then((allResults) => {
    /* console.log(allResults); */
/*     console.log(allResults[0].rows);
    console.log(allResults[1].rows);
    console.log(allResults[2].rows);
    console.log(allResults[3].rows);
    console.log(allResults[4].rows);
    console.log(allResults[5].rows); */
    /* res.send('testing new Promise setup. See console messages.'); */
    const todayDateStr = new Date().toISOString().split('T')[0];
    console.log('todayDateStr =', todayDateStr);
    const content = {
      dateNow: todayDateStr,
      tracks: allResults[0].rows,
      users: allResults[1].rows,
      types: allResults[2].rows,
      platforms: allResults[3].rows,
      setups: allResults[4].rows,
      bodyshells: allResults[5].rows,
    };
    
    res.render('newTracktime', content);
  });
};

const sendNewTracktime = (req, res) => {
const formSubmitted = req.body;
const formData = JSON.parse(JSON.stringify(formSubmitted));
const timeInMs = convertTextToMs(formData.total_time);
console.log('formData.date =', formData.date);
const tracktimeInput = [
formData.date,
formData.event_name,
formData.trackId,
formData.direction,
formData.userId,
formData.lapcount,
timeInMs,
formData.typeId,
formData.platformId,
formData.setupId,
formData.bodyshell_id,
];
const insertNewTimes = 'INSERT into tracktimes (date, event_name, track_id, direction, tracktime_user_id, lapcount, total_time, tracktime_type_id, tracktime_platform_id, tracktime_setup_id, tracktime_bodyshell_id) VALUES($1, $2, $3, $4, $5,$6, $7,$8, $9, $10, $11) RETURNING id;';

pool.query(insertNewTimes, tracktimeInput, (errorTracktime, resultsTracktime) => {
    if (errorTracktime) {
      console.log('ERROR @ INSERT TRACKTIME QUERY =', errorTracktime);
      return;
    }
    const tracktimeId = resultsTracktime.rows[0].id;
    console.log('tracktimeId = ', tracktimeId);
    /* res.send('Insert Tracktime data successfully sent out, please check database side.'); */
    res.redirect(301, `http://localhost:${PORT}/tracktimes`);
  });
};

const showTracktimeEdit = (req, res) => {
  const { tracktimeId } = req.params;
  const tracktimeIndexData = [tracktimeId];
  const results = Promise.all([
    pool.query('SELECT * FROM tracks ORDER BY name ASC;'),
    pool.query('SELECT * FROM users ORDER BY name ASC;'),
    pool.query('SELECT * FROM types;'),
    pool.query('SELECT * FROM platforms;'),
    pool.query('SELECT  platforms.name AS platform_name, platforms.model, setups.id, setups.name FROM setups INNER JOIN platforms ON setups.platform_id = platforms.id;'),
    pool.query('SELECT * FROM bodyshells ORDER BY brand ASC;'),
    pool.query('SELECT tracktimes.id AS tracktimes_id, tracktimes.date, event_name, tracktimes.track_id, tracks.name AS track_name, tracktimes.tracktime_user_id, users.name AS user_name, tracktimes.direction, tracktimes.lapcount, tracktimes.total_time, types.name AS type_name, tracktimes.tracktime_type_id, platforms.brand AS platform_brand, platforms.model AS platform_model, platforms.name AS platform_name, tracktimes.tracktime_platform_id, setups.id AS setup_id, setups.name AS setup_name, tracktimes.tracktime_bodyshell_id, bodyshells.brand AS bodyshell_brand, bodyshells.name AS bodyshell_name, bodyshells.variant AS bodyshell_variant FROM tracktimes INNER JOIN tracks ON tracktimes.track_id = tracks.id INNER JOIN users ON tracktime_user_id = users.id INNER JOIN types ON tracktime_type_id = types.id INNER JOIN platforms ON tracktime_platform_id = platforms.id INNER JOIN setups ON tracktime_setup_id = setups.id INNER JOIN bodyshells ON tracktime_bodyshell_id = bodyshells.id WHERE tracktimes.id = $1;', tracktimeIndexData),
  ]).then((allResults) => {
    /* console.log('allResults[6].rows[0] =', allResults[6].rows[0]); */
    const timeStr = convertMsToText(allResults[6].rows[0].total_time);
    const dateStr = dateToStr(allResults[6].rows[0].date, "DD-MM-YYYY");

    const dbDateStr = dispDateCPUStr(allResults[6].rows[0].date)

    const todayDateStr = new Date().toISOString().split('T')[0];

    const content = {
      id: tracktimeId,
      tracks: allResults[0].rows,
      users: allResults[1].rows,
      types: allResults[2].rows,
      platforms: allResults[3].rows,
      setups: allResults[4].rows,
      bodyshells: allResults[5].rows,
      tracktime: allResults[6].rows[0],
      totalTime: timeStr,
      dateStringDisp: dateStr,
      dateDb: dbDateStr,
      dateNow: todayDateStr,
    };
    console.log('Date =', content.tracktime.date);
    res.render('editTracktime', content);
  });
};

const sendEditedTracktime = (req, res) => {
  const { tracktimeId } = req.params;
  const tracktimeEditData = JSON.parse(JSON.stringify(req.body));
  /* console.log('tracktimeEditData =', tracktimeEditData); */
  const tracktimeEditInput = Object.values(tracktimeEditData);
  tracktimeEditInput[6] = convertTextToMs(tracktimeEditInput[6]);
  tracktimeEditInput.push(tracktimeId);
  console.log('tracktimeEditInput =', tracktimeEditInput);
  const editTracktimeQuery = 'UPDATE tracktimes SET date = $1, event_name = $2, track_id = $3, tracktime_user_id = $4, direction = $5, lapcount = $6, total_time = $7, tracktime_type_id = $8, tracktime_platform_id = $9, tracktime_setup_id = $10, tracktime_bodyshell_id = $11 WHERE id = $12;';
  pool.query(editTracktimeQuery, tracktimeEditInput, (err, results) => {
    if(err) {
      console.log('ERROR @ editTracktimeQuery submission =', err);
      return;
    }
    /* res.send('sending tracktime test- see console for data details'); */
    res.redirect(301, `http://localhost:${PORT}/tracktimes`);
  });
};

const deleteTracktime = (req, res) => {
  const { tracktimeId } = req.params;
  const delTracktimeData = [tracktimeId];
  const delTrackTimeQuery = 'DELETE FROM tracktimes WHERE id = $1';
   pool.query(delTrackTimeQuery, delTracktimeData, (err, results) => {
    if(err) {
      console.log('ERROR @ delTrackTimeQuery submission =', err);
      return;
    }
    res.redirect(301, `http://localhost:${PORT}/tracktimes`);
  });
};

const generateHash = (input) => {
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(input);
    return shaObj.getHash('HEX'); /* hashedString */
};



const showSignUpPage = (req, res) => {
  res.render('signUp');
};

const sendSignUpData = (req, res) => {
  const hashedPassword = generateHash(req.body.password);

  /* store the hashed password in our DB */
  const values = [req.body.name, req.body.email, hashedPassword];
  const passwordQuery = 'INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3);';
  pool.query(passwordQuery, values, (err, results) => {
    if(err) {
      console.log('ERROR @ passwordQuery =', err);
      return;
    }
    res.send('hashed passwords created');
  });
};


const showLoginPage = (req, res) => {
  res.render('userLoginPage');
};

const sendLoginData = (req, res) => {
  /* retrieve the user entry using their email */
  const values = [req.body.email];
  const emailPassQuery ='SELECT * from users WHERE email = $1;';
  pool.query(emailPassQuery, values, (err, results) => {
    if(err){
      console.log('ERROR @ emailPassQuery =', err);
      return;
    }
    /* if we didnt find that user with that email */
    if (results.rows.length === 0) {
      res.status(403).send('login failed!');
      return; 
    }
    /* get user record from results */
    const user = results.rows[0];
    /* if enteredPassword doesn't match with hashPass from dB */
    const enteredPassword = generateHash(req.body.password);
    if (user.hashed_password !== enteredPassword ) {
      res.status(403).send('login failed!');
      return;
    }
    /* if enteredPasswordHash matches that in the DB, we authenticate the user */
    res.cookie('loggedIn, true');
    res.redirect(301, `http://localhost:${PORT}/user-dashboard`);
  });
};

const showLoggedOut = (req, res) => {
  res.clearCookie('loggedIn'); 
  console.log('All cookies cleared');
  res.render('userLogoutPage');
};


/* ROUTES */
/* SINGULAR SETUP PAGE */
app.get('/setup/:setupId', showSetupSheet); /* Single Setup Page */
app.get('/setup', showNewSetupForm); /* Page to Create New Setup */
app.post('/setup', sendNewSetup); /* Post Setup body */
/* EDIT SETUP */
app.get('/setup/:setupId/edit', showSetupEdit); /* Page: Edit Setup  */
app.put('/setup/:setupId', sendEditedSetup); /* Send editSetup Data */
/* ALL SETUP PAGES */
app.get('/setups', showAllSetups); /* Show All Setups */
/* DELETE SPECIFIC SETUP Page */
app.delete('/setup/:setupId', deleteSetup); /* Delete specific Setup */


/* TRACKTIMES PAGE */
app.get('/tracktimes', showAllTrackTimes); /* Show All Track Times */
app.get('/tracktime', showNewTracktimeForm); /* Record new tracktime Page */
app.post('/tracktime', sendNewTracktime); /* Send New Tracktime Data */
/* EDIT TRACKTIME */
app.get('/tracktime/:tracktimeId/edit', showTracktimeEdit); /* Page: Edit Tt */
app.put('/tracktime/:tracktimeId', sendEditedTracktime); /* Send editTt data */
/* DELETE SPECIFIC TRACKTIME PAGE */
app.delete('/tracktime/:tracktimeId', deleteTracktime); /* Delete specific Tracktime */ 

app.get('/types', showAllTypes); /* Show All Types */
app.get('/platforms', showAllPlatforms); /* List All Platforms */
app.get('/tracks', showAllTracks); /* Show All Tracks */
app.get('/bodyshells', showAllBodyshells); /* Show All Bodies */
app.get('/users', showAllUsers); /* Show All Users */

/* USER LOGINS, AUTH, ETC,  */
app.get('/user-dashboard', showDashBoard);
/* CREATE NEW USER ACCOUNT */
app.get('/signUp', showSignUpPage); /* New User Sign Up Page */
app.post('/signUp', sendSignUpData);


app.get('/login', showLoginPage); /* Login Page */
app.post('/login', sendLoginData); /* Post Login Data from front-end to backend */


app.delete('/logOut', showLoggedOut); /* LogOut Page */ 

/* ALL PLATFORMS OF USER */





app.listen(PORT, () => console.log('listening on Port:', PORT));