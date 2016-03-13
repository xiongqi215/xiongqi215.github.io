---
layout: post
title: "Oracle数据导出导入"
date: 2015-09-15 17:57:14 +0800
comments: true
categories: Oracle
keywords:  Oracle,数据库,数据库备份,Oracle备份
description: Oracle数据导出导入
---




- 使用exp命令数据导出
```bash
      ##完全： 
          EXP SYSTEM/MANAGER BUFFER=64000 FILE=C:\FULL.DMP FULL=Y 
       如果要执行完全导出，必须具有特殊的权限 

     ##用户模式： 导出指定用户的所有表，OWNER参数用来指定用户
          EXP SONIC/SONIC    BUFFER=64000 FILE=C:\SONIC.DMP OWNER=SONIC 
         
      ##表模式：导出指定用户的指定表 OWNER参数指定用户，TABLES指定表，多个用逗号隔开
          EXP SONIC/SONIC    BUFFER=64000 FILE=C:\SONIC.DMP OWNER=SONIC TABLES=(SONIC)
        
      ##参数full=y表示导出整个数据库，如果不指定默认导出所有当前链接用户下的对象 
```



- 使用imp命令数据导入
```bash
      ##完全： 
          IMP SYSTEM/MANAGER BUFFER=64000 FILE=C:\FULL.DMP FULL=Y 

      ##用户模式： 将用户sonic的对象导入到用户sonic下
          IMP SONIC/SONIC    BUFFER=64000 FILE=C:\SONIC.DMP FROMUSER=SONIC TOUSER=SONIC 
         
      ##表模式： 
          EXP SONIC/SONIC    BUFFER=64000 FILE=C:\SONIC.DMP OWNER=SONIC TABLES=(SONIC) 
         
```

<!--more-->

# 2015-10-12更新 #
# exp 与 imp 性能调优 #
## 一、Exp调优 ##

1.使用DIRECT和RECORDLENGTH选项

DIRECT参数定义了导出是使用直接路径方式(DIRECT=Y)，还是常规路径方式(DIRECT=N)。常规路径导出使用SQL SELECT语句从表中抽取数据，直接路径导出则是将数据直接从磁盘读到PGA再原样写入导出文件，从而避免了SQL命令处理层的数据转换过程，大大提高了导出效率。在数据量大的情况下，直接路径导出的效率优势更为明显，可比常规方法速度提高三倍之多。

和DIRECT=Y配合使用的是RECORDLENGTH参数，它定义了Export I/O缓冲的大小，作用类似于常规路径导出使用的BUFFER参数。建议设置RECORDLENGTH参数为最大I/O缓冲，即65535(64kb)。其用法如下：
```bash
exp userid=system/manager full=y direct=y recordlength=65535 file=
exp_full.dmp log=exp_full.log
```
直接路径导出根据Oracle版本不同，有一些使用限制。比较重要的限制有，8i及以下版本不支持导出客户端和数据库的字符集转换，因此导出前必须保证NLS_LANG设置正确;8.1.5及以下版本不支持导出含LOBs对象的表;不能使用QUERY参数等。

2.使用管道技术

管道是从一个程序进程向另一个程序进程单向传送信息的技术。通常，管道把一个进程的输出传给另一进程作为输入。如果导出的数据量很大，可以利用管道直接生成最终的压缩文件，所耗费的时间和不压缩直接导出的时间相当。这样一来，不仅能够解决磁盘空间不足的问题，而且省去了单独压缩文件的时间;如果需要传输导出文件，还可以减少网络传输的时间。比如，一个10G的文件单独压缩可能需要半小时以上的时间。虽然管道技术不能够直接缩短Exp/Imp本身的时间，但节省出来的压缩时间非常可观。管道和Exp结合的具体使用方法如下：

导出数据示例：
```bash
% mknod /tmp/exp_pipe p # Make the pipe
% compress < /tmp/exp_pipe > export.dmp.Z & # Background compress
% exp file=/tmp/exp_pipe # Export to the pipe
```

## 二、Imp调优 ##

Oracle Import进程需要花比Export进程数倍的时间将数据导入数据库。某些关键时刻，导入是为了应对数据库的紧急故障恢复。为了减少宕机时间，加快导入速度显得至关重要。没有特效办法加速一个大数据量的导入，但我们可以做一些适当的设定以减少整个导入时间。

