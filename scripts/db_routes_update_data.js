(function () {
   var pgJson = { dbgroup: "_postgres", outfmt: "json" }, pg = { dbgroup: "_postgres" };

   var allDbRoutesRows = JSON.parse(getSql("select * from al_routes order by r_id asc;", pgJson));
   if (allDbRoutesRows === null) return debugString("no data in 'al_routes' table!");

   allDbRoutesRows.forEach(function (dbTagRow) {
      var r_id = dbTagRow["r_id"];
      var routeStateInt = getTag("State_R" + r_id);

      var routeStateHumanLang = "", routeColor = "#515151";
      switch (routeStateInt) {
         case 0:
            routeStateHumanLang = "stopped";
            routeColor = "#515151";
            break;
         case 1:
            routeStateHumanLang = "starting";
            routeColor = "#FFE600";
            break;
         case 2:
            routeStateHumanLang = "started";
            routeColor = "#00FF0A";
            break;
         case 3:
            routeStateHumanLang = "stopping";
            routeColor = "#FFE600";
            break;
         case 4:
            routeStateHumanLang = "paused";
            routeColor = "#fc6b02";
            break;
         case 5:
            routeStateHumanLang = "ERROR";
            routeColor = "#FF0101";
            break;
         default:
            routeStateHumanLang = "UNHANDLED ROUTE STATE (" + routeStateInt + ")";
            break;
      }

      setSql("update al_routes set r_state=" + routeStateInt + ", r_state_humanlang='" + routeStateHumanLang + "', r_color = '" + routeColor + "' where r_id=" + r_id + ";", pg);
   });
})();