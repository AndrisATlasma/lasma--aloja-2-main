/*
Скрипт выполняется раз в час и пишет потребление в базу

INSERT INTO public.al_kwh (log_st, kwh) VALUES(CURRENT_TIMESTAMP, 0);

*/
(function logKWH() {
    var kwh = getTag('KWH');
    if (kwh == null) return debugString('KVH - No valid data. KWH = (' + kwh + ')');

    var sqlString = 'INSERT INTO al_kwh (kwh) VALUES(' + kwh.toFixed(0) + ');';
    var set_sql = setSql(sqlString, { dbgroup: "_postgres" });
    debugString('KWH - ' + set_sql);
})();

/* INSERT INTO public.work_time
(log_st, main_counter, uzlade_izlade, priekstirisana, lobisana)
VALUES(CURRENT_TIMESTAMP, 0, 0, 0, 0);
*/
(function logWorkTime() {
    /* !!! WE GET MINUTES - NOT HOURS !!! */
    var G1 = getTag('WorkTimeGroup_1'), G2 = getTag('WorkTimeGroup_2'), G3 = getTag('WorkTimeGroup_3'); // [min]
    if (G1 == null || G2 == null || G3 == null) return debugString('Time - No valid data. G1 = (' + G1 + '), G2 = (' + G2 + '), G3 = (' + G3 + ')');

    var sqlString = 'INSERT INTO al_worktime (uzlade_izlade, priekstirisana, lobisana) VALUES( ' + G1.toFixed(0) + ', ' + G2.toFixed(0) + ',' + G3.toFixed(0) + ');';
    var set_sql = setSql(sqlString, { dbgroup: "_postgres" });
    debugString('Time - ' + set_sql);
})();