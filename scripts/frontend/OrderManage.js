
//################ Prepeared statement funkcijas ####################

function getAllSilos() {
    return new Promise(resolve => {
        runSql('silos_get_all', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function getAllBunker() {
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
function saveOrder(param) {
    return new Promise(resolve => {
        runSql('save_to_orders', param, db_setting, function (result) {
            console.log(result.statusCode);
            if (result.statusCode !== 200) {
            }
            alert("Ieraksts saglabāts!");
            resolve(result.statusCode === 200);
        });
    });
}
function saveBigB(param) {
    return new Promise(resolve => {
        runSql('save_bigBox_data', param, db_setting, function (result) {
            console.log(result.statusCode);
            if (result.statusCode !== 200) {
            }
            alert("Ieraksts saglabāts!");
            resolve(result.statusCode === 200);
        });
    });
}
function getProduct() {
    return new Promise(resolve => {
        runSql('products_select_all', {}, db_setting, function (result) {
            console.log(result.statusCode);
            if (result.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(result.responseJson);
        });
    });
}

const OrderCreate = document.getElementById("createOrder");

var WorkFromSilos = document.getElementById('silosBtn');
var WorkFromIelade = document.getElementById('ielade');
var WorkFromBigBag = document.getElementById('big_bag');

OrderCreate.addEventListener("click", async function () {
    var silosFromBD = await getAllSilos();
    var bunkerFromBD = await getAllBunker();
    var products = await getProduct();
    var suppliers = await getAllSuppliers();

    const closeButton = document.getElementById("order-close-button");
    const orderModule = document.querySelector("#order-module");

    const silos = document.getElementById("silos");
    const bunker = document.getElementById("bunker");
    const label = document.getElementById("order");
    const prod = document.getElementById("orderProduct");
    const supplier = document.getElementById("suppliers");
    const FullWeigt = document.getElementById("fullWeight");
    const BigBagInvoice = document.getElementById("invoice");

    prod.innerHTML = "";
    label.value = "";
    silos.innerHTML = "";
    bunker.innerHTML = "";
    supplier.innerHTML = "";
    FullWeigt.value = "";
    BigBagInvoice.value = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = 0;
    emptyOption.text = "Izvēlieties";
    emptyOption.selected = true;
    silos.add(emptyOption);

    const emptyOption2 = document.createElement("option");
    emptyOption2.value = 0;
    emptyOption2.text = "Izvēlieties";
    emptyOption2.selected = true;
    supplier.add(emptyOption2);

    const emptyOption3 = document.createElement("option");
    emptyOption3.value = 0;
    emptyOption3.text = "Izvēlieties";
    emptyOption3.selected = true;
    prod.add(emptyOption3);
    
    products.forEach(element=>{
        const option = document.createElement("option");
        option.value = element.u_id;
        //option.dataset.product = element.product_id;
        option.text = element.label;
        //console.log(element.label);
        prod.add(option);

    })

    silosFromBD.forEach(element => {
        const option = document.createElement("option");
        option.value = element.u_id;
        option.dataset.product = element.product_id;
        option.text = element.silos + " (" + element.product + ", " + element.act_weight + " kg) ";
        silos.add(option);
    });
    suppliers.forEach(element => {
        const option = document.createElement("option");
        option.value = element.u_id;
        option.dataset.supplier = element.u_id;
        option.text = element.label;
        supplier.add(option);
    });


    if (!bunkerFromBD) {
        const option = document.createElement("option");
        option.text = "Bunkuri ir aiņemti";
        option.value = 0;
        option.disabled = true;
        option.selected = true;
        bunker.add(option);
    } else {
        const emptyOption2 = document.createElement("option");
        emptyOption2.value = 0;
        emptyOption2.text = "Izvēlieties";
        emptyOption2.selected = true;
        bunker.add(emptyOption2);
        bunkerFromBD.forEach(element => {
            const option = document.createElement("option");
            option.value = element.u_id;
            option.text = element.label;
            bunker.add(option);
        });
    }
    orderModule.style.display = "flex";

    closeButton.addEventListener("click", function () {
        orderModule.style.display = "none";
    });
});

const orderSave = document.getElementById("saveOrder");

orderSave.addEventListener("click", async function () {
    var order_label = document.getElementById("order").value;
    var silos_id = document.getElementById("silos").value;
    var bunker_nr = document.getElementById("bunker").value;
    var product_id = parseInt(document.getElementById("silos").options[document.getElementById("silos").selectedIndex].dataset.product);
    const orderModule = document.querySelector("#order-module");
    var Ielade_prod_id = parseInt(document.getElementById("orderProduct").value);
    var route_name = "S" + silos_id + "_BU" + bunker_nr + "";
    var supplier_id = parseInt(document.getElementById("suppliers").value) 
    //var supplier_id = parseInt(document.getElementById("suppliers").options[document.getElementById("suppliers").selectedIndex].dataset.supplier);
    var fullWeight = parseInt(document.getElementById("fullWeight").value);
    const BigBagInvoice = document.getElementById("invoice");
    if(WorkFromSilos.classList.contains('active')){

        var param = {
            route_name: route_name,
            order_label: order_label,
            silos_id: silos_id,
            bunker_nr: bunker_nr,
            product_id: product_id
        }
        if (param.silos_id == 0 || param.order_label == "" || param.bunker_nr == 0) {
            alert("Nevar tikt saglabāts, aizpildiet laukus");
            return;
        }
        //console.log(param);
        saveOrder(param);
    }
    if(WorkFromIelade.classList.contains('active')){
        var route_name = "CC6301_CLNR_BU" + bunker_nr + "";        
        var param = {
            route_name: route_name,
            order_label: order_label,
            silos_id: null,
            bunker_nr: bunker_nr,
            product_id: Ielade_prod_id
        }
        if (param.silos_id == 0 || param.order_label == "" || param.bunker_nr == 0) {
            alert("Nevar tikt saglabāts, aizpildiet laukus");
            return;
        }
        //console.log(param);
        saveOrder(param);
    }
    if(WorkFromBigBag.classList.contains('active')){
        console.log('BigBag');
        var supp = await getAllSuppliers();
        //console.log(supp);


        var param = {
            route_name: "BigBag",
            order_label: order_label,
            silos_id: 999,
            bunker_nr: bunker_nr,
            product_id: Ielade_prod_id
        }

        var parameter_to_siloData = {
            silos: 999,
            prod: Ielade_prod_id,
            weight_1: fullWeight,
            weight_2: 0,
            supp:supplier_id,
            invoice: BigBagInvoice.value,
            weight2_tmst: getNow()
        }
        
        
        if (order_label == "" ||BigBagInvoice.value == "" || supplier_id == 0 || Ielade_prod_id == 0 || isNaN(fullWeight) || param.bunker_nr == 0) {
            alert("Nevar tikt saglabāts, aizpildiet laukus");
            return;
        }
        saveOrder(param);   
        saveBigB(parameter_to_siloData);   

    }

    setTimeout(function () {
        closeAcceptance(orderModule);
    }, 1500);
});

WorkFromSilos.addEventListener("click", function() {
    var ieladeCointainer = document.getElementById('order_container_1');
    ieladeCointainer.classList.remove('containerHide');
    WorkFromSilos.classList.add('active')
    WorkFromIelade.classList.remove('active');
    WorkFromBigBag.classList.remove('active');
    var silosCointainer = document.getElementById('order_container_2');
    silosCointainer.classList.remove('containerShow');
    silosCointainer.classList.add('containerHide');
    var bigBagCointainer = document.getElementById('order_container_3');
    bigBagCointainer.classList.remove('containerShow');
    bigBagCointainer.classList.add('containerHide');
    var bigBagWeight = document.getElementById('order_container_4');
    bigBagWeight.classList.remove('containerShow');
    bigBagWeight.classList.add('containerHide');
    var bigBagInvoice = document.getElementById('order_container_5');
    bigBagInvoice.classList.remove('containerShow');
    bigBagInvoice.classList.add('containerHide');
});

WorkFromIelade.addEventListener("click", function() {
    var silosCointainer = document.getElementById('order_container_1');
    silosCointainer.classList.add('containerHide');
    WorkFromSilos.classList.remove('active')
    WorkFromIelade.classList.add('active');
    WorkFromBigBag.classList.remove('active');
    var ieladeCointainer = document.getElementById('order_container_2');
    ieladeCointainer.classList.add('containerShow');
    var bigBagCointainer = document.getElementById('order_container_3');
    bigBagCointainer.classList.remove('containerShow');
    bigBagCointainer.classList.add('containerHide');
    var bigBagWeight = document.getElementById('order_container_4');
    bigBagWeight.classList.remove('containerShow');
    bigBagWeight.classList.add('containerHide');
    var bigBagInvoice = document.getElementById('order_container_5');
    bigBagInvoice.classList.remove('containerShow');
    bigBagInvoice.classList.add('containerHide');
});
WorkFromBigBag.addEventListener("click", function() {
    var silosCointainer = document.getElementById('order_container_1');
    silosCointainer.classList.add('containerHide');
    WorkFromSilos.classList.remove('active')
    WorkFromIelade.classList.remove('active');
    WorkFromBigBag.classList.add('active');
    var ieladeCointainer = document.getElementById('order_container_2');
    ieladeCointainer.classList.add('containerShow');
    var bigBagCointainer = document.getElementById('order_container_3');
    bigBagCointainer.classList.add('containerShow');
    var bigBagWeight = document.getElementById('order_container_4');
    bigBagWeight.classList.add('containerShow');
    var bigBagInvoice = document.getElementById('order_container_5');
    bigBagInvoice.classList.add('containerShow');
});





