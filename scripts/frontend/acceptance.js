//################ Prepeared statement funkcijas ####################
//const db_setting = { outfmt: 'json', dbgroup: 'driada' };
function check_active_income() {
    return new Promise(resolve => {
        runSql('is_active_incomes', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function getAcceptenceData() {
    return new Promise(resolve => {
        runSql('opened_incom_data', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};

function getAlowedSilos(product_id) {
    return new Promise(resolve => {
        runSql('get_alowed_silos', { product_id }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function saceNewIncoming(saveData) {
    return new Promise(resolve => {
        runSql('save_openin', saveData, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};

function have_product(silos_id) {
    return new Promise(resolve => {
        runSql('is_product_inside', { silos_id }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};





function getAllsuppliers() {
    return new Promise(resolve => {
        runSql('bunker_get_all', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};

function getCars() {
    return new Promise(resolve => {
        runSql('cars_get_all', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function getInvoice() {
    return new Promise(resolve => {
        runSql('get_invoice_from_silos_data', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};

function saveNewSupplie(param) {
    return new Promise(resolve => {
        runSql('save_silo_data', param, db_setting, function (result) {
            console.log(result.statusCode);
            if (result.statusCode !== 200) {
                //alert("!! Netika izveidots uzdevums !!");
            }
            alert("Ieraksts saglabāts!");

            resolve(result.statusCode === 200);
        });
    });
}
function saveNewSupplie2(param) {
    return new Promise(resolve => {
        runSql('save_silo_data_2', param, db_setting, function (result) {
            console.log(result.statusCode);
            if (result.statusCode !== 200) {
            }
            alert("Ieraksts saglabāts!");

            resolve(result.statusCode === 200);

        });
    });
}
//###########################################################################
// #################### Darbības funkcijas##########################


function generateUniqueIdentifier() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 9;
    let identifier = '';

    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        identifier += characters.charAt(randomIndex);
    }

    // Pārbaudīt, vai identifikators jau eksistē (piemēram, jūsu datubāzē vai esošajās vērtībās)
    // Ja identifikators jau eksistē, atkārtoti izsaukt funkciju, lai iegūtu citu identifikatoru

    return identifier;
}







//##########################################################
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
var first_weight = document.getElementById("firstWeight");
var second_weight = document.getElementById("secondWeight");

function closeAcceptance(modul) {

    var second_content = document.getElementById("acceptance_container_2");
    first_weight.classList.remove("acception_inactive");
    first_weight.classList.add("acception_active");
    second_weight.classList.remove("acception_active");
    second_weight.classList.add("acception_inactive");
    modul.style.display = "none";
    second_content.style.display = "none";
}
//######################################################
//######################  Darbības ar EvenListeneriem ###########

first_weight.addEventListener("click", function () {
    var second_content = document.getElementById("acceptance_container_2");
    var first_content = document.getElementById("acceptance_container_1");
    first_content.style.display = "grid";
    first_weight.classList.remove("acception_inactive");
    first_weight.classList.add("acception_active");
    second_content.style.display = "none";
    second_weight.classList.remove("acception_active");
    second_weight.classList.add("acception_inactive");
});

second_weight.addEventListener("click", function () {
    var first_content = document.getElementById("acceptance_container_1");
    var second_content = document.getElementById("acceptance_container_2");
    second_content.style.display = "grid";
    first_content.style.display = "none";
    second_weight.classList.remove("acception_inactive");
    second_weight.classList.add("acception_active");
    first_weight.classList.remove("acception_active");
    first_weight.classList.add("acception_inactive");
});

const acceptance = document.getElementById("acceptance");

var acceptanceSave = document.getElementById("saveAcceptance");
var acceptanceSave2 = document.getElementById("saveAcceptance2");



acceptance.addEventListener("click", async function () {
    acceptanceSave.addEventListener('click',saveFirstWeight);
    acceptanceSave2.addEventListener('click',saveSecoundWeight);
    const emptyOption = createOption("0", "Izvēlieties", true);
    const emptyOption2 = createOption("0", "Nav izvēlēts produkts", true);
    const emptyOption3 = createOption("0", "Izvēlieties", true);
    const emptyOption4 = createOption("0", "Izvēlieties", true);
    const emptyOption5 = createOption("0", "Izvēlieties", true);

    var is_active_incoms = await check_active_income();

    if (!is_active_incoms) {
        
        
        const closeButton = document.getElementById("opening-close-button");
        const OpeningModal = document.querySelector("#open_acception-module");

        var suppliersFromBD = await getAllSuppliers();
        var Acceptance_products = await getAllProducts()

        OpeningModal.style.display = "flex";

        closeButton.addEventListener("click", function () {
            OpeningModal.style.display = "none";
            product_select.removeEventListener('change', get_accepted_silos_listener);
            saveClose.removeEventListener('click', save_and_close);
            silos_select.removeEventListener('change', check_is_silos_empty);
        });

        const Acceptence_supplie = document.querySelector("#acceptence_supplier");
        Acceptence_supplie.innerHTML = "";

        const Acceptence_products = document.querySelector("#acceptence_product");
        Acceptence_products.innerHTML = "";

        Acceptence_supplie.add(emptyOption);
        addOptions(Acceptence_supplie, suppliersFromBD.map(supplier => createOption(supplier.u_id, supplier.label)));

        const Acceptence_silos = document.querySelector("#acceptence_silos");
        Acceptence_silos.innerHTML = "";
        Acceptence_silos.add(emptyOption2);

        Acceptence_products.add(emptyOption3);
        addOptions(Acceptence_products, Acceptance_products.map(product => createOption(product.u_id, product.label)));

        var product_select = document.getElementById('acceptence_product');        

        var get_accepted_silos_listener = async function () {

            Acceptence_silos.innerHTML = "";
            var product = product_select.value;
            if (product == 0) {
                Acceptence_silos.add(emptyOption2);

            } else {
                var silosFromBD = await getAlowedSilos(product);
                Acceptence_silos.add(emptyOption4);
                addOptions(Acceptence_silos, silosFromBD.map(silo => createOption(silo.u_id, silo.label)));
            };
        }
        product_select.addEventListener('change', get_accepted_silos_listener);

        silos_select = document.getElementById('acceptence_silos');

        var check_is_silos_empty = async function (silos_id) {
            var silos_id = Acceptence_silos.value;

            var is_product_inside = await have_product(silos_id)            
            var is_sure = true;
            if (is_product_inside[0].product_id == null)
                is_sure = confirm('Esat pārliecināts ka silos ir tukšs?');            
            if (!is_sure) {
                // Iegūstam elementu pēc id
                const selectElement = document.getElementById("acceptence_silos");
                // Uzstādam vērtību "0" kā izvēlēto vērtību
                selectElement.value = "0";
            }

        }
        silos_select.addEventListener('change', check_is_silos_empty);

        var save_and_close = async function () {

            var notSelected = [];

            if (Acceptence_products.value === "0") {
                notSelected.push("Produkts");
            }
            if (Acceptence_supplie.value === "0") {
                notSelected.push("Piegādātājs");
            }
            if (Acceptence_silos.value === "0") {
                notSelected.push("Silo");
            }
        
            if (notSelected.length > 0) {
                var message = "Nav izvēlēta vērtība(-as) šādiem laukiem: " + notSelected.join(", ");
                alert(message);
                return;
            }

            var saveData = {
                product: Acceptence_products.value,
                suppliers: Acceptence_supplie.value,
                silo: Acceptence_silos.value,
                income_series: generateUniqueIdentifier()
            }
            saceNewIncoming(saveData);

            silos_select.removeEventListener('change', check_is_silos_empty);
            saveClose.removeEventListener('click', save_and_close);
            product_select.removeEventListener('change', get_accepted_silos_listener);
            OpeningModal.style.display = "none";
        }
        saveClose = document.getElementById('saveOpening');
        saveClose.addEventListener('click', save_and_close);
    } else {
        

        const closeButton = document.getElementById("acceptance-close-button");
        const acceptance = document.querySelector("#acceptance-module");
        var first_content = document.getElementById("acceptance_container_1");
        first_content.style.display = "grid";

        document.getElementById("pvz").value = "";
        document.getElementById("acceptance_weight").value = "";
        const weight2 = document.querySelector("#acceptance_weight_2");
        weight2.value = "";

        var open_acceptande_data = await getAcceptenceData();
        console.log(open_acceptande_data);

        var invoice = await getInvoice();
        console.log(invoice);

        if (invoice[0].invoice == "Nav pavadzīmes") {
            var secoundWeightButton = document.getElementById("secondWeight");
            secoundWeightButton.classList.remove("acception_inactive");
            secoundWeightButton.classList.add("noFirstWeight");
        } else {
            var secoundWeightButton = document.getElementById("secondWeight");
            secoundWeightButton.classList.remove("noFirstWeight");
            secoundWeightButton.classList.add("acception_inactive");
        }

        const invoice2 = document.querySelector("#invoice2");
        invoice2.innerHTML = "";
        invoice2.add(emptyOption5);
        addOptions(invoice2, invoice.map(invoice => createOption(0, invoice.invoice)));

        var supplier = document.getElementById('selected_supplier');
        supplier.innerHTML = open_acceptande_data[0].suppliers_label;        
        supplier.setAttribute('suppliers_id', open_acceptande_data[0].suppliers_id);

        var  product =  document.getElementById('selected_product');
        product.innerHTML = open_acceptande_data[0].product_label;
        product.setAttribute('product_id', open_acceptande_data[0].product_id);

        var silo = document.getElementById('selected_silo');
        silo.innerHTML = open_acceptande_data[0].silos_label;
        silo.setAttribute('silo_id',open_acceptande_data[0].silos_id);
        silo.setAttribute('income_series',open_acceptande_data[0].income_series);

        acceptance.style.display = "flex";       

        var closeAcceptanceX = function(){
            console.log('Tiek aizvērts');
            closeAcceptance(acceptance);
            closeButton.removeEventListener("click", closeAcceptanceX);
        };
        closeButton.addEventListener("click", closeAcceptanceX); 
    }
});



var saveFirstWeight = function(){
    
    var params = {
        supp: document.getElementById("selected_supplier").getAttribute('suppliers_id'),
        invoice: document.getElementById("pvz").value,
        prod: document.getElementById("selected_product").getAttribute('product_id'),
        weight: document.getElementById("acceptance_weight").value,
        silos: document.getElementById("selected_silo").getAttribute('silo_id'),
        income_series: document.getElementById("selected_silo").getAttribute('income_series'),
        time: getNow()
    };

    if (params.supp == 0 || params.prod == 0 || params.weight == "" || params.silos == 0 || params.invoice == "" || params.prod == "") {
        alert("Nevar tikt saglabāts, aizpildiet laukus");
        return;
    }
    //console.log(params);
    saveNewSupplie(params);
    setTimeout(function () {
        const acceptance = document.querySelector("#acceptance-module");
        acceptanceSave.removeEventListener('click',saveFirstWeight);
        closeAcceptance(acceptance);
    }, 1500);

}
acceptanceSave.addEventListener('click',saveFirstWeight);

var saveSecoundWeight = function(){    
    var selectedOption = document.getElementById("invoice2").selectedOptions[0];
    var params = {
        invoice: selectedOption.textContent,
        weight: document.getElementById("acceptance_weight_2").value,
        time: getNow()
    };
    if (params.invoice == "Izvēlieties" || params.weight == "") {
        alert("Nevar tikt saglabāts, aizpildiet laukus");
        return;
    }
    saveNewSupplie2(params);
    setTimeout(function () {
        const acceptance = document.querySelector("#acceptance-module");
        acceptanceSave2.removeEventListener('click',saveSecoundWeight);
        closeAcceptance(acceptance);
    }, 1500);
}
acceptanceSave2.addEventListener('click',saveSecoundWeight);