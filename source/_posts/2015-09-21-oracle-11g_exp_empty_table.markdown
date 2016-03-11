---
layout: post
title: "Oracle11g无法导出空表的问题"
date: 2015-09-21 17:57:14 +0800
comments: true
categories: Oracle
tags:  [Oracle,数据库,数据库备份,Oracle备份,Oracle11g]
description: Oracle11g无法导出空表的问题
---
最近在使用oracle exp命令导出本地数据库时出现一个奇怪问题--只能导出部分表！检查命令语句没有问题，无论如何设置owner参数或full参数都不行。同事机器和服务器上的oracle导出都是正常的，只有我本地出现这个问题，可想而知应该是版本差异问题了--我本地是oracle 11g而同事与服务器上的都是10g。

上网一查原来oracle 11g默认是不会导出空表的。因为到表为空时，oracle不会为其分配`segment`以节省空间。解决方法有两种， 一是对空表插入数据，再rollback就产生`segment`了。但这样明显很麻烦。
<!--more-->

方法二：修改 `deferred_segment_creation`参数，允许为空表分配segment。修改sql如下：
```sql
alter system set deferred_segment_creation=false; 
```

**该参数值默认是TRUE，当改为FALSE时，无论是空表还是非空表，都分配segment。<p>
需注意的是：该值设置后对以前导入的空表不产生作用，仍不能导出，只能对后面新增的表产生作用。**

正如上面所说的，修改"deferred _ segment _ creation"参数只能对后面新增的表有效，对于当前的空表需要单独设置。

先查询出所有空表：
```sql
select 'alter table '||table_name||' allocate extent;' from user_tables where num_rows=0
```

得到类似下面的结果：

![](http://i.imgur.com/15qaWnV.png) 

导出结果，并执行这些语句，完成后这些空表便可以成功导出了。
