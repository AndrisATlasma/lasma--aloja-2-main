var pgJson = { dbgroup: "_postgres", outfmt: "json" }, pg = { dbgroup: "_postgres" };
(function(){
if (getTag('P3_routeState_0')  == 0 || getTag('P3_routeState_0') == null) return;
debugString("Whrite WF data");
var state_ID201_A = getTag('state_ID201_A');
var state_ID201_FR = getTag('state_ID201_FR');
var state_ID202_A = getTag('state_ID202_A');
var state_ID202_FR = getTag('state_ID202_FR');
var state_ID203_A = getTag('state_ID203_A');
var state_ID203_FR = getTag('state_ID203_FR');
var state_ID204_A = getTag('state_ID204_A');
var state_ID204_FR = getTag('state_ID204_FR');
var state_ID205_A = getTag('state_ID205_A');
var state_ID205_FR = getTag('state_ID205_FR');
var state_ID206_A = getTag('state_ID206_A');
var state_ID206_FR = getTag('state_ID206_FR');
var state_ID211_A = getTag('state_ID211_A');
var state_ID211_FR = getTag('state_ID211_FR');

var PS6138_P = getTag('PS6138_P'); // pressures id203
var PS6139_P = getTag('PS6139_P');// pressures id206
var PS6140_P = getTag('PS6140_P');// pressures id219
var DP6171_P = getTag('DP6171_P');// pressures id214
var PS6141_P = getTag('PS6141_P');// pressures id211

var Weight_ID215 = getTag('Weight_ID215');
var WeightMinute_ID215 = getTag('WeightMinute_ID215');
var Weight_ID216 = getTag('Weight_ID216');
var WeightMinute_ID216 = getTag('WeightMinute_ID216');


var sqlText = "INSERT INTO wf_data_elements"+
"(time_stmp, id201_a, id201_fr, id202_a, id202_fr, id203_a, id203_fr, id204_a, id204_fr, id205_a, id205_fr, id206_a, id206_fr, id211_a, id211_fr, id203_presure, id206_presure, id219_presure, id214_presure, id211_presure, id215_weight, id215_weight_h, id216_weight, id216_weight_h)"+
"VALUES(now(), "+state_ID201_A+", "+state_ID201_FR+", "+state_ID202_A+", "+state_ID202_FR+", "+state_ID203_A+", "+state_ID203_FR+", "+state_ID204_A+", "+state_ID204_FR+", "+state_ID205_A+", "+state_ID205_FR+", "+state_ID206_A+", "+state_ID206_FR+", "+state_ID211_A+", "+state_ID211_FR+", "+PS6138_P+", "+PS6139_P+", "+PS6140_P+", "+DP6171_P+", "+PS6141_P+", "+Weight_ID215+", "+WeightMinute_ID215+", "+Weight_ID216+", "+WeightMinute_ID216+");"

var ssq = setSql(sqlText, pg);
if (!ssq) return debugString("Failed SQL: " + sqlText);
})();