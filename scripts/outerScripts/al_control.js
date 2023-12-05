let loadingInfo = Swal.mixin({
    customClass: {
        container: 'custom-container-class',
        popup: 'custom-popup-class',
    },
});

function BanerMessage() {
    loadingInfo.fire({
        imageUrl: "images/loading.gif",
        imageHeight: 50,
        allowOutsideClick: false,
        title: 'Notiek datu saglabāšana',
        text: 'Paziņojums aizvēsrsies automātiski',
        showConfirmButton: false,
        timer: 2000
    })
}
let timeout; // definējam timeout mainīgo ārpus funkcijas

const observer = new IntersectionObserver(async function (entries) {
    const isVisible = entries[0].isIntersecting;

    if (isVisible) {
        console.log('Esmu redzams');

        // Pārtraucam esošo timeout, ja tāds eksistē
        if (timeout) {
            clearTimeout(timeout);
        }

        // Iestatām jaunu timeout ar nepieciešamo atkārtošanos
        timeout = setTimeout(function repeat() {
            scaleWork();
            //doSomething();
            timeout = setTimeout(repeat, 500);
        }, 500);
    } else {
        // Notīram timeout, ja elements kļuvis neredzams
        clearTimeout(timeout);
    }
});

const targetElement = document.querySelector('#prieksLobTable');
observer.observe(targetElement);

////////////////////////////////////////////////////////////////////
// order states 1- New, 2 - Active, 3 - Paused, 4 - Finished, 5 - Canceled

const ROUTE_STATUS_TEXT = ['------', 'Notiek palaišana', 'Palaists', 'Notiek apstādināšana', 'Pauzēts', 'Kļūda', 'Bloķēts'];

const ORDER_STATE = {
    New: 1,
    Active: 2,
    Paused: 3,
    Finished: 4,
    Canceled: 5
};
const ROUTE_COMAND = {
    start: 1,
    stop: 2
};

const SCALES_COMAND = {
    SaveDone: 1,
    SetZero: 2
};

const COUENTER_COMAND = {
    stop: 0,
    start: 1,
    reset: 2
};

const ORDER_TEXT = ['', 'Jauns', 'Notiek darbs', 'Pauzēts', 'Pabeigts', 'Atcelts'];
const ORDER_TEXT_color = ['', '', '#58f4ff', '#f1ff2b'];

