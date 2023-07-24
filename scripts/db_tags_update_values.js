
(function () {
   var pgJson = { dbgroup: "_postgres", outfmt: "json" }, pg = { dbgroup: "_postgres" };

   var allDbTagRows = JSON.parse(getSql("select * from al_tags;", pgJson));
   if (allDbTagRows === null) return; // debugString("no data in 'al_tags' table!");

   allDbTagRows.forEach(function (dbTagRow) {
      var tagname = dbTagRow["tagname"];
      if (tagname === null || tagname === '') return debugString("no tagname inside 'al_tags' table!");

      var tagvalue = getTag(tagname);
      if (tagvalue == null || typeof tagvalue == 'undefined' || tagvalue == '') tagvalue = '';
      setSql("update al_tags set tagvalue='" + tagvalue + "' where tagname='" + tagname + "';", pg);
   });
})();