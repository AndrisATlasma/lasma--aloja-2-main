const db_setting = { outfmt: 'json', dbgroup: '_postgres' };

var th = ["<tr><th>Sākuma laiks</th><th>Beigu laiks</th><th>Produkts</th><th>Uzdevums</th><th>Ieejas svars [kg]</th><th>Ražošanas atbiras [kg]</th><th>Lobīšanas atbiras [kg]</th><th>Ciete [kg]</th><th>Proteīns [kg]</th><th>Zudumi [%]</th><th>Weifang [kw/h]</th><th>Weifang [h]</th><th>Lobīšana [kw/h]</th><th>Lobīšana [h]</th></tr>"];

var export_th = ["Sākuma laiks", "Beigu laiks", "Produkts","Uzdevums","Ieejas svars [kg]","Ražošanas atbiras [kg]","Lobīšanas atbiras [kg]","Ciete [kg]","Proteīns [kg]","Filtra proteīns [kg]","Zudumi [%]","Weifang [kw/h]","Weifang [h]","Lobīšana [kw/h]","Lobīšana [h]"];
var export_arry = [];
var export_arry_full = [];

function order_report_1(param) {

    return new Promise(resolve => {
        runSql('order_report', param, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function order_report_2(param) {
    return new Promise(resolve => {
        runSql('order_report_1', param, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};

function toLocalIsotime(convertTime) {
    var newDate = new Date(convertTime);
    var timezoneOffset = -newDate.getTimezoneOffset() / 60;
    newDate.setHours(newDate.getHours() + timezoneOffset);
    var localDateTime = newDate.toISOString().slice(0, 19).replace('T', ' ');
    return localDateTime;
}

document.addEventListener("DOMContentLoaded", function () {

    var data_request = document.getElementById('run_request');
    data_request.addEventListener('click', async function () {
        var date = new Date();
        var dateString = date.toISOString().substring(0, 10);
        export_arry_full = [];
        var promt_arry = ["Aloja uzdevumi", `datums: ${dateString}`];
        var empty_arry = [];

        document.getElementsByTagName("thead")[0].innerHTML = "";
        document.getElementsByTagName("tbody")[0].innerHTML = "";

        var time_from = toLocalIsotime(document.getElementById('datepicker_from').value);
        var time_till = toLocalIsotime(document.getElementById('datepicker_to').value);

        var param = {
            time_from: time_from,
            time_till: time_till,
        }

        var order_data_1 = await order_report_1(param)
       
        var temp_arry = [];
        var ValueArray = "";
        export_arry_full.push(promt_arry, empty_arry, export_th);


        var temp_arry2 = [];
        for (key in order_data_1) {
            export_arry = [];
            temp_arry2 = [];

            var params = {
                order_id: order_data_1[key].order_id
            }
            var total = 0;
            //console.time("Report");
            var scales_order_data = await order_report_2(params);
            //console.timeEnd("Report");
            console.log(scales_order_data); // atgriež katra svaru datus
            var tableValue = Object.values(order_data_1[key]);
            for (i = 0; i < tableValue.length; i++) {
                export_arry.push(tableValue[i]);

            }

            temp_arry2.push(order_data_1[key].start_tmst,
                order_data_1[key].end_tmst,
                order_data_1[key].product,
                order_data_1[key].order_lable,
                order_data_1[key].part3_kwh,
                order_data_1[key].part3_work_h,
                order_data_1[key].part1_kwh,
                order_data_1[key].part1_work_h
            );

            total = scales_order_data[0].total_weight + scales_order_data[2].total_weight + scales_order_data[3].total_weight + scales_order_data[4].total_weight;// + scales_order_data[5].total_weight;            
           
            console.log(total);
            var zudums =  ((total / (scales_order_data[1].total_weight / 100)));
            var zudums2 = 100 - zudums;

            temp_arry2.splice(4, 0, scales_order_data[1].total_weight,
                scales_order_data[4].total_weight,
                scales_order_data[3].total_weight,
                scales_order_data[0].total_weight,
                scales_order_data[2].total_weight,
               // scales_order_data[5].total_weight,
                zudums2.toFixed(1));



            ValueArray += "<tr>"
            for (i = 0; i < temp_arry2.length; i++) {
                ValueArray += "<td>" + temp_arry2[i] + "</td>";
            }
            ValueArray += "</tr>"
            export_arry_full.push(temp_arry2);
        }

        temp_arry += ValueArray;
        document.getElementsByTagName("thead")[0].innerHTML = th;
        document.getElementsByTagName("tbody")[0].innerHTML += temp_arry;
        var saveExcelBtn = document.getElementById('saveExcel');
        saveExcelBtn.style.display = 'block';

        saveExcelBtn.addEventListener('click', function () {
             saveExcel();
        });
    });

    function saveExcel() {
        var date = new Date();
        var dateString = date.toISOString().substring(0, 10);

        var wb = XLSX.utils.book_new();
        wb.SheetNames.push("Sheet 1");
        var ws_data = export_arry_full;
        var ws = XLSX.utils.aoa_to_sheet(ws_data);

        ws['!merges'] = [{ s: { c: 1, r: 0 }, e: { c: 2, r: 0 } }];

        // Iterē caur visām kolonnām un pielāgo šūnu platumu
        Object.keys(ws).forEach(function (key) {
            if (key.startsWith('!')) return; // Izmēģinājuma vai citu īpašo rindu/šūnu ignorēšana

            var columnIndex = XLSX.utils.decode_col(key);

            var cellText = ws[key].w || '';
            var textLength = cellText.length;
            var currentColumnWidth = ws['!cols'] && ws['!cols'][columnIndex] && ws['!cols'][columnIndex].w || 0;

            if (textLength > currentColumnWidth) {
                if (!ws['!cols']) ws['!cols'] = [];
                ws['!cols'][columnIndex] = { wch: textLength }; // Iestata kolonnas platumu
            }
        });

        wb.Sheets["Sheet 1"] = ws;

        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        customSaveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `Aloja_uzdevumi_${dateString}.xlsx`);
    }
});

