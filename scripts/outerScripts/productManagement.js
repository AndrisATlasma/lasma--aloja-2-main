async function loadTable() {
    // deleting previous table rows
    $("#saraksts tbody tr").remove();
    // gettings array of products from the DB
    const productsArray = await ps_products_select_all_not_deleted();
    if (!productsArray) return alert("Izskatās, ka bāzē nav produktu.");

    // generating table HTML content and appending it to the page
    const productsTableHtml = productsArray.map(product => `<tr data-productid="${product.u_id}"><td><input type="text" value="${product.label}" autocomplete="off" data-specific='long'></td><td><button data-action="saglabat">Saglabāt</button></td><td><button data-action="dzest">Dzēst</button></td></tr>`).join("");
    $("#saraksts tbody").append(productsTableHtml);
}

$(document).ready(function () {
    loadTable();

    $(document.body).on('click', '[data-action="saglabat"]', async function () {
        const product_id = this.closest('tr').dataset.productid;
        const label = this.closest('tr').querySelector("input").value;
        await ps_products_update_product(label, product_id);
        alert("Iestatījumi tika saglabāti!");
    });

    $(document.body).on('click', '[data-action="dzest"]', async function () {
        const product_id = this.closest('tr').dataset.productid;
        const label = this.closest('tr').querySelector("input").value;
        const dbAnswer = await ps_partija_check_if_product_is_used(product_id);
        if (!dbAnswer) return;

        const { isproductused: isProductUsed } = dbAnswer[0];
        // can not delete a product being used
        if (isProductUsed === 1) return alert(`Nav iespējams dzēst produktu: ${label}.`);

        // → the product can be deleted (is not used) ←
        if (window.confirm(`Vai Jūs gribat dzēst produktu ${label}?`)) {
            await ps_products_delete_product(product_id);
            setTimeout(() => { location.reload(); }, 3000);
        };
    });

    $(document.body).on('click', "#atjaunot", function () { location.reload(); });

    function triggerIzveidoshanasPogasClick(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("izveidotJaunu").click();
        };
    };
    // <<< добавляем возможность создания через кнопку Enter >>>
    const initialNameInput = document.getElementById('newName');
    initialNameInput.addEventListener("keyup", function (event) { triggerIzveidoshanasPogasClick(event); });


    $(document.body).on('click', "#izveidotJaunu", async function () {
        let inputValue = document.getElementById('newName').value;
        if (inputValue.length === 0) return alert('Netika ievadīts produkta nosaukums!');

        // → proper name - can create a product ←
        await ps_products_insert_product(inputValue);
        setTimeout(() => { location.reload(); }, 3000);
    });
});