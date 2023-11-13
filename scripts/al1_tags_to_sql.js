(function () {
   var pgJson = { dbgroup: '_postgres', outfmt: 'json' };
   var pg = { dbgroup: '_postgres' };
   var elementsTable = 'al1_elements';
   var routesTable = 'al1_routes';
   var attributesTable = 'al1_element_attrs';

   // Update elements
   var allElements = JSON.parse(getSql('select * from ' + elementsTable + ' order by el_id ASC ;', pgJson));
   if (allElements === null) return debugString('ERROR: NO ELEMENTS IN ELEMENTS TABLE');

var  VM6009_state; 
  var VM6010_state;

   allElements.forEach(function (elData) {
      var el_id = elData.el_id;
      //debugString(el_id);
      if(el_id === 2 ) VM6009_state = getTag('state_ID' + el_id);
      if(el_id === 3 ) VM6010_state = getTag('state_ID' + el_id);

      if(el_id === 46){
         //debugString(VM6009_state);
         //debugString(VM6010_state);

         if(VM6009_state === 1 && VM6010_state === 1 ){
            var stateID = 1;
            var sqlText = 'update ' + elementsTable + ' set el_state = ' + stateID + ' where el_id = ' + el_id;
            setSql(sqlText, pg);
         }else if(VM6009_state === 2 && VM6010_state === 1){
            var stateID = 2;
            var sqlText = 'update ' + elementsTable + ' set el_state = ' + stateID + ' where el_id = ' + el_id;
            setSql(sqlText, pg);
         }else if(VM6009_state === 1 && VM6010_state === 2){
            var stateID = 3;
            var sqlText = 'update ' + elementsTable + ' set el_state = ' + stateID + ' where el_id = ' + el_id;
            setSql(sqlText, pg);

         }else if(VM6009_state === 0 && VM6010_state === 0){
            var stateID = 0;
            var sqlText = 'update ' + elementsTable + ' set el_state = ' + stateID + ' where el_id = ' + el_id;
            setSql(sqlText, pg);
         }else if(VM6009_state === 5 || VM6010_state === 5){
            var stateID = 5;
            var sqlText = 'update ' + elementsTable + ' set el_state = ' + stateID + ' where el_id = ' + el_id;
            setSql(sqlText, pg);
         }


      }else {
      //debugString(el_id);
     // var stateID = getTag('state_ID' + el_id);
      var stateID = getTag('state_ID' + el_id);
      //var stateID = 3;
      //debugString(getTag('state_ID201'));
      //debugString(stateID);
      var sqlText = 'update ' + elementsTable + ' set el_state = ' + stateID + ' where el_id = ' + el_id;
      setSql(sqlText, pg);
      }
      
   });
/////// Līdz šejienei viss bumbās ///////

   // Update attributes
   var allAttributes = JSON.parse(getSql('select * from ' + attributesTable + " where attr_name not like '\\_%';", pgJson));
   if (allAttributes === null) return debugString('ERROR: NO ATTRIBUTES IN ATTRIBUTES TABLE');

   allAttributes.forEach(function (attrData) {

      //debugString(attrData.uid);
      var attr_id = attrData.uid;
      var el_id = attrData.el_id;
      var attr_value = Number(getTag('state_ID' + el_id + '_' + attrData.attr_name));
      var tag_vaule = attrData.tag_name ? getTag(attrData.tag_name) : null;

      
      if (attrData.tag_sets_attr === '1') {
         attr_value = tag_vaule;
      }
      var sqlText = 'update ' + attributesTable + ' set attr_value = ' + attr_value + '# where uid = ' + attr_id;
      setSql(sqlText.replace('#', attrData.tag_name ? ', tag_value = ' + tag_vaule : ''), pg);
   });

   
   // Update settings
   var allSettings = JSON.parse(getSql('select * from ' + attributesTable + " where attr_name like '\\_%';", pgJson));
   if (allSettings === null) return debugString('ERROR: NO SETTINGS IN ATTRIBUTES TABLE');

   allSettings.forEach(function (attrData) {
      var attr_id = attrData.uid;
      var el_id = attrData.el_id;
      var tag_name = attrData.attr_name.substring(1) + '_ID';
      var attr_value = getTag(tag_name + el_id);
      var sqlText = 'update ' + attributesTable + ' set attr_value = ' + attr_value + ' where uid = ' + attr_id;
      setSql(sqlText, pg);
   });


   //debugString("Veiksmīgi");
   //Update routes
   var allRoutes = JSON.parse(getSql('select * from ' + routesTable + ' where r_is_used = true order by r_id asc;', pgJson));
   if (allRoutes === null) return debugString('ERROR: NO ROUTES IN ROUTES TABLE');

   function route_can_be_started(r_id) {
      var blockingElements = [];
      allElements.forEach(function (elData) {
         if (elData.el_state === 5) {
            blockingElements.push(elData.el_id);
         }
      });
      var route = null;
      allRoutes.forEach(function (routeData) {
         if (routeData.r_id !== r_id && routeData.r_state !== 0 && routeData.r_state !== 5) {
            routeData.r_elements_arr.split(',').forEach(function (el_id) {
               blockingElements.push(parseInt(el_id));
            });
         }
         if (routeData.r_id === r_id) {
            route = routeData;
         }
      });
      var routeElements = route.r_elements_arr.split(',');
      for (var i = 0; i < routeElements.length; i++) {
         for (var j = 0; j < blockingElements.length; j++) {
            if (parseInt(routeElements[i]) === blockingElements[j]) {
              return 'null';
            }
         }
      }
      return 'true';
   }

   allRoutes.forEach(function (routeData) {
     var route_id = routeData.r_id;
     //debugString(route_id);
     var route_state = getTag('P1_routeState_' + route_id) || 0;
     var sqlText =
       'update ' +
       routesTable +
       ' set r_state = ' +
       route_state +
       ', r_can_be_started = ' +
       route_can_be_started(route_id) +
       ' where r_id = ' +
       route_id;
     setSql(sqlText, pg);
   });

   // Update other tags
   var allTags = JSON.parse(getSql('select * from al1_tags;', pgJson));
   if (allTags === null) return debugString('ERROR: NO TAGS IN TAGS TABLE');

   allTags.forEach(function (tagData) {
      var tag_id = tagData.id;
      var tag_value = getTag(tagData.name);
      var sqlText = 'update al1_tags set value = ' + tag_value + ' where id = ' + tag_id;
      setSql(sqlText, pg);
   });
})();