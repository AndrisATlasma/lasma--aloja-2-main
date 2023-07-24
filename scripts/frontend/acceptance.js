//################ Prepeared statement funkcijas ####################
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
const first_weight = document.getElementById("firstWeight");
const second_weight = document.getElementById("secondWeight");

function closeAcceptance(modul){
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

acceptance.addEventListener("click", async function () {
    const closeButton = document.getElementById("acceptance-close-button");
    const acceptance = document.querySelector("#acceptance-module");
    var first_content = document.getElementById("acceptance_container_1");
    first_content.style.display = "grid";

    var silosFromBD = await getAllSilos();
    var suppliersFromBD = await getAllSuppliers();
    var Acceptance_products = await getAllProducts()    

     var invoice = await getInvoice();
    if(invoice[0].invoice == "Nav pavadzīmes"){
        var secoundWeightButton =  document.getElementById("secondWeight");
        secoundWeightButton.classList.remove("acception_inactive");
        secoundWeightButton.classList.add("noFirstWeight");
    }else{
        var secoundWeightButton =  document.getElementById("secondWeight");
        secoundWeightButton.classList.remove("noFirstWeight");
        secoundWeightButton.classList.add("acception_inactive");
    }    

    const Acceptence_supplie = document.querySelector("#acceptence_supplier");
    Acceptence_supplie.innerHTML = "";
    const Acceptence_silos = document.querySelector("#acceptence_silos");
    Acceptence_silos.innerHTML = "";
    const Acceptence_products = document.querySelector("#acceptence_product");
    Acceptence_products.innerHTML = "";

    const invoice2 = document.querySelector("#invoice2");
    invoice2.innerHTML = "";
    const weight1 = document.querySelector("#acceptance_weight");
    weight1.value = "";
    const weight2 = document.querySelector("#acceptance_weight_2");
    weight2.value = "";

    const emptyOption = createOption("0", "Izvēlieties", true);
    const emptyOption2 = createOption("0", "Izvēlieties", true);
    const emptyOption3 = createOption("0", "Izvēlieties", true);
    const emptyOption4 = createOption("0", "Izvēlieties", true);
    const emptyOption5 = createOption("0", "Izvēlieties", true);

    Acceptence_supplie.add(emptyOption);
    addOptions(Acceptence_supplie, suppliersFromBD.map(supplier => createOption(supplier.u_id, supplier.label)));

    Acceptence_silos.add(emptyOption2);
    addOptions(Acceptence_silos, silosFromBD.map(silo => createOption(silo.u_id, silo.silos)));

    Acceptence_products.add(emptyOption3);
    addOptions(Acceptence_products, Acceptance_products.map(product => createOption(product.u_id, product.label)));

    invoice2.add(emptyOption5);
    addOptions(invoice2, invoice.map(invoice => createOption(0, invoice.invoice)));

    acceptance.style.display = "flex";

    closeButton.addEventListener("click", function () {        
        closeAcceptance(acceptance);
    });
});

const acceptanceSave = document.getElementById("saveAcceptance");

acceptanceSave.addEventListener("click", function () {
   
    var params = {
        supp: document.getElementById("acceptence_supplier").value,        
        invoice:document.getElementById("pvz").value,
        prod: document.getElementById("acceptence_product").value,
        weight: document.getElementById("acceptance_weight").value,
        silos: document.getElementById("acceptence_silos").value,
        time: getNow()
    };
    if(params.supp == 0 || params.prod == 0 || params.weight == "" || params.silos == 0   || params.invoice == "" || params.prod =="") {
        alert("Nevar tikt saglabāts, aizpildiet laukus");
        return;
    }
    //console.log(params);
    saveNewSupplie(params);
    setTimeout(function() {        
        const acceptance = document.querySelector("#acceptance-module");
        closeAcceptance(acceptance);
      }, 1500); 
});

const acceptanceSave2 = document.getElementById("saveAcceptance2");
acceptanceSave2.addEventListener("click", function () {
    var selectedOption = document.getElementById("invoice2").selectedOptions[0];
    var params = {        
        invoice: selectedOption.textContent,       
        weight: document.getElementById("acceptance_weight_2").value,       
        time: getNow()
    };
    if(params.invoice =="Izvēlieties" || params.weight == ""){
        alert("Nevar tikt saglabāts, aizpildiet laukus");
        return;
    }
    saveNewSupplie2(params);
    setTimeout(function() {        
        const acceptance = document.querySelector("#acceptance-module");
        closeAcceptance(acceptance);
      }, 1500); 
});





