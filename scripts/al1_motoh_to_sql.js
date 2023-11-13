(function () {
  var pgJson = { dbgroup: '_postgres', outfmt: 'json' };
  var pg = { dbgroup: '_postgres' };
  var elementsTable = 'al1_elements';

  // Update elements
  var allElements = JSON.parse(getSql('select * from ' + elementsTable + ';', pgJson));
  if (allElements === null) return debugString('ERROR: NO ELEMENTS IN ELEMENTS TABLE');

  allElements.forEach(function (elData) {
    var el_id = elData.el_id;
    
    var motoH;

    if (getTag('motoTime_ID' + el_id)== null)
    {
      motoH = 0;
    }else{
      motoH = getTag('motoTime_ID' + el_id);
      
    }

    //debugString(motoH+"   "+el_id);
    var sqlText = 'update ' + elementsTable + ' set moto_time_h = ' + motoH + ' where el_id = ' + el_id;
    setSql(sqlText, pg);
    const needService = (elData.service_last_check + elData.service_interval - motoH) <= 0;
    setTag('vb_motohErr_ID' + el_id, needService); 
  });
})();
