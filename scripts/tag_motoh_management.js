for (var id = 0; id <= 44; id++) {
   if (id === 4 || id === 7 || id >= 40) continue; // no motors in these elements

   (function () {
      var motorstundas = getTag("ElementID" + id + "_MotoT"); // [min]
      if (motorstundas) motorstundas = Number((motorstundas / 60).toFixed(1)); // min -> h
      var lastCheck = getTag("motoTime_lastCheck_ID" + id); // [min]
      lastCheck = lastCheck ? Number((lastCheck / 60).toFixed(1)) : 0; // min -> h
      var serviceInterval = getTag("serviceInterval_ID" + id); // [h]

      // error handling: no data from any parameter, 
      if ((!motorstundas && motorstundas !== 0) || (!serviceInterval && serviceInterval !== 0)) {
         return; debugString("ERROR: ID" + id + " - motorstundas(" + motorstundas + "), serviceInterval(" + serviceInterval + ").");
      }

      // calculating the time left to the next motor service
      var serviceTimeLeft = parseFloat((serviceInterval - (motorstundas - lastCheck)).toFixed(1));
      setTag("serviceTimeLeft_ID" + id, serviceTimeLeft);

      // if (id === 1) {
      // debugString("motoh: " + motorstundas);
      // debugString("interval: " + serviceInterval);
      // debugString("serviceTimeLeft: " + serviceTimeLeft);
      // debugString("serviceInterval - (motorstundas - lastCheck) / 60");
      // }

      // trigger for motoh alarm
      setTag("motoh_alarm_ID" + id, serviceTimeLeft <= 0);
   })();
}
