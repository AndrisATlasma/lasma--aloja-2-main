const db_setting = { outfmt: 'json', dbgroup: '_postgres' };

function ps_tags_select_all() {
    return new Promise(resolve => {
        runSql('tags_select_all', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function ps_products_select_all_not_deleted() {
    return new Promise(resolve => {
        runSql('products_select_all_not_deleted', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function ps_suppliers_select_all_not_deleted() {
    return new Promise(resolve => {
        runSql('suppliers_select_all_not_deleted', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function ps_products_update_product(label, product_id) {
    return new Promise(resolve => {
        // update products set label='@label' where product_id=@product_id;
        console.log(label, product_id);
        runSql('products_update_product', { label, product_id }, db_setting, function (results) {
            resolve(results.statusCode === 200);
        });
    });
};
function ps_supplier_update_(label, suplier_id) {
    return new Promise(resolve => {
        // update products set label='@label' where product_id=@product_id;
        runSql('supplier_update', { label, suplier_id }, db_setting, function (results) {
            resolve(results.statusCode === 200);
        });
    });
};
function ps_products_insert_product(label) {
    return new Promise(resolve => {
        // insert into products (label) values ('@label');
        runSql('products_insert_product', { label }, db_setting, function (results) {
            resolve(results.statusCode === 200);
        });
    });
};
function ps_supplier_insert_(label) {
    return new Promise(resolve => {
        // insert into products (label) values ('@label');
        runSql('supplier_inserts', { label }, db_setting, function (results) {
            resolve(results.statusCode === 200);
        });
    });
};
function ps_products_delete_product(product_id) {
    return new Promise(resolve => {
        // update products set deleted=true where product_id=@product_id;
        runSql('products_delete_product', { product_id }, db_setting, function (results) {
            resolve(results.statusCode === 200);
        });
    });
};
function ps_supplier_delete(product_id) {
    return new Promise(resolve => {
        // update products set deleted=true where product_id=@product_id;
        runSql('suppliers_delete', { product_id }, db_setting, function (results) {
            resolve(results.statusCode === 200);
        });
    });
};
function ps_partija_check_if_product_is_used(product_id) {
    return new Promise(resolve => {
        // select count(*) isproductused from partija where stop_st is null and product_id = @product_id;
        runSql('partija_check_if_product_is_used', { product_id }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca. statusCode:${results.statusCode}`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function ps_partija_check_if_are_active() {
    return new Promise(resolve => {
        // select * from partija where stop_st is null;
        runSql('partija_check_if_are_active', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nav aktīvo partiju`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function ps_partija_select_active_partijas() {
    return new Promise(resolve => {
        runSql('partija_select_active_partijas', {}, db_setting, function (results) {
            if (results.statusCode !== 200) resolve(false);
            resolve(results.responseJson);
        });
    });
};
function ps_partija_stop_pienemsana() {
    return new Promise(resolve => {
        // update partija set stop_st = CURRENT_TIMESTAMP where stop_st is null;
        runSql('partija_stop_pienemsana', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca. statusCode:${results.statusCode}`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function ps_partija_start_pienemsana({ product_id, user_name, partija_id, in_weight, tank }) {
    return new Promise(resolve => {
        // insert into partija (product_id, start_st, user_name, partija_id, in_weight, tank) values (@product_id, CURRENT_TIMESTAMP, '@user_name', '@partija_id', @in_weight, '@tank');
        runSql('partija_start_pienemsana', { product_id, user_name, partija_id, in_weight, tank }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca. statusCode:${results.statusCode}`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function ps_partija_select_last_by_tank(tank) {
    return new Promise(resolve => {
        // select * from (select * from partija where tank='@tank' order by start_st desc limit 1) subq inner join products on products.product_id = subq.product_id;
        runSql('partija_select_last_by_tank', { tank }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca: statusCode:${results.statusCode}`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function ps_kwh_select_delta_in_period(from, to) {
    return new Promise(resolve => {
        // SELECT max(kwh) - min(kwh) as delta from al_kwh where date_trunc('day', log_st) between '@from' and '@to';
        runSql('kwh_select_delta_in_period', { from, to }, db_setting, function (results) {
            if (results.statusCode !== 200) {
                console.info(`Nesanāca. statusCode:${results.statusCode}`);
                resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};
function ps_routes_select_active() {
    return new Promise(resolve => {
        runSql('routes_select_active', {}, db_setting, function (results) {
            if (results.statusCode !== 200) {
                /* console.info(`Nesanāca. statusCode:${results.statusCode}`); */ resolve(false);
            }
            resolve(results.responseJson);
        });
    });
};


function ps_elements_select_all() {
    return new Promise(resolve => {
        runSql('elements_select_all', {}, db_setting, function (results) {
            if (results.statusCode !== 200) resolve(false);
            resolve(results.responseJson);
        });
    });
};

function ps_routes_select_all_used_id_asc() {
    return new Promise(resolve => {
        runSql('routes_select_all', {}, db_setting, function (results) {
            if (results.statusCode !== 200) resolve(false);
            resolve(results.responseJson);
        });
    });
};

function ps_partija_continue_pienemsana({ id, tank }) {
    return new Promise(resolve => {
        runSql('partija_continue_pienemsana', { id, tank }, db_setting, function (results) {
            resolve(results.statusCode === 200)
        });
    });
};
function ps_partija_check_if_tank_is_not_empty(tank) {
    return new Promise(resolve => {
        runSql('partija_check_if_tank_is_not_empty', { tank }, db_setting, function (results) {
            if (results.statusCode !== 200) resolve(false);
            resolve(results.responseJson);
        });
    });
};
function ps_partija_select_in_use(tank) {
    return new Promise(resolve => {
        runSql('partija_select_in_use', {}, db_setting, function (results) {
            if (results.statusCode !== 200) resolve(false);
            resolve(results.responseJson);
        });
    });
};

function ps_partija_select_tank_is_not_empty() {
    return new Promise(resolve => {
        runSql('partija_select_tank_is_not_empty', {}, db_setting, function (results) {
            if (results.statusCode !== 200) resolve(false);
            resolve(results.responseJson);
        });
    });
};

function ps_partija_update_is_not_empty(tank) {
    return new Promise(resolve => {
        runSql('partija_update_is_not_empty', { tank }, db_setting, function (results) {
            resolve(results.statusCode === 200);
        });
    });
};
function ps_partija_update_in_use(tank, is_used) {
    return new Promise(resolve => {
        runSql('partija_update_in_use', { tank, is_used }, db_setting, function (results) {
            resolve(results.statusCode === 200);
        });
    });
};
// function ps_partija_check_in_use(tank) {
//     return new Promise(resolve => {
//         runSql('partija_update_in_use', { tank, is_used }, db_setting, function (results) {
//             resolve(results.statusCode === 200);
//         });
//     });
// };