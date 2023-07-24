select * from al_kwh;
insert into al_kwh (kwh) values (5); 
SELECT max(kwh) - min(kwh) as delta from al_kwh where date_trunc('day', log_st) between '03/26/2021' and '03/27/2021';
SELECT * from al_partija where date_trunc('day', start_st) between '03/26/2021' and '03/27/2021';
select * from al_products;
insert into al_weight2 (product_id, partija_id, weight) values (1, 'partija_2',1);
select * from al_weight2;
delete from al_weight2 where measurement_id=3;

select * from al_partija;
select * from al_weight1;
insert into al_weight1 (product_id, partija_id, weight) values (1, 'partija_2',2);


select * from al_products;
delete from al_sampler;

select * from al_sampler;



select product_name, sub5.partija_id, in_weight, svars_pec_lob, svars_atkritumi, in_weight-svars_pec_lob zudumi, paraugu_daudzums from (
    select product_name, sub3.partija_id, in_weight, svars_pec_lob, paraugu_daudzums from (
        select label as product_name, sub2.partija_id, in_weight from (
            select * from 
                (select sum(in_weight) in_weight, partija_id, product_id from al_partija where partija_id = 'partija_3' group by product_id, partija_id) sub1 
            join al_products on al_products.product_id = sub1.product_id
        ) sub2 
    ) sub3 join(select sum(weight) svars_pec_lob, count(*) paraugu_daudzums, partija_id from al_weight1 where partija_id='partija_3' group by partija_id) sub4 on sub4.partija_id=sub3.partija_id
) sub5 join(select sum(weight) svars_atkritumi, partija_id from al_weight2 where partija_id='partija_3' group by partija_id) sub6 on sub5.partija_id=sub6.partija_id;


select product_name, sub5.partija_id, in_weight_sum, svars_pec_lob, svars_atkritumi, in_weight_sum-svars_pec_lob zudumi, paraugu_daudzums from (
    select product_id, sub3.partija_id, in_weight_sum, product_name, svars_pec_lob, paraugu_daudzums from (
        select sub1.product_id, partija_id, in_weight_sum, product_name from (
            select product_id, partija_id, sum(in_weight) in_weight_sum, tank from (
                select * from al_partija where date_trunc('day', start_st) between '03/25/2021' and '03/26/2021'
            ) sub0 group by id, product_id, partija_id, tank order by product_id asc
        ) sub1 join (select label as product_name, product_id from al_products) sub2 on sub1.product_id = sub2.product_id
    ) sub3 join (select sum(weight) svars_pec_lob, count(*) paraugu_daudzums, partija_id from al_weight1 group by partija_id) sub4 on sub3.partija_id=sub4.partija_id
) sub5 join (select sum(weight) svars_atkritumi, partija_id from al_weight2 group by partija_id) sub6 on sub5.partija_id=sub6.partija_id;

select * from work_time;

insert into work_time (main_counter, uzlade_izlade, priekstirisana, lobisana)
values (20,17,15,14);


SELECT max(main_counter) - min(main_counter) as main_counter from work_time 
where date_trunc('day', log_st) between '03/26/2021' and '03/30/2021';

select max(s1.main_counter)-min(s1.main_counter) as main_counter,
max(s1.uzlade_izlade)-min(s1.uzlade_izlade) as uzlade_izlade,
max(s1.priekstirisana)-min(s1.priekstirisana) as priekstirisana,
max(s1.lobisana)-min(s1.lobisana) as lobisana from (
    select * from work_time 
    where (date_trunc('day', log_st) between '03/26/2021' and '03/30/2021') and main_counter is not null
    order by log_st desc limit 2
) s1;

update work_time set main_counter=25, lobisana=13 where id=3;