// @ts-check

(function () {
  var pgJson = { dbgroup: '_postgres', outfmt: 'json' };
  var elementsTable = 'al3_elements';

  function checkBitState(reg, bit) {
    return (reg >> bit) & 1;
  }

  // Update element errors
  var allElements = JSON.parse(getSql('select * from ' + elementsTable + ';', pgJson));
  if (allElements === null) return debugString('ERROR: NO ELEMENTS IN ELEMENTS TABLE');

  allElements.forEach(function (elData) {
    var el_id = elData.el_id;
    var errorByte = getTag('errByte_ID' + el_id);
    setTag('vb_blockedByEstop_ID' + el_id, checkBitState(errorByte, 0) === 1); // Bloķēts ar E-stop sistēmu
    setTag('vb_mErr_ID' + el_id, checkBitState(errorByte, 1)); // Motora aizsardzības kļūda
    setTag('vb_contErr_ID' + el_id, checkBitState(errorByte, 2)); // Kontaktora kļūda
    setTag('vb_rotErr_ID' + el_id, checkBitState(errorByte, 3)); // Kustības kļūda
    setTag('vb_ovfErr_ID' + el_id, checkBitState(errorByte, 4)); // Pārplūdes membrāna
  });
})();
