const db_setting = { outfmt: 'json', dbgroup: '_postgres' };
//################ Prepeared statement funkcijas ####################

function getAllSuppliers() {
    return new Promise(resolve => {
        runSql('suppliers_select_all', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function getAllProducts() {
    return new Promise(resolve => {
        runSql('products_select_all', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function saveGarbage(param) {
    return new Promise(resolve => {
        runSql('save_to_garbage', param, db_setting, function (result) {
        if(result.statusCode !== 200){
            console.log("Netika saglabāts");
        }
        alert("Ieraksts saglabāts!");
        resolve(result.statusCode === 200);
        });
    });
}
// ############################ darbības ar eventlisteneriem#########################//

const garbageButton = document.getElementById("addGarageWeight");

garbageButton.addEventListener("click", async function () {

    var suppliers = await getAllSuppliers();
    var products = await getAllProducts();

    const closeButton = document.getElementById("product-close-button");   
    const garbageModule = document.querySelector("#garbage-module");
    const supplie = document.querySelector("#supplier");
    const prod = document.querySelector("#product");
    const weight = document.querySelector("#weight");

    supplie.innerHTML = "";
    prod.innerHTML = "";   
    weight.value = ""; 
    
    const emptyOption = document.createElement("option");
    emptyOption.value = "0";
    emptyOption.text = "Izvēlieties";
    emptyOption.selected = true;
    supplie.add(emptyOption);
   
    const emptyOption2 = document.createElement("option");
    emptyOption2.value = "0";
    emptyOption2.text = "Izvēlieties";
    emptyOption2.selected = true;
    prod.add(emptyOption2); 

    suppliers.forEach(suppliers => {
      const option = document.createElement("option");
      option.value = suppliers.u_id;
      option.text = suppliers.label;
      supplie.add(option);
    });
    
    products.forEach(product => {
      const option = document.createElement("option");
      option.value = product.u_id;
      option.text = product.label;
      prod.add(option);
    });
    garbageModule.style.display = "flex";
    closeButton.addEventListener("click", function () {
        garbageModule.style.display = "none";
    });
});

const saveButton = document.getElementById("saveGarbage");
saveButton.addEventListener("click", function () {
    var supplier = parseInt(document.getElementById("supplier").value);
    var weight = parseFloat(document.getElementById("weight").value);
    var product = parseInt(document.getElementById("product").value);

    var param = {
        supp: supplier,
        weight: weight,
        prod: product
    }
    if(param.supp == 0 || param.weight =="" || param.prod == 0){
        alert("Nevar tikt saglabāts, aizpildiet laukus");
        return;
    }
    saveGarbage(param);
    setTimeout(function() {        
        const garbageModule = document.querySelector("#garbage-module");
        closeAcceptance(garbageModule);
      }, 1500); 
});


  