function routeBtnState() {

    return new Promise(resolve => {
        runSql('get_route_state_for_btn', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function getkWhLogTable(Part_kWh) {
    return new Promise(resolve => {
        runSql('get_log_table_for_kwh', { Part_kWh }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
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
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function clearBunker(order_id) {

    return new Promise(resolve => {
        runSql('clear_bunker', { order_id }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function get_silos_id(order_id) {
    return new Promise(resolve => {
        runSql('get_silo_from_orders', { order_id }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}
function calculateSiloProduct(wightData) {
    console.log(wightData);

    return new Promise(resolve => {
        runSql('calculate_silos_product', wightData, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function routeCanBeStarted() {

    return new Promise(resolve => {
        runSql('check_rote_to_start', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function resumeOrder(order_id) {
    return new Promise(resolve => {
        runSql('resume_order', { order_id }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function orderStatus(order_id) {
    return new Promise(resolve => {
        runSql('is_order_paused', { order_id }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}
function ProtainOrderData() {
    return new Promise(resolve => {
        runSql('Protein_order_data', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function getOrders() {
    return new Promise(resolve => {
        runSql('Get_orders_for_bunkers', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                //console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function getRouteId(rout_name) {
    return new Promise(resolve => {
        runSql('Get_rote_id', { rout_name }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function start_route(time, u_id, state) {
    var params = {
        time: time,
        u_id: u_id,
        state: state
    };

    return new Promise(resolve => {
        runSql('update_order', params, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function finish_route(params) {
    return new Promise(resolve => {
        runSql('finish_order', params, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function SaveToBagInfo(params) {
    return new Promise(resolve => {
        runSql('save_bag_data', params, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function getScalesData() {
    return new Promise(resolve => {
        runSql('get_all_scales', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function getOrderProduct(order_id) {
    return new Promise(resolve => {
        runSql('get_product_from_orders', { order_id }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}

function bag_weight(o_id) {
    return new Promise(resolve => {
        runSql('calculate_order_weight', { o_id }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
}
//********************************************* */
function getNow() {
    var now = new Date();
    var year = now.getFullYear();
    var month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mēneši sākas no 0
    var date = now.getDate().toString().padStart(2, '0');
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}
var pogasStatuss = {
    in_use: "red",
    can_use: "green",
    paused: "yellow"
};

//**************************************************************** */
//scaleWork();
var svgUpdateActive = 0;
var buttonElements = document.getElementById('T1_control_in_use');
var computedStyle = getComputedStyle(buttonElements);
var btn_backgroundColor = computedStyle.backgroundColor;
var btn_textContent = buttonElements.textContent;
var orders_to_bunkers;
var orderStartTime;
var isFunctionRunning = false;
var ScalesData;
var bu1_route_ctrl = document.getElementById('bu1_btn');
var bu2_route_ctrl = document.getElementById('bu2_btn');

async function scaleWork() {
    console.time("CIKLA_DARBS");
    //************************SVARU DARBĪBA ************** */

    ScalesData.forEach(function (scales) {
        var title = document.getElementById('ID' + scales.tag_id + '_title');
        title.innerHTML = scales.name;
        var bagStatus = document.getElementById('ID' + scales.tag_id + '_bag');
        if (bagStatus) {
            var bagCurentState = getTag('Bgs_ST_ID' + scales.tag_id);
            var textBG = document.getElementById('ID' + scales.tag_id + '_bag_bg');
            var kg = document.getElementById('ID' + scales.tag_id + '_weight');
            var kgInMin = document.getElementById('ID' + scales.tag_id + '_weight_min'); // id="ID43_ScaleSaveBtn"
            var scaleSaveBtn = document.getElementById('ID' + scales.tag_id + '_ScaleSaveBtn');
            scaleSaveBtn.setAttribute('data-scale_tag_id', scales.tag_id);
            scaleSaveBtn.setAttribute('data-scale_id', scales.u_id);
            var ZeroBtn = document.getElementById('ID' + scales.tag_id + '_ZeroSaveBtn');
            ZeroBtn.setAttribute('data-scale_tag_id', scales.tag_id);

            if (bagCurentState == 1) {
                bagStatus.innerHTML = 'MAISS IR PILNS';
                textBG.style.background = 'red';
            } else {
                bagStatus.innerHTML = 'UZPILDE';
                textBG.style.background = 'green';
            }
            kg.innerHTML = getTag('Weight_ID' + scales.tag_id) ? getTag('Weight_ID' + scales.tag_id) : '0';

            kgInMin.innerHTML = getTag('WeightMinute_ID' + scales.tag_id) ? getTag('WeightMinute_ID' + scales.tag_id) : '0';

            var targetWeight = document.getElementById('SetWeight_ID' + scales.tag_id);
            if (targetWeight) {
                targetWeight.innerHTML = getTag('SetWeight_ID' + scales.tag_id) ? getTag('SetWeight_ID' + scales.tag_id) : '0';
            }
        }
    });    
    
    // SVARU DARBĪBAS APSTRĀDE AIZŅEM AP 600ms .......
    //****************************************************** */
    //console.time("BBB");
    orders_to_bunkers = await getOrders();
    //console.timeEnd("BBB");

    var bunkurs_1 = document.getElementById("T1_partija");
    var bu1_Part_Nr = document.getElementById("T1_PartijasNumurs");
    var bu2_Part_Nr = document.getElementById("T2_PartijasNumurs");
    var bu1_product = document.getElementById("T1_Produkts");
    var bu2_product = document.getElementById("T2_Produkts");
    var bu1_level = document.getElementById("BU1_LVL");
    var bu2_level = document.getElementById("BU2_LVL");

    var bunkurs_2 = document.getElementById("T2_partija");
    var bu_1_btn = document.getElementById("T1_control_in_use");
    var bu_2_btn = document.getElementById("T2_control_in_use");

    var order_state_text = document.getElementById("order_state_text");
    var T_no_BU1 = document.querySelectorAll('[id^="bu1_"]');
    var T_no_BU2 = document.querySelectorAll('[id^="bu2_"]');

    var T_no_BU1_btn_on = document.getElementById('bu1_on');
    var T_no_BU1_btn_text = document.getElementById('bu1_text');
    var T_no_BU2_btn_on = document.getElementById('bu2_on');
    var T_no_BU2_btn_text = document.getElementById('bu2_text');

    var weifangBtns = document.querySelectorAll('[id^="weifang"]');
    var wifang_bt_on = document.getElementById('weifang_on');
    var wifang_bt_text = document.getElementById('weifan_text');
    var lobisana = document.querySelectorAll('[id$="Priekstirisana"]');
    var lobisana_btn_on = document.getElementById('startPriekstirisana');
    var lobisana_text_status = document.getElementById('lobisana_text');

    var bu1_levels = getTag('BU1_LVL') ? getTag('BU1_LVL') : 0;
    var bu2_levels = getTag('BU2_LVL') ? getTag('BU2_LVL') : 0;

    bu1_level.textContent = bu1_levels.toFixed(0);
    bu2_level.textContent = bu2_levels.toFixed(0);
    //console.time("AAA");
    var route_btn_status = await routeBtnState();
    //console.timeEnd("AAA");
    route_btn_status.forEach(function (element) {
        if (element.r_name == 'darbs no Bunkura1') {
            if (element.r_state != 0) {
                T_no_BU1_btn_on.classList.add('lobisana_work');
                T_no_BU1_btn_text.textContent = ROUTE_STATUS_TEXT[element.r_state];

            } else {
                T_no_BU1_btn_on.classList.remove('lobisana_work');
                T_no_BU1_btn_text.textContent = ROUTE_STATUS_TEXT[element.r_state];
            }

        } else if (element.r_name == 'darbs no Bunkura 2') {
            if (element.r_state != 0) {
                T_no_BU2_btn_on.classList.add('lobisana_work');
                T_no_BU2_btn_text.textContent = ROUTE_STATUS_TEXT[element.r_state];
            } else {
                T_no_BU2_btn_on.classList.remove('lobisana_work');
                T_no_BU2_btn_text.textContent = ROUTE_STATUS_TEXT[element.r_state];
            }
        } else if (element.r_name == 'Weifang') {
            if (element.r_state != 0) {
                wifang_bt_on.classList.add('lobisana_work');
                wifang_bt_text.textContent = ROUTE_STATUS_TEXT[element.r_state];
            } else {
                wifang_bt_on.classList.remove('lobisana_work');
                wifang_bt_text.textContent = ROUTE_STATUS_TEXT[element.r_state];
            }
        } else if (element.r_name == 'lobīšana') {
            if (element.r_state != 0) {
                lobisana_btn_on.classList.add('lobisana_work');
                lobisana_text_status.textContent = ROUTE_STATUS_TEXT[element.r_state];
            } else {
                lobisana_btn_on.classList.remove('lobisana_work');
                lobisana_text_status.textContent = ROUTE_STATUS_TEXT[element.r_state];
            }
        }
    });

    if (orders_to_bunkers != false) {
        orderStartTime = orders_to_bunkers[0].start_tmst;
        atlasitiObjekti = orders_to_bunkers.filter(function (objekts) {
            return objekts.order_state === 2;
        });
        var bu_1 = orders_to_bunkers.filter(function (objekts) {
            return objekts.bunker_nr === 1;
        });
        var bu_2 = orders_to_bunkers.filter(function (objekts) {
            return objekts.bunker_nr === 2;
        });
        weifangBtns.forEach(function (element) {
            element.classList.remove("btn-disabled");
        });
        lobisana.forEach(function (element) {
            element.classList.remove("btn-disabled");
        });
        if (bu_1.length > 0) {
            T_no_BU1.forEach(function (element) {
                element.classList.remove("btn-disabled");
            });

            bunkurs_1.textContent = bu_1[0].order_lable;
            bu1_Part_Nr.textContent = bu_1[0].order_lable;
            bu1_product.textContent = bu_1[0].label;

            bu_1_btn.setAttribute("data-order_id", bu_1[0].u_id);

            if (bu_1[0].order_state == 2) {

                bu_1_btn.textContent = "Notiek darbs";
                bu_1_btn.classList.add('active');
                bu_1_btn.style.backgroundColor = "red";
                bu_2_btn.disabled = true;
                document.getElementById("startPriekstirisana").setAttribute('data-routetostart', bu_1[0].u_id);
                document.getElementById("stopPriekstirisana").setAttribute('data-routetostart', bu_1[0].u_id);

                order_state_text.textContent = ORDER_TEXT[bu_1[0].order_state];
                order_state_text.style.color = ORDER_TEXT_color[bu_1[0].order_state];
            } else if (bu_1[0].order_state == 3 && bu_1_btn.textContent != "Tiks izmantota šī partija") {
                
                bu_1_btn.textContent = "Pauzēts";
                bu_1_btn.classList.remove('active')
                bu_1_btn.style.backgroundColor = "yellow";
                bu_2_btn.disabled = false;
                order_state_text.textContent = ORDER_TEXT[bu_1[0].order_state];
                order_state_text.style.color = ORDER_TEXT_color[bu_1[0].order_state];
                document.getElementById("startPriekstirisana").removeAttribute('data-routetostart');
                document.getElementById("stopPriekstirisana").removeAttribute('data-routetostart');
            } else {

                if (!bu_1_btn.classList.contains("active") && bu_1_btn.textContent != "Pauzēts") {
                    document.getElementById("startPriekstirisana").removeAttribute('data-routeToStart');
                    document.getElementById("stopPriekstirisana").removeAttribute('data-routeToStart');       


                    bu_2_btn.disabled = false;
                    bu_1_btn.textContent = btn_textContent;
                    bu_1_btn.style.backgroundColor = btn_backgroundColor;
                } else if (bu_1_btn.classList.contains("active") && bu_1_btn.textContent == "Notiek darbs" || bu_1_btn.textContent == "Pauzēts") {
                    bu_2_btn.disabled = false;
                    bu_1_btn.textContent = btn_textContent;
                    bu_1_btn.style.backgroundColor = btn_backgroundColor;
                    order_state_text.textContent = "";
                }
            }
        } else {
            T_no_BU1.forEach(function (element) {
                element.classList.add("btn-disabled");
            });
            bunkurs_1.textContent = "";
            bu_1_btn.removeAttribute("data-order_id");
            bu_2_btn.disabled = false;
            bu_1_btn.textContent = btn_textContent;
            bu_1_btn.style.backgroundColor = btn_backgroundColor;
            order_state_text.textContent = "";

            bunkurs_1.textContent = "";
            bu1_Part_Nr.textContent = "";
            bu1_product.textContent = "";
            bu_1_btn.classList.remove('active');
                 
        }
        //**************************************************************************** */
        if (bu_2.length > 0) {
            T_no_BU2.forEach(function (element) {
                element.classList.remove("btn-disabled");
            });
            bunkurs_2.textContent = bu_2[0].order_lable;
            bu2_Part_Nr.textContent = bu_2[0].order_lable;
            bu2_product.textContent = bu_2[0].label;

            bu_2_btn.setAttribute("data-order_id", bu_2[0].u_id);
            if (bu_2[0].order_state == 2) {

                bu_2_btn.textContent = "Notiek darbs";
                bu_2_btn.style.backgroundColor = "red";
                bu_2_btn.classList.add('active');
                bu_1_btn.disabled = true;
                document.getElementById("startPriekstirisana").setAttribute('data-routetostart', bu_2[0].u_id);
                document.getElementById("stopPriekstirisana").setAttribute('data-routetostart', bu_2[0].u_id);
                order_state_text.textContent = ORDER_TEXT[bu_2[0].order_state];
                order_state_text.style.color = ORDER_TEXT_color[bu_2[0].order_state];
            } else if (bu_2[0].order_state == 3 && bu_2_btn.textContent != "Tiks izmantota šī partija") {

                bu_2_btn.textContent = "Pauzēts";
                bu_2_btn.style.backgroundColor = "yellow";
                bu_1_btn.disabled = false;
                bu_2_btn.classList.remove('active');
                document.getElementById("startPriekstirisana").removeAttribute('data-routetostart');
                document.getElementById("stopPriekstirisana").removeAttribute('data-routetostart');
                if (bu_1.lenght > 0) {
                    if (bu_1[0].order_state == 2) {
                        order_state_text.textContent = ORDER_TEXT[bu_1[0].order_state];
                        order_state_text.style.color = ORDER_TEXT_color[bu_1[0].order_state];
                    } else {
                        order_state_text.textContent = ORDER_TEXT[bu_2[0].order_state];
                        order_state_text.style.color = ORDER_TEXT_color[bu_2[0].order_state];
                    }
                }
            } else {
                if (!bu_2_btn.classList.contains("active") && bu_2_btn.textContent != "Pauzēts") {

                    bu_1_btn.disabled = false;
                    bu_2_btn.textContent = btn_textContent;
                    bu_2_btn.style.backgroundColor = btn_backgroundColor;
                } else if (bu_2_btn.classList.contains("active") && bu_2_btn.textContent == "Notiek darbs" || bu_2_btn.textContent == "Pauzēts") {
                    bu_1_btn.disabled = false;
                    bu_2_btn.textContent = btn_textContent;
                    bu_2_btn.style.backgroundColor = btn_backgroundColor;
                    order_state_text.textContent = "";
                }
            }

        } else {
            T_no_BU2.forEach(function (element) {
                element.classList.add("btn-disabled");
            });
            bunkurs_2.textContent = "";
            bu_2_btn.removeAttribute("data-order_id");
            bu_1_btn.disabled = false;
            bu_2_btn.textContent = btn_textContent;
            bu_2_btn.style.backgroundColor = btn_backgroundColor;
            bunkurs_2.textContent = "";
            bu2_Part_Nr.textContent = "";
            bu2_product.textContent = "";
            bu_2_btn.classList.remove('active');

        }
    } else {
        bunkurs_1.textContent = "";
        bunkurs_2.textContent = "";
        bu_1_btn.removeAttribute("data-order_id");
        bu_2_btn.removeAttribute("data-order_id");
        bu_1_btn.textContent = btn_textContent;
        bu_1_btn.style.backgroundColor = btn_backgroundColor;
        bu_2_btn.textContent = btn_textContent;
        bu_2_btn.style.backgroundColor = btn_backgroundColor;
        bu_1_btn.disabled = false;
        bu_2_btn.disabled = false;
        bu_1_btn.classList.remove('active')
        bu_2_btn.classList.remove('active')
        order_state_text.textContent = "";
        T_no_BU1.forEach(function (element) {
            element.classList.add("btn-disabled");
        });
        T_no_BU2.forEach(function (element) {
            element.classList.add("btn-disabled");
        });
        weifangBtns.forEach(function (element) {
            element.classList.add("btn-disabled");
        });
        lobisana.forEach(function (element) {
            element.classList.add("btn-disabled");
        });
        bunkurs_1.textContent = "";
        bu1_Part_Nr.textContent = "";
        bu1_product.textContent = "";
        bunkurs_2.textContent = "";
        bu2_Part_Nr.textContent = "";
        bu2_product.textContent = "";
    }
    if(!bu_2_btn.classList.contains("active") && !bu_1_btn.classList.contains("active") ){
        document.getElementById("startPriekstirisana").removeAttribute('data-routetostart');
        document.getElementById("stopPriekstirisana").removeAttribute('data-routetostart');
    }
    function toggleButtonClass(elementId, condition) {
        var element = document.getElementById(elementId);
        if (element) {
            element.classList.remove("control-btn-on", "control-btn-on-job");
            element.classList.add(condition ? "control-btn-on" : "control-btn-on");
        }
    }
    if (getTag('P3_routeState_0') == 2) {
        toggleButtonClass("weifang_on", true);
    } else {
        toggleButtonClass("weifang_on", false);
    }
    var full_bu_1 = getTag('BU1_LVL');
    var full_bu_2 = getTag('BU2_LVL');
    var fillElement2 = document.getElementById("T2_fill");
    fillElement2.style.height = full_bu_2 + "%";
    var fillElement = document.getElementById("T1_fill");
    fillElement.style.height = full_bu_1 + "%";
    
    console.log("Vai ir cikls?");
    //setTimeout(scaleWork, 500);    
    await doSomething();
    console.timeEnd("CIKLA_DARBS");
}

var bunkerBatons = document.getElementById("bunkerBtn");
var hidden_stop = document.getElementById("hidde_STOP");
//***************************************************************** */
// Izveido funkciju, kas pievieno event listenerus
async function addScaleSaveBtnListeners() {
    var SaveScalaData = document.querySelectorAll("[id$='_ScaleSaveBtn']");
    SaveScalaData.forEach(function (element) {
        element.addEventListener('click', async function (event) {
            var Sc_tag_id = event.target.dataset.scale_tag_id;
            var Sc_id = event.target.dataset.scale_id;

            var canSave = document.getElementsByClassName('active');
            //console.log(canSave.length);
            if (canSave.length > 0) {
                var order_id = canSave[0].dataset.order_id;
                console.log(order_id);
                var bag_data = {
                    time: getNow(),
                    scales: Sc_id,
                    order: order_id,
                    weight: getTag('Weight_ID' + Sc_tag_id) ? getTag('Weight_ID' + Sc_tag_id) : '0'
                };
                SaveToBagInfo(bag_data);
                alert("Dati saglabāti");
            } else {
                alert("Nav izvēlēts uzdevums")
                return;
            };
        });
    });
}
////////////////////////////////////////////  
async function addScaleBackToZeroBtnListeners() {
    var ZeroScalaData = document.querySelectorAll("[id$='_ZeroSaveBtn']");
    ZeroScalaData.forEach(function (element) {
        element.addEventListener('click', async function (event) {
            var tag_id = event.target.dataset.scale_tag_id;
            var confirmDialog = document.querySelector('.confirm-dialog');
            var confirmButton = document.querySelector('.confirm-dialog-btn.confirm');
            var cancelButton = document.querySelector('.confirm-dialog-btn.cancel');

            confirmButton.addEventListener('click', function () {
                setTag('SaveToDb_ID' + tag_id, SCALES_COMAND.SetZero);
                confirmDialog.classList.remove('show');
            });

            cancelButton.addEventListener('click', function () {
                confirmDialog.classList.remove('show');
            });
            confirmDialog.classList.add('show');
        });
    });
}
async function addFilterProteinBtnEvent() {
    var saveFilterProtein = document.getElementById('saveProtein');
    saveFilterProtein.addEventListener('click', async function () {

        var canSave = document.getElementsByClassName('active');

        if (canSave.length > 0) {
            var order_id = canSave[0].dataset.order_id;
            var proteinWeight = document.getElementById("proteinData").value;
            console.log(order_id);
            var bag_data = {
                time: getNow(),
                scales: 6,
                order: order_id,
                weight: proteinWeight
            }
            SaveToBagInfo(bag_data);
            document.getElementById("proteinData").value = "";
            alert("Dati saglabāti");

        } else {
            alert("Nav izvēlēts uzdevums")
            return;
        }
    });
}
document.addEventListener('DOMContentLoaded', async function () {
    //console.time("SVARU datu ielāde");
    ScalesData = await getScalesData();
    //console.timeEnd("SVARU datu ielāde");
    addScaleSaveBtnListeners();
    addScaleBackToZeroBtnListeners();
    addFilterProteinBtnEvent();
    await scaleWork();
    doSomething();
});
var pogas = document.querySelectorAll("[id$='_control_in_use']");
var confirm = document.getElementById("confirm-module");

function showConfirm() {
    var confirm = document.getElementById("confirm-module");
    confirm.style.display = "flex";
}
function closeConfirm() {
    var confirm = document.getElementById("confirm-module");
    confirm.style.display = "none";
}

for (var i = 0; i < pogas.length; i++) {
    pogas[i].addEventListener("click", function (event) {
        var content = event.target.textContent;
        if (content == 'Notiek darbs') {
            alert("No sākuma apturiet līniju!");
            return;
        }
        var clickedButton = event.target;

        var order_id = event.target.dataset.order_id;
        var otherButton = (clickedButton === pogas[0]) ? pogas[1] : pogas[0];
        var btn_color = window.getComputedStyle(clickedButton).getPropertyValue('background-color');
        console.log(btn_color);
        if (content == 'Pauzēts') {
            clickedButton.classList.add("active");
            document.getElementById("startPriekstirisana").setAttribute('data-routeToStart', order_id);
            document.getElementById("stopPriekstirisana").setAttribute('data-routeToStart', order_id);
            clickedButton.innerHTML = "Tiks izmantota šī partija";
            otherButton.disabled = true;
        } else if (content == 'Tiks izmantota šī partija' && clickedButton.classList.contains("active") && btn_color == 'rgb(255, 255, 0)') {
            clickedButton.innerHTML = "Pauzēts";
            otherButton.disabled = false;
        } else if (content == 'Tiks izmantota šī partija' && btn_color != 'rgb(255, 255, 0)') {
            clickedButton.classList.remove("active");
            document.getElementById("startPriekstirisana").removeAttribute('data-routeToStart');
            document.getElementById("stopPriekstirisana").removeAttribute('data-routeToStart');
            clickedButton.innerHTML = "Sākt izmantot partiju";
            otherButton.disabled = false;
        } else {
            // Ja noklikšķinātā poga ir neaktīva
            clickedButton.classList.add("active");
            document.getElementById("startPriekstirisana").setAttribute('data-routeToStart', order_id);
            document.getElementById("stopPriekstirisana").setAttribute('data-routeToStart', order_id);
            clickedButton.innerHTML = "Tiks izmantota šī partija";
            otherButton.disabled = true;

        }
    });
}
var parentElement = document.getElementById("poguKopa2");
parentElement.addEventListener("click", async function (event) {

    var clickedButton = event.target;
    if (clickedButton.id === "startPriekstirisana") {    
       
        console.log("Nospiesta START priekštīrīšanas poga");
        route = clickedButton.getAttribute("data-routetostart");        

        if (!route || route == 'undefined') {
            alert("Nav izvēlēta partija");
            return;
        }
        BanerMessage();
        var order = await orderStatus(route);
        try {

            if (order[0].order_state == ORDER_STATE.Paused) {
                resumeOrder(route);
                setTag("P1_routeComand_9", ROUTE_COMAND.start);
                setTag("BU1_count_comand", COUENTER_COMAND.start);
                setTag("WF_count_comand", COUENTER_COMAND.start);

            } else if (order[0].order_state == ORDER_STATE.New) {
                setTag("P1_routeComand_9", ROUTE_COMAND.start);
                setTag("BU1_count_comand", COUENTER_COMAND.start);
                setTag("WF_count_comand", COUENTER_COMAND.start);

                start_route(getNow(), order[0].u_id, ORDER_STATE.Active);
            }
        } catch (err) {
            console.error("Kļūda meklējot maršruta ID: ", err);
        }

    } else if (clickedButton.id === "stopPriekstirisana") {

        console.log("Nospiesta STOP priekštīrīšanas poga");
        route = clickedButton.getAttribute("data-routetostart");
        //console.time("Off pogas nospiešanas");
        
        var order = await orderStatus(route);
        // console.timeEnd("Off pogas nospiešanas");
        if (!route) {
            alert("Nav iesāktu uzdevumu");
            return;
        }
        showConfirm();
        document.getElementById("doneOrder").setAttribute('data-route-name', route);
        document.getElementById("pauseOrder").setAttribute('data-route-name', route);
        document.getElementById("cancleOrder").setAttribute('data-route-name', route);

    }
});
var confirmOrderClose = document.getElementById("confirm-close-button");
document.addEventListener("DOMContentLoaded", function () {
    var confirmOrderClose = document.getElementById("confirm-close-button");
    confirmOrderClose.addEventListener("click", function () {
        closeConfirm();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    var doneOrderButton = document.getElementById("doneOrder");
    /////////////////////////////#################///////////////////////////////////
    async function handleOrderDonebtn() {
        ////////////////////////////////// Spēle ar Prompt //////////////////////////
        var customPromptContainer = document.getElementById("customPromptContainer");
        customPromptContainer.style.display = "grid";

        var customOkBtn = document.getElementById("customOkBtn");
        var customCancelBtn = document.getElementById("customCancelBtn");
        var customInput = document.getElementById("numberInput");
        customInput.value = 0.0;

        customOkBtn.addEventListener("click", handleCustomOkBtnClick);

        customCancelBtn.addEventListener("click", function () {
            customPromptContainer.style.display = "none";
            customOkBtn.removeEventListener("click", handleCustomOkBtnClick);
        });
        var order_id = event.target.dataset.routeName;
        function calculateWeightFromSilo(callback) {
            //console.time("myCode");
            bag_weight(order_id)
                .then((weight) => {
                    var koeficient = document.getElementById('numberInput').value;
                    var weightToRemove = parseInt(weight[0].total_weight) / ((100 - koeficient) / 100);
                    // console.log(weightToRemove.toFixed(0));
                    var finalWeightToRemove = parseInt(weightToRemove.toFixed(0));
                    get_silos_id(order_id)
                        .then((silos_id) => {
                            console.log(silos_id[0].silos_id);
                            var params = {
                                silos_id: silos_id[0].silos_id,
                                weight: finalWeightToRemove
                            };
                            return calculateSiloProduct(params);
                        })
                        .then(() => {
                            customPromptContainer.style.display = "none";
                            console.log(order_id);
                            callback();
                            // Izsaukt "callback" funkciju, kad viss ir izpildīts
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
                    console.error(error);
                });
            //console.timeEnd("myCode");
        }
        async function handleCustomOkBtnClick() {

            try {

                await calculateWeightFromSilo();

                customOkBtn.removeEventListener("click", handleCustomOkBtnClick);

                customPromptContainer.style.display = "none";
                // console.log("Funkcija pabeigta var turpināt");
                document.getElementById("startPriekstirisana").removeAttribute('data-routetostart');
                document.getElementById("stopPriekstirisana").removeAttribute('data-routetostart');

                var canSaveElements = document.getElementsByClassName('active')[0];
                //console.log(canSaveElements);
                canSaveElements.classList.remove('active');
                var canSaveElements2 = document.getElementsByClassName('active')[0];

                setTag("P1_routeComand_9", ROUTE_COMAND.stop);
                setTag("BU1_count_comand", COUENTER_COMAND.stop);
                setTag("WF_count_comand", COUENTER_COMAND.stop);
                var moto_h = {
                    part1_mh: getTag("BU1_count_Motoh") ? getTag("BU1_count_Motoh") : 0,
                    part2_mh: getTag("motoTime_ID108") ? getTag("motoTime_ID108") : 0,
                    part3_mh: getTag("WF_count_Motoh") ? getTag("WF_count_Motoh") : 0
                }
                //*************************************************Pārtaisam, lai iegūtu kWh datus no datubāzes ********************/
                
                BanerMessage();
                closeConfirm();
                var Par1_used_kWh = await getUsedKwh(orderStartTime, getNow());
                var params = {
                    time: getNow(),
                    u_id: order_id,
                    state: ORDER_STATE.Finished,
                    part1_kwh: Par1_used_kWh[0]?.par1_useage ?? 0,
                    part2_kwh: Par1_used_kWh[0]?.par2_useage ?? 0,
                    part3_kwh: Par1_used_kWh[0]?.par3_useage ?? 0,
                    part1_work_h: moto_h.part1_mh,
                    part2_work_h: moto_h.part2_mh,
                    part3_work_h: moto_h.part3_mh,
                };
                // console.log(params);

                finish_route(params);
                clearBunker(order_id);
                document.getElementById("startPriekstirisana").removeAttribute('data-routeToStart');
                document.getElementById("stopPriekstirisana").removeAttribute('data-routeToStart');
                //closeConfirm();
                //Swal.close();
                setTag("BU1_count_comand", COUENTER_COMAND.reset);
                setTag("WF_count_comand", COUENTER_COMAND.reset);
            } catch (error) {
                console.error(error);
            }

        }
    }
    doneOrderButton.addEventListener("click", handleOrderDonebtn);

    ///////////////////////////////////////////////////////////////////////////////////
    var PauseOrder = document.getElementById("pauseOrder");
    PauseOrder.addEventListener("click", async function (event) {
        var order_id = event.target.dataset.routeName;

        setTag("P1_routeComand_9", ROUTE_COMAND.stop);
        setTag("BU1_count_comand", COUENTER_COMAND.stop);
        setTag("WF_count_comand", COUENTER_COMAND.stop);
        document.getElementById("startPriekstirisana").removeAttribute('data-routetostart');
        document.getElementById("stopPriekstirisana").removeAttribute('data-routetostart');
        // var kwh = {
        //     part1_kwh: getTag("BU1_count_kwh") ? getTag("BU1_count_kwh") : 0,
        //     part2_kwh: getTag("Part2_kWh") ? getTag("Part2_kWh") : 0,
        //     part3_kwh: getTag("WF_count_kwh") ? getTag("WF_count_kwh") : 0
        // }
        var moto_h = {
            part1_mh: getTag("BU1_count_Motoh") ? getTag("BU1_count_Motoh") : 0,
            part2_mh: getTag("motoTime_ID108") ? getTag("motoTime_ID108") : 0,
            part3_mh: getTag("WF_count_Motoh") ? getTag("WF_count_Motoh") : 0
        }
   
        BanerMessage();
        closeConfirm();
        var Par1_used_kWh = await getUsedKwh(orderStartTime, getNow());
        var params = {
            time: getNow(),
            u_id: order_id,
            state: ORDER_STATE.Paused,
            part1_kwh: Par1_used_kWh[0]?.par1_useage ?? 0,
            part2_kwh: Par1_used_kWh[0]?.par2_useage ?? 0,
            part3_kwh: Par1_used_kWh[0]?.par3_useage ?? 0,
            part1_work_h: moto_h.part1_mh,
            part2_work_h: moto_h.part2_mh,
            part3_work_h: moto_h.part3_mh,
        };
        // console.log(params);

        finish_route(params);
        document.getElementById("startPriekstirisana").removeAttribute('data-routeToStart');
        document.getElementById("stopPriekstirisana").removeAttribute('data-routeToStart');
        //clearBunker(order_id);
        //closeConfirm();
        //Swal.close();
        setTag("BU1_count_comand", COUENTER_COMAND.reset);
        setTag("WF_count_comand", COUENTER_COMAND.reset);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var cancelOrderbtn = document.getElementById("cancleOrder");
    //var doneOrderButton = document.getElementById("doneOrder");
    /////////////////////////////#################///////////////////////////////////
    async function handleOrderDonebtn() {
        ////////////////////////////////// Spēle ar Prompt //////////////////////////

        var customPromptContainer = document.getElementById("customPromptContainer");
        customPromptContainer.style.display = "grid";

        var customOkBtn = document.getElementById("customOkBtn");
        var customCancelBtn = document.getElementById("customCancelBtn");
        var customInput = document.getElementById("numberInput");
        customInput.value = 0.0;

        customOkBtn.addEventListener("click", handleCustomOkBtnClick);
        customCancelBtn.addEventListener("click", function () {
            customPromptContainer.style.display = "none";
            customOkBtn.removeEventListener("click", handleCustomOkBtnClick);
        });
        var order_id = event.target.dataset.routeName;
        function calculateWeightFromSilo(callback) {
            //console.time("myCode");
            bag_weight(order_id)
                .then((weight) => {
                    var koeficient = document.getElementById('numberInput').value;
                    var weightToRemove = parseInt(weight[0].total_weight) / ((100 - koeficient) / 100);
                    console.log(weightToRemove.toFixed(0));
                    var finalWeightToRemove = parseInt(weightToRemove.toFixed(0));
                    get_silos_id(order_id)
                        .then((silos_id) => {
                            console.log(silos_id[0].silos_id);
                            var params = {
                                silos_id: silos_id[0].silos_id,
                                weight: finalWeightToRemove
                            };
                            return calculateSiloProduct(params);
                        })
                        .then(() => {
                            customPromptContainer.style.display = "none";
                            console.log(order_id);
                            callback();
                            // Izsaukt "callback" funkciju, kad viss ir izpildīts
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
                    console.error(error);
                });
            // console.timeEnd("myCode");
        }
        async function handleCustomOkBtnClick() {
            try {
                await calculateWeightFromSilo();
                customOkBtn.removeEventListener("click", handleCustomOkBtnClick);
                customPromptContainer.style.display = "none";
                console.log("Funkcija pabeigta var turpināt");
                document.getElementById("startPriekstirisana").removeAttribute('data-routetostart');
                document.getElementById("stopPriekstirisana").removeAttribute('data-routetostart');
                var canSaveElements = document.getElementsByClassName('active')[0];
                console.log(canSaveElements);
                canSaveElements.classList.remove('active');
                var canSaveElements2 = document.getElementsByClassName('active')[0];
                console.log(canSaveElements2);
                setTag("P1_routeComand_9", ROUTE_COMAND.stop);
                setTag("BU1_count_comand", COUENTER_COMAND.stop);
                setTag("WF_count_comand", COUENTER_COMAND.stop);

                var moto_h = {
                    part1_mh: getTag("BU1_count_Motoh") ? getTag("BU1_count_Motoh") : 0,
                    part2_mh: getTag("motoTime_ID108") ? getTag("motoTime_ID108") : 0,
                    part3_mh: getTag("WF_count_Motoh") ? getTag("WF_count_Motoh") : 0
                }               
                BanerMessage();
                closeConfirm();
                var Par1_used_kWh = await getUsedKwh(orderStartTime, getNow());
                var params = {
                    time: getNow(),
                    u_id: order_id,
                    state: ORDER_STATE.Canceled,
                    part1_kwh: Par1_used_kWh[0]?.par1_useage ?? 0,
                    part2_kwh: Par1_used_kWh[0]?.par2_useage ?? 0,
                    part3_kwh: Par1_used_kWh[0]?.par3_useage ?? 0,
                    part1_work_h: moto_h.part1_mh,
                    part2_work_h: moto_h.part2_mh,
                    part3_work_h: moto_h.part3_mh,
                };
                // console.log(params);

                finish_route(params);
                clearBunker(order_id);
                document.getElementById("startPriekstirisana").removeAttribute('data-routeToStart');
                document.getElementById("stopPriekstirisana").removeAttribute('data-routeToStart');
                //closeConfirm();
                //Swal.close();
                setTag("BU1_count_comand", COUENTER_COMAND.reset);
                setTag("WF_count_comand", COUENTER_COMAND.reset);
            } catch (error) {
                console.error(error);
            }
        }
    }
    cancelOrderbtn.addEventListener("click", handleOrderDonebtn);
});
// Atlasīt visus pogu elementus, izmantojot querySelectorAll
var bu1_buttons = document.querySelectorAll('[id^="bu1"');

// Pārlūkot katru pogas elementu un pievienot eventa klausītāju
bu1_buttons.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
        console.log(event.target.textContent);
        if (event.target.textContent == 'ON') setTag('P1_routeComand_7', 1);
        if (event.target.textContent == 'OFF') setTag('P1_routeComand_7', 2);

    });
});
var bu2_buttons = document.querySelectorAll('[id^="bu2"');
// Pārlūkot katru pogas elementu un pievienot eventa klausītāju
bu2_buttons.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
        console.log(event.target.textContent);
        if (event.target.textContent == 'ON') setTag('P1_routeComand_8', 1);
        if (event.target.textContent == 'OFF') setTag('P1_routeComand_8', 2);
    });
});
var weifangBtns = document.querySelectorAll('[id^="weifang"]');
weifangBtns.forEach(function (wfbtn) {
    wfbtn.addEventListener("click", function (event) {
        console.log(event.target.textContent);
        if (event.target.textContent == 'ON') setTag('P3_routeComand_0', 1);
        if (event.target.textContent == 'OFF') setTag('P3_routeComand_0', 2);
    });
});

var bunkerBtns = document.getElementById("bunkerBtn");
hidden_stop.addEventListener("click", function () {
    var route = document.getElementById("hidde_STOP").getAttribute('data-workingroute');
    if (route == 9 || route == 8 || route == 7) {
        alert('Izmantojiet OFF pogas');
    } else {
        setTag("P1_routeComand_" + route, 2);
        hidden_stop.style.display = "none";
        bunkerBatons.classList.remove('btn-disabled');
    }
});
function showHiddenBtn(text, route_id) {
    hidden_stop = document.getElementById("hidde_STOP");
    document.getElementById("hidden_text").textContent = text;
    hidden_stop.setAttribute("data-workingroute", route_id);
}
bunkerBtns.addEventListener("click", async function (event) {
    //can_start = await routeCanBeStarted();
    if (event.target.textContent == 'No BU1 uz BU2') {

        setTag("P1_routeComand_1", ROUTE_COMAND.start);

        showHiddenBtn(event.target.textContent, 1);
        changeRouteBtnState();
    }
    if (event.target.textContent == 'No BU2 uz BU1') {
        setTag("P1_routeComand_2", ROUTE_COMAND.start);
        showHiddenBtn(event.target.textContent, 2);
        changeRouteBtnState();
    }
    if (event.target.textContent == 'No BU1 uz Auto') {
        setTag("P1_routeComand_5", ROUTE_COMAND.start);
        showHiddenBtn(event.target.textContent, 5);
        changeRouteBtnState();
    }
    if (event.target.textContent == 'No BU2 uz Auto') {
        setTag("P1_routeComand_6", ROUTE_COMAND.start);
        showHiddenBtn(event.target.textContent, 6);
        changeRouteBtnState();
    }
    if (event.target.textContent == 'Ielāde BU1') {
        setTag("P1_routeComand_3", ROUTE_COMAND.start);
        showHiddenBtn(event.target.textContent, 3);
        changeRouteBtnState();
    }
    if (event.target.textContent == 'Ielāde BU2') {
        setTag("P1_routeComand_4", ROUTE_COMAND.start);
        showHiddenBtn(event.target.textContent, 4);
        changeRouteBtnState();
    }
});
function changeRouteBtnState() {
    hidden_stop.style.display = "flex";
    bunkerBatons.classList.add('btn-disabled');
}

var T1uzT2Btn = document.getElementById("T1uzT2Btn");
var T2uzT1Btn = document.getElementById("T2uzT1Btn");
var T1uzCar = document.getElementById("T1uzCar");
var T2uzCar = document.getElementById("T2uzCar");

async function doSomething() {
    console.log("DoSomthing");    
    can_start = await routeCanBeStarted();    
    var is_active_route = false;    
    can_start.forEach(function (element) {
        if (getTag('P1_routeComand_' + element.r_id) > 0 || getTag('P1_routeState_' + element.r_id) > 0) {
            showHiddenBtn(element.r_name, element.r_id);
            is_active_route = true;
        }
    });    
    if (is_active_route == false) {
        bunkerBatons.classList.remove('btn-disabled');
        hidden_stop.style.display = "none";

    } else {
        bunkerBatons.classList.add('btn-disabled');
        hidden_stop.style.display = "flex";
    }    
}
var dropErrors = document.getElementById('resetErr');

dropErrors.addEventListener('click', function () {

    setTag('Part3_RESET_EL', 1);
    setTag('Part1_ErrReset', 1);
});