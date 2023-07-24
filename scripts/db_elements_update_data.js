function returnIntFromBoolean(bool) {
   if (bool) return 1;
   return 0;
}

(function () {
   var pgJson = { dbgroup: "_postgres", outfmt: "json" }, pg = { dbgroup: "_postgres" };

   var allElements = JSON.parse(getSql("select * from al_elements;", pgJson));
   if (allElements === null) return debugString("ADD ELEMENTS INTO ELEMENTS TABLE!");

   allElements.forEach(function (elData) {
      if (!elData.el_id && elData.el_id !== 0) return debugString("CHECK ELEMENTS TABLE!");

      var el_id = elData.el_id;
      var stateID = getTag("state_ID" + el_id);

      // svg element names match tag names
      var strava = null, frekv = null, t_level = null, parpsensor = null, el_state, el_color, el_state_humanlang, moto_time = null, service_time_left = null, service_last_check = null, service_interval = null;
      if (elData.anim_strava) {
         strava = getTag(elData.anim_strava);
         if (strava !== null) strava = Number(strava.toFixed(1));
      }
      if (elData.anim_frekv) {
         frekv = getTag(elData.anim_frekv);
         if (frekv !== null) frekv = Number(frekv.toFixed(0));
      }
      if (elData.anim_level) {
         t_level = getTag(elData.anim_level);
         if (t_level !== null) t_level = Number(t_level.toFixed(0));
      }

      if (elData.anim_parpsensor) parpsensor = returnIntFromBoolean(getTag(elData.anim_parpsensor));

      var ovf_err = returnIntFromBoolean(getTag("ovfErr_ID" + el_id));
      var cont_err = returnIntFromBoolean(getTag("contErr_ID" + el_id));
      var m_err = returnIntFromBoolean(getTag("mErr_ID" + el_id));
      var rot_err = returnIntFromBoolean(getTag("rotErr_ID" + el_id));
      var mototime_err = returnIntFromBoolean(getTag("motoh_alarm_ID" + el_id));

      var comand = getTag("comand_ID" + el_id);
      if (comand === null || comand === '') comand = 0;

      if (el_id !== 4 && el_id !== 7 && el_id < 40) { // element has a motor
         moto_time = getTag("ElementID" + el_id + "_MotoT");
         if (moto_time !== null) moto_time = parseFloat((moto_time / 60).toFixed(1));

         service_time_left = getTag("serviceTimeLeft_ID" + el_id);
         service_last_check = getTag("motoTime_lastCheck_ID" + el_id);
         service_interval = getTag("serviceInterval_ID" + el_id);
      }


      switch (stateID) {
         case 0:
            el_state = 0;
            el_color = '#9599A0';
            el_state_humanlang = 'stopped';
            break;
         case 1:
            el_state = 1;
            el_color = '#38ff00';
            el_state_humanlang = 'started';
            break;
         case 2:
            el_state = 2;
            el_color = '#FF0000';
            el_state_humanlang = 'error';
            break;
         case 3:
            el_state = 3;
            el_color = '#FF6B00';
            el_state_humanlang = 'pause request';
            break;
         default:
            el_state = 0;
            el_color = '#9599A0';
            el_state_humanlang = 'UNHANDLED STATE (' + stateID + ')';
            break;
      }


      var sqlText = "update al_elements set el_state = " + el_state + ", el_state_humanlang = '" + el_state_humanlang + "', el_color = '" + el_color + "', strava = " + strava + ", frekv = " + frekv + ", t_level=" + t_level + ", ovf_err = " + ovf_err + ", cont_err = " + cont_err + ", m_err = " + m_err + ", rot_err = " + rot_err + ", comand=" + comand + ", moto_time_h = " + moto_time + ", service_time_left_h=" + service_time_left + ", parp_sensor=" + parpsensor + ", service_last_check_min = " + service_last_check + ", service_interval_h = " + service_interval + ", mototime_err = " + mototime_err + " where el_id = " + el_id;
      var ssq = setSql(sqlText, pg);

   });
})();