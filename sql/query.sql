-- SQL QUERY TOOL GUIDE --
-- First click on the drop down to select a database to connect to --
-- Highlight any line of SQL statement then press Execute to query database --
-- Be aware this tool will freeze for minutes if select * from huge_SQL_record --

-- Fetch trending toc --
select * from log_toc

-- Fetch individual tag log --
-- select * from log_n --
-- Replace n based on log_toc --
select * from log_1
select * from log_2
select * from log_3

-- Fetch all alarm data --
select * from alarm

-- WARNING: This will delele all alarm -- 
delete from alarm

-- Fetch all audit data --
select * from audit

-- WARNING: This will delele all audit --
delete from audit