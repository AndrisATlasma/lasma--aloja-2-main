-- products_select_all_not_deleted
select *
from products
where deleted = false;
-- products_update_product
update products
set label = '@label'
where product_id = @product_id;
-- products_insert_product
insert into products (label)
values ('@label');


-- products_delete_product
update products
set deleted = true
where product_id = @product_id;


-- partija_check_if_product_is_used
select count(*) isproductused
from partija
where stop_st is null
    and product_id = @product_id;