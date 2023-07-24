var pgJson = { dbgroup: "_postgres", outfmt: "json" }, pg = { dbgroup: "_postgres" };

[1, 2].forEach(function (s_id) {
    if (s_id !== 1 && s_id !== 2) return debugString("UNKNOWN SAMPLER ID. CHECK THE ARRAY BEFORE FOREACH!");

    // таги сэмплера статус устройства (0 - выключен 1- берет пробы)
    if (s_id === 1) var samplerState = getTag('state_ID17');
    if (s_id === 2) var samplerState = getTag('state_ID30');

    // флаги для дэтекции фронта сигнала ( OFF->ON - вставить, ON->OFF - обновить )
    var samplerFlag = getTag('Sampler' + s_id + '_flag');

    /*
    * Если восходящий фронт то получаем ид активной парти и ид продукта и создаем запись в таблице семплера
    * Если внизсходящий фронт то получаем ид активной парти и ид продукта и обновляем запись в таблице семплера
    * Тожесамое для 2 семплера
    * Да, можно делать запрос таблицу парти 1 раз перед ифами, но тогда он будет каждый раз при вызове скрипта,
    * а это нам не надо.
    */
    // debugString(s_id + ": samplerState = " + samplerState + ", samplerFlag = " + samplerFlag);

    if (samplerState == 1 && samplerFlag != 1) {
        var partijaData = JSON.parse(getSql("SELECT id, product_id, partija_id FROM al_partija WHERE in_use = true;", pgJson));
        if (!partijaData) return debugString("no partija data! samplerState = (" + samplerState + "), samplerFlag = (" + samplerFlag + ")");

        var sqlString = "INSERT INTO al_sampler (sampler_id, p_id, partija_id, product_id) VALUES (" + s_id + "," + partijaData[0].id + ", '" + partijaData[0].partija_id + "'," + partijaData[0].product_id + ")";
        var set_sql = setSql(sqlString, pg);
        if (!set_sql) return debugString("can not launch setSql: " + sqlString);
        setTag('Sampler' + s_id + '_flag', true);

    } else if (samplerState == 0 && samplerFlag == 1) {
        var partijaData = JSON.parse(getSql("SELECT id, product_id FROM al_partija WHERE in_use = true;", pgJson));
        if (!partijaData) return debugString("no partija data! samplerState = (" + samplerState + "), samplerFlag = (" + samplerFlag + ")");

        var sqlString = 'UPDATE al_sampler SET stop_time = now() where sampler_id = ' + s_id + ' and stop_time isnull;';
        var set_sql = setSql(sqlString, pg);
        if (!set_sql) return debugString("can not launch setSql: " + sqlString);

        setTag('Sampler' + s_id + '_flag', false);
    }
});