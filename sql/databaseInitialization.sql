-- creating table to store products
create table al_products (
    product_id serial,
    label varchar,
    deleted boolean default false
);
-- creating table to store "partija" info
create table al_partija (
    id serial,
    product_id numeric,
    start_st timestamptz default CURRENT_TIMESTAMP,
    stop_st timestamptz,
    user_name varchar,
    partija_id varchar,
    in_weight numeric,
    tank numeric,
    in_use boolean default false;
);
-- crating table to store the sampler data
create table al_sampler(
    sample_id serial,
    sampler_id numeric,
    partija_id varchar,
    product_id numeric,
    start_time timestamptz default CURRENT_TIMESTAMP,
    stop_time timestamptz
);
 
-- creating table to store weights
create table al_weight1(
    measurement_id serial,
    product_id numeric,
    partija_id varchar,
    user_name varchar,
    weight numeric
);
create table al_weight2(
    measurement_id serial,
    product_id numeric,
    partija_id varchar,
    user_name varchar,
    weight numeric
);


-- creating table for energy consumption data
create table al_kwh(
    id serial,
    log_st timestamptz default CURRENT_TIMESTAMP,
    kwh numeric
);


-- creating table for work time data
create table work_time(
    id serial,
    log_st timestamptz default CURRENT_TIMESTAMP,
    main_counter numeric,
    uzlade_izlade numeric,
    priekstirisana numeric,
    lobisana numeric
);