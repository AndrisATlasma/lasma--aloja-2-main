const db_setting = { outfmt: 'json', dbgroup: '_postgres' };

var th = ["<tr><th>Svēršanas laiks</th><th>Pavadzīmes Nr.</th><th>Piegādātājs</th><th>Produkts</th><th>Pilns svars [kg]</th><th>Auto svars [kg]</th><th>Kravas svars [kg]</th></tr>"];

var export_th = ["Svēršanas laiks", "Pavadzīmes Nr.", "Piegādātājs", "Produkt", "Pilns svars [kg]", "Auto svars [kg]", "Kravas svars [kg]"];
var export_arry = [];
var export_arry_full = [];

function silo_list() {
    return new Promise(resolve => {
        runSql('select_all_silo', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};

function silo_report(param) {

    return new Promise(resolve => {
        runSql('silo_report', param, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};

function createOption(value, text, selected = false) {
    const option = document.createElement("option");
    option.value = value;
    option.text = text;
    option.selected = selected;
    return option;
}

function addOptions(selectElement, options) {
    options.forEach(option => {
        selectElement.add(option);
    });
}

function toLocalIsotime(convertTime) {
    var newDate = new Date(convertTime);
    var timezoneOffset = -newDate.getTimezoneOffset() / 60;
    newDate.setHours(newDate.getHours() + timezoneOffset);
    var localDateTime = newDate.toISOString().slice(0, 19).replace('T', ' ');
    return localDateTime;
}

document.addEventListener("DOMContentLoaded", function () {
    OnloadPage();

    var data_request = document.getElementById('run_request');
    data_request.addEventListener('click', async function () {
        var date = new Date();
        var dateString = date.toISOString().substring(0, 10);
        export_arry_full = [];
        var promt_arry = ["Aloja pieņemšana uz silo:", "", ""];
        var empty_arry = [];

        document.getElementsByTagName("thead")[0].innerHTML = "";
        document.getElementsByTagName("tbody")[0].innerHTML = "";

        var time_from = toLocalIsotime(document.getElementById('datepicker_from').value);
        var time_till = toLocalIsotime(document.getElementById('datepicker_to').value);
        var silos = document.getElementById("silo_list").value;
        var silostext = document.getElementById("silo_list").selectedOptions[0].textContent;

        var param = {
            time_from: time_from,
            time_till: time_till,
            silo: silos
        }

        promt_arry.push(silostext, "", "datums", dateString);
        var silo_report_data = await silo_report(param)
        var temp_arry = [];
        var ValueArray = "";
        export_arry_full.push(promt_arry, empty_arry, export_th);

        for (key in silo_report_data) {
            var tableValue = Object.values(silo_report_data[key]);
            export_arry = [];
            for (i = 0; i < tableValue.length; i++) {
                export_arry.push(tableValue[i]);
            }
            export_arry_full.push(export_arry);
            ValueArray += "<tr><td>" + silo_report_data[key].laiks + "</td><td>" + silo_report_data[key].invoice + "</td><td>" + silo_report_data[key].supplier + "</td><td>" + silo_report_data[key].label + "</td><td>" + silo_report_data[key].full_weight + "</td><td>" + silo_report_data[key].truck_weight + "</td><td>" + silo_report_data[key].load_weight + "</td></tr>";
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

        ws['!merges'] = [{ s: { c: 0, r: 0 }, e: { c: 2, r: 0 } }];

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
        customSaveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `Aloja_silos_${dateString}.xlsx`);
    }
});
async function OnloadPage() {
    const silos_select = document.getElementById('silo_list');
    silos_select.innerHTML = "";
    var silos = await silo_list();
    addOptions(silos_select, silos.map(silos => createOption(silos.u_id, silos.label, selected = false)));
}