1.使用管道技术

前面已经说明了Exp时如何使用管道，在导入时管道的作用是相同，不仅能够解决磁盘空间不足的问题，而且省去了单独解压缩文件的时间。在大数据量导入导出的时候，推荐一定要使用管道。

导入数据示例：

```bash
% mknod /tmp/imp_pipe p # Make the pipe
% uncompress < export.dmp.Z > /tmp/imp_pipe & # Background uncompress
% imp file=/tmp/imp_pipe # Import from the pipe
```

2.避免I/O竞争

Import是一个I/O密集的操作，避免I/O竞争可以加快导入速度。如果可能，不要在系统高峰的时间导入数据，不要在导入数据时运行job等可能竞争系统资源的操作。

3.增加排序区

Oracle Import进程先导入数据再创建索引，不论INDEXES值设为YES或者NO，主键的索引是一定会创建的。创建索引的时候需要用到排序区，在内存大小不足的时候，使用临时表空间进行磁盘排序，由于磁盘排序效率和内存排序效率相差好几个数量级。增加排序区可以大大提高创建索引的效率，从而加快导入速度。

8i及其以下版本：导入数据前增加数据库的sort_area_size大小，可设为正常值的5-10倍。但这个值设定会影响到所有会话，设的过高有可能导致内存不足出现paging, swapping现象。更为稳妥的方法是，对于大表和索引特别多的表，只导数据不导索引。导完数据后，创建一个会话，设定当前会话的sort_area_size一个足够大的值，再手工创建索引。

9i：在workarea_size_policy=AUTO的情况下，所有会话的UGA共用pga_aggregate_target定义的内存，不必单独设定sort_area_size。导入数据前增加pga_aggregate_target大小，如果机器内存够大，可从通常设定的500M提高到1-2G。pga_aggregate_target大小可以动态调整，导入完成后可在线调回原值。

4.调整BUFFER选项

Imp参数BUFFER定义了每一次读取导出文件的数据量，设的越大，就越减少Import进程读取数据的次数，从而提高导入效率。BUFFER的大小取决于系统应用、数据库规模，通常来说，设为百兆就足够了。其用法如下：
```bash
imp user2/pwd fromuser=user1 touser=user2 file=/tmp/imp_db_pipe1 commi
t=y feedback=10000 buffer=10240000
```

5.使用COMMIT=Y选项

COMMIT=Y表示每个数据缓冲满了之后提交一次，而不是导完一张表提交一次。这样会大大减少对系统回滚段等资源的消耗，对顺利完成导入是有益的。

6.使用INDEXES=N选项

前面谈到增加排序区时，说明Imp进程会先导入数据再创建索引。导入过程中建立用户定义的索引，特别是表上有多个索引或者数据表特别庞大时，需要耗费大量时间。某些情况下，需要以最快的时间导入数据，而索引允许后建，我们就可以使用INDEXES=N 只导入数据不创建索引，从而加快导入速度。

我们可以用INDEXFILE选项生成创建索引的DLL脚本，再手工创建索引。我们也可以用如下的方法导入两次，第一次导入数据，第二次导入索引。其用法如下：
```bash
imp user2/pwd fromuser=user1 touser=user2 file=/tmp/imp_db_pipe1 commit=y feed
back=10000 buffer=10240000 ignore=y rows=y indexes=n
imp user2/pwd fromuser=user1 touser=user2 file=/tmp/imp_index_pipe1 comm
it=y feedback=10000 buffer=10240000 ignore=y rows=n indexes=y
```
7.增加LARGE_POOL_SIZE

如果在init.ora中配置了MTS_SERVICE，MTS_DISPATCHERS等参数，tnsnames.ora中又没有(SERVER=DEDICATED)的配置，那么数据库就使用了共享服务器模式。在MTS模式下，Exp/Imp操作会用到LARGE_POOL，建议调整LARGE_POOL_SIZE到150M。

检查数据库是否在MTS模式下：
```bash
SQL>select distinct server from v$session;
```

如果返回值出现none或shared，说明启用了MTS。