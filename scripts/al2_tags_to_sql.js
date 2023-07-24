
(function () {
   var pgJson = { dbgroup: '_postgres', outfmt: 'json' };
   var pg = { dbgroup: '_postgres' };
   var elementsTable = 'al2_elements';
   var routesTable = 'al2_routes';
   var attributesTable = 'al2_element_attrs';

   // Update elements
   var allElements = JSON.parse(getSql('select * from ' + elementsTable + ';', pgJson));
   if (allElements === null) return debugString('ERROR: NO ELEMENTS IN ELEMENTS TABLE');

   allElements.forEach(function (elData) {
      var el_id = elData.el_id;
      var stateID = getTag('state_ID' + el_id);
      var sqlText = 'update ' + elementsTable + ' set el_state = ' + stateID + ' where el_id = ' + el_id;
      setSql(sqlText, pg);
   });

   // Update attributes
   var allAttributes = JSON.parse(getSql('select * from ' + attributesTable + " where attr_name not like '\\_%';", pgJson));
   if (allAttributes === null) return debugString('ERROR: NO ATTRIBUTES IN ATTRIBUTES TABLE');

   allAttributes.forEach(function (attrData) {
      var attr_id = attrData.uid;
      var el_id = attrData.el_id;
      var attr_value = getTag('state_ID' + el_id + '_' + attrData.attr_name);
      var tag_vaule = attrData.tag_name ? getTag(attrData.tag_name) : null;
      if (attrData.tag_sets_attr === '1') {
         attr_value = tag_vaule;
      }
      
      var sqlText = 'update ' + attributesTable + ' set attr_value = ' + attr_value + '# where uid = ' + attr_id;
      
      setSql(sqlText.replace('#', attrData.tag_name ? ', tag_value = ' + tag_vaule : ''), pg);
   });
// update silos date 

   var silos_weight = JSON.parse(getSql('select * from silos',pgJson));
   if(silos_weight === null) return debugString('ERROR:NO SILOS IN SILOS TABLE');

   silos_weight.forEach(function (silo) {
      var silo_weight = silo.act_weight;
      var silo_id = silo.el_id;

      setTag('ID'+silo_id+'_LVL', silo_weight);
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

   // Update routes
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

         if (routeData.r_id !== r_id && routeData.r_state !== 0 && routeData.r_state !== 5) { // te par route name
            routeData.r_elements_arr.split(',').forEach(function (el_id) {
               blockingElements.push(parseInt(el_id));
            });
         }
         //debugString(r_name);
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

      return 'null';

   }


   var productReciving = JSON.parse(getSql('select * from silos_data where weight_2 IS NULL;', pgJson));
   var silos_nr = [];
   if (productReciving) {
      productReciving.forEach(function (silos) {
         silos_nr.push("CC6301_CLNR_S" + silos.silos_id);
      });
      //debugString(silos_nr);

      for (i = 0; i < silos_nr.length; i++) {
         var sqlText2 = 'update ' + routesTable + ' set r_can_be_started = true where r_name = \'' + silos_nr[i] + '\';';
         setSql(sqlText2, pg);
      }
   }

   var activeIs="";
   var activeRoute = JSON.parse(getSql('select * from ' + routesTable + ' where r_state != 0;', pgJson));
   if(activeRoute){
    activeRoute.forEach(function (RoteIsActive) {
   activeIs = RoteIsActive.r_name;
   });
   }  
   //debugString(activeIs);
   if(!activeIs){

   allRoutes.forEach(function (routeData) {
      var route_id = routeData.r_id;
      var route_state = getTag('routeState_' + route_id) || 0;
      var route_name = routeData.r_name;
      //   if (route_state==0) {
      var can_start = "true";
      var prepeared_orders = JSON.parse(getSql('select * from orders where route_name  = \'' + route_name + '\' and order_state IN (1, 2, 3) ;', pgJson));
      
      
         if (prepeared_orders && !activeRoute && activeIs =="" ) {
            var sqlText =
               'update ' +
               routesTable +
               ' set r_state = ' +
               route_state +
               ', r_can_be_started = ' +
               can_start +
               ' where r_id = ' +
               route_id;
            setSql(sqlText, pg);
         } else if (silos_nr.indexOf(route_name) !== -1) {
            var sqlText =
               'update ' +
               routesTable +
               ' set r_state = ' +
               route_state +
               ', r_can_be_started = ' +
               can_start +
               ' where r_id = ' +
               route_id;
            setSql(sqlText, pg);
         } else if (activeIs!="") {

            var sqlText =
               'update ' +
               routesTable +
               ' set r_state = ' +
               route_state +
               ', r_can_be_started = ' +
               route_can_be_started(route_id) +
               ' where r_name != ' +
               activeIs;
            setSql(sqlText, pg);
         }else {
            
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
         }
      
   });}else{
      allRoutes.forEach(function (routeData) {
         var route_id = routeData.r_id;
         var route_state = getTag('routeState_' + route_id) || 0;

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
   }
   // Update other tags
   var allTags = JSON.parse(getSql('select * from al2_tags;', pgJson));
   if (allTags === null) return debugString('ERROR: NO TAGS IN TAGS TABLE');

   allTags.forEach(function (tagData) {
      var tag_id = tagData.id;
      var tag_value = getTag(tagData.name);
      var sqlText = 'update al2_tags set value = ' + tag_value + ' where id = ' + tag_id;
      setSql(sqlText, pg);
   });
})();