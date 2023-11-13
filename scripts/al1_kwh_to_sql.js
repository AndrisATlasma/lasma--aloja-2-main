(function () {
  var kwh = getTag('Part1_kWh');
  if (kwh === null) return debugString('kWh - No valid data. KWH = (' + kwh + ')');
  var sqlString = 'INSERT INTO al1_kwh (kwh) VALUES(' + kwh.toFixed(0) + ');';
  setSql(sqlString, { dbgroup: "_postgres" });
})();