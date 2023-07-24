(function () {
  var kwh = getTag('Part2_kWh');
  if (kwh === null) return debugString('kWh - No valid data. KWH = (' + kwh + ')');
  var sqlString = 'INSERT INTO al2_kwh (kwh) VALUES(' + kwh.toFixed(0) + ');';
  setSql(sqlString, { dbgroup: "_postgres" });
})();