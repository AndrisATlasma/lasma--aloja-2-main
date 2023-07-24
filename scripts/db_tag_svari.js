/*
Таги для системы

Modbus:
    1) SV1_ActWeight - real32  - Вес из весов в реально времени
    2) SV1_Comand - uint16 - Регистр управления весами

ProfiNet:
    1) SV1_WeghtDone - bool - Флаг говорит о том что установленый вес достигнут и дозатор надо вырубить
    2) ElIdx_State - int8 - Состояние элемента
    3) SV1_NeedSetZero - bool - Флаг говорит о том установлен новый мешок и надо сбросить весы
    4) SV1_ZeroDone - bool - Флаг говорит о том что весы сброшены и можно работать
    4) SV1_Enable - bool - Флаг говорит о том что есть активная партия и весам разрешено работать
    5) SV1_SpeedDown - flag po kotoromu nuzno sbrosit skorost

Virtual:
   
    2) SV1_SpeedDownWeight - real32 - Значение весов после которого надо уменьшить скорость дозатора
    3) SV1_FiltredWeight - real32 - Значение весов после фильтрации
    4) SV1_SetWeight - real32 - Желаемое значение веса
    5) SV1_SaveDataNow - bool - Тригер для сохранения веса если партия закончилась но мешок не полный
 */

var pgJson = { dbgroup: "_postgres", outfmt: "json" }, pg = { dbgroup: "_postgres" };


var partijaInUseData = JSON.parse(getSql("select * from al_partija where in_use = true;", pgJson));
// if (partijaInUseData) {
//     setTag("SV1_Enable", true);
//     setTag("SV2_Enable", true);
// } else {
//     setTag("SV1_Enable", false);
//     setTag("SV2_Enable", false);
// }


[1, 2].forEach(function (svID) {
    var SVx = "SV" + svID;

    var newWeight = getTag(SVx + "_ActWeight");
    var oldFiltredWeight = getTag(SVx + "_FiltredWeight");
    // if (svID === 1) var dozStatus = getTag("state_ID30"); // !!!!! ERR SM6031 ID30
    // if (svID === 2) var dozStatus = getTag("state_ID17"); // !!!!! ERR SM6031 ID30

    var k = 0.7; //0-1
    var filtredValue = Number((oldFiltredWeight + (newWeight - oldFiltredWeight) * k).toFixed(1))
    setTag(SVx + "_FiltredWeight", filtredValue);

    var hist = 0.5; //kg
    var speedDownWeight = getTag(SVx + "_SpeedDownWeight");
    var setWeight = getTag(SVx + "_SetWeight");
    // если превысили лимит по весу, то снижаем скорость наполнения
    // врубаем нормальную скорость когда вес ниже лимита
    if (filtredValue > speedDownWeight) setTag(SVx + "_SpeedDown", true);
    if (filtredValue < speedDownWeight - hist) setTag(SVx + "_SpeedDown", false);
    // Останавливаем наполнение включаем индикацию в ПЛК
    var saveDataNow = getTag(SVx + "_SaveDataNow");
    var weightDone = getTag(SVx + "_WeghtDone");
    if ((filtredValue > setWeight + 0.001 || saveDataNow) && !weightDone) {
        setTag(SVx + "_WeghtDone", true);
        setTag(SVx + "_SaveDataNow", false);
        // ?
        setTag("isWeightRecordAllowed_" + svID, true); // allowing new database record
        // debugString("S")
    }
    // когда загрузка выполнена ждем остановки дозатора и тогдапишем в базу текущий вес мешка
    (function () {
        if (!weightDone || !partijaInUseData) return;

        var product_id = partijaInUseData[0]["product_id"];
        var partija_id = partijaInUseData[0]["partija_id"];
        var p_id = partijaInUseData[0]["id"];

        var isWeightRecordAllowed = getTag("isWeightRecordAllowed_" + svID);
        if (isWeightRecordAllowed) { // preventing multiple similar database records
            var sqlText = "insert into al_weight" + svID + " (partija_id, product_id, weight, p_id) values ('" + partija_id + "'," + product_id + "," + filtredValue + "," + p_id + ");";
            var ssq = setSql(sqlText, pg);
            debugString("about to write a setSql for svID " + svID + " !");
            if (!ssq) return debugString("Failed SQL: " + sqlText);

            setTag("isWeightRecordAllowed_" + svID, false); // preventing multiple similar database records
        }
    })();
    // Обнуление весов
    var needSetZero = getTag(SVx + "_newDataLog");
    if (needSetZero && !getTag(SVx + "_ZeroDone")) {
        setTag(SVx + "_Comand", 2);
       // debugString(SVx + "_Comand  set to 2")
    }
    if (needSetZero && newWeight == 0) setTag(SVx + "_ZeroDone", true);
});