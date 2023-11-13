(function () {
  var kwh = getTag('Part3_kWh');
  if (kwh === null) return debugString('kWh - No valid data. KWH = (' + kwh + ')');
  var sqlString = 'INSERT INTO al3_kwh (kwh) VALUES(' + kwh.toFixed(0) + ');';
  setSql(sqlString, { dbgroup: "_postgres" });
})();