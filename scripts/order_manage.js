

(function(){
   // order states 1- New, 2 - Active, 3 - Paused, 4 - Finished, 5 - Canceled
   // scales state 1- error, 2- ready, 3 - inWork, 4 - stoped

   var pgJson = { dbgroup: '_postgres', outfmt: 'json' };
   var pg = { dbgroup: '_postgres' };

   const ORDER_STATE = {
      New:1,
      Active:2,
      Paused:3,
      Finished:4,
      Canceled:5
   };
   const SCALE_STATE = {
      Error:6,
      Ready:1,
      inWork:2,
      Stoped:4
   };

   const BAG_state = {
      Empty:0,
      Full:1
   }

   const SCALES_COMAND = {
      SaveDone:1,
      SetZero:2
   }

   var orderTable = 'orders';
   var scaleTable = 'scales';
   var orderStateTable = 'order_states';
   var bagInfoTable = 'bag_info';

   var OrderData = JSON.parse(getSql('select * from ' + orderTable + ' ;', pgJson));
   if(!OrderData) return;
   OrderData.forEach(function (orData){      

      if(orData.order_state == ORDER_STATE.Active ){
         debugString("Ir uzdevums");
         var scalesData = JSON.parse(getSql('select * from ' + scaleTable + ' where deleted = false;', pgJson));

            scalesData.forEach(function(scData){

                //if(getTag('state_ID'+scData.tag_id) == SCALE_STATE.inWork){
                  

                  if (getTag('Bgs_ST_ID'+scData.tag_id) == BAG_state.Full && getTag('IsFUll_ID'+scData.tag_id)!=true ){
                     debugString('Maiss ir pilns - stopējam');

                      

                     var currentWeight = getTag('Weight_ID'+scData.tag_id)                     

                     var sqlText = 'insert INTO ' + bagInfoTable + ' (weight,order_id,scales_id) values('+currentWeight+','+orData.u_id+','+scData.u_id+');'
                  
                     setTag('SaveToDb_ID'+scData.tag_id, SCALES_COMAND.SaveDone ) //  Nododam vajadzīgo komandu ( 1 ) apturēt svaru darbību
                     //setSql(sqlText, pg)
                     var recorState = setSql(sqlText, pg);
                     if(!recorState) return debugString("Svaru: " + scData.name + " svars netika saglabāds Datubāzē.");
                     
                     setTag('Bgs_ST_ID'+scData.tag_id, BAG_state.Empty); // Nododam vajadzīgo komandu ( 0 ) apturēt ieraksta veidošanu DB
                     setTag('IsFUll_ID'+scData.tag_id, true);


                  }

                  if (getTag('Bgs_ST_ID'+scData.tag_id) == BAG_state.Empty && getTag('IsFUll_ID'+scData.tag_id)==true )  setTag('IsFUll_ID'+scData.tag_id, false);
                 // }
            })
      }

      
   });
})();


