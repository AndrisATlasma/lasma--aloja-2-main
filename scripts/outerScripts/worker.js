// worker.js
importScripts('system/scripts/igrX2.js');
function finish_route(params) {
    return new Promise(resolve => {
        runSql('finish_order', params, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info('Finish order failed');
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function getUsedKwh(orderStartTime, orderEndTime) {
    return new Promise(resolve => {
        runSql('calculate_used_kwh', { orderStartTime, orderEndTime }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info('Calculate used kWh failed');
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}
self.addEventListener('message', function (e) {
    console.log('Web Worker received data:', e.data);

    const orderStartTime = e.data.orderStartTime;
    const timeNow = e.data.timeNow;
    const order_id = e.data.order_id;

    async function fetchAndProcessData(orderStartTime, timeNow, order_id) {
        var Par1_used_kWh = await getUsedKwh(orderStartTime, timeNow);

        console.log('Used kWh data:', Par1_used_kWh);

        var params = {
            time: timeNow,
            u_id: order_id,
            state: 4,
            part1_kwh: Par1_used_kWh[0].par1_useage,
            part2_kwh: Par1_used_kWh[0].par2_useage,
            part3_kwh: Par1_used_kWh[0].par3_useage,
            part1_work_h: 1,
            part2_work_h: 2,
            part3_work_h: 3,
        };

        const result = await finish_route(params);

        console.log('Finish route result:', result);

        // Atgriež rezultātu galvenajam pavedienam
        self.postMessage(result);
    }

    // Izmantojot funkciju
    fetchAndProcessData(orderStartTime, timeNow, order_id);
});
