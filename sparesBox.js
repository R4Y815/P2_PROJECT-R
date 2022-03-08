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
