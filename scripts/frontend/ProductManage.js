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
            if (result.statusCode !== 200) {
                console.log("Netika saglabāts");
            }
            alert("Ieraksts saglabāts!");
            resolve(result.statusCode === 200);
        });
    });
}
// ############################ darbības ar eventlisteneriem#########################//

function JustTest() {
    console.log('Tests Veiksmīgs');
}
async function open_gabage_input() {
    var open_acceptande_data = await getAcceptenceData();
    const closeButton = document.getElementById("product-close-button");
    const garbageModule = document.querySelector("#garbage-module");
    var supplier = document.getElementById("supplier");
    supplier.innerHTML = open_acceptande_data[0].suppliers_label;
    supplier.setAttribute('suppliers_id', open_acceptande_data[0].suppliers_id)
    var product = document.getElementById("product");
    product.innerHTML = open_acceptande_data[0].product_label;
    product.setAttribute('product_id', open_acceptande_data[0].product_id);
    product.setAttribute('income_series', open_acceptande_data[0].income_series);
    const weight = document.querySelector("#weight");
    weight.value = "0";
    garbageModule.style.display = "flex";
    closeButton.addEventListener("click", function () {
        garbageModule.style.display = "none";
    });
}

const saveButton = document.getElementById("saveGarbage");
function waitForButtonClick() {
    return new Promise((resolve) => {
        const handleClick = () => {
            var weight = parseFloat(document.getElementById("weight").value);
            var param = {
                weight: weight,
                income_series: document.getElementById("product").getAttribute('income_series')
            };
            if (param.weight === 0) {
                alert("Ražošanas atbiras nevar būt 0 ");
                reject(new Error("Lauki nav aizpildīti"));
                return;
            }
            console.log(param);
            saveGarbage(param);
            setTimeout(function () {
                const garbageModule = document.querySelector("#garbage-module");
                closeAcceptance(garbageModule);
                resolve(true); // Resolve, kad darbība veikta veiksmīgi
            }, 1500);
            resolve();
            saveButton.removeEventListener('click', handleClick); // Noņemam notikuma klausītāju pēc izpildes.
        };
        const closeButton = document.getElementById("product-close-button");
        closeButton.addEventListener("click", function () {
            saveButton.removeEventListener('click', handleClick);
            //garbageModule.style.display = "none";
        });
        saveButton.addEventListener('click', handleClick);
    });
}