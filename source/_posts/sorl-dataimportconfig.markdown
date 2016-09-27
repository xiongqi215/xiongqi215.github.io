---
layout: post
title: "Solr-data-config.xml配置"
date: 2015-11-22 17:57:14 +0800
comments: true
categories: Solr
tags:  [Solr,企业级搜索引擎,Luence,Schema.xml,dataimport]
description: Solr-data-config.xml配置
---


data-config.xml位于core目录/conf/目录下，可用于配置从指定数据中查询数据并导入索引。
配置如下：
```xml
<dataConfig>
    <dataSource name="jdbcDataSource" type="JdbcDataSource" 
    driver="oracle.jdbc.driver.OracleDriver"
    url="jdbc:oracle:thin:@localhost:1521:orcl" 
    user="finc" password="password"/>
    <document>
        <entity dataSource="jdbcDataSource" name="country"  
        query="select * from t_base_country" >
            <field column="ID" name="id"></field>
            <field column="NAME_CN" name="nameCn"></field> 
            <field column="NAME_EN" name="nameEn"></field> 
            <field column="CONTINENTS_CN" name="continentsCn"></field>
            <field column="CONTINENTS_EN" name="continentsEn"></field>
            <field column="CN_FIRST_LETTER" name="cnFirstLetter"></field>
            <field column="EN_FIRST_LETTER" name="enFirstLetter"></field>
            <field column="SORT" name="sort"></field>
        </entity>
    </document>
  </dataConfig>
```
<!--more-->
## `dataSource`节点配置：##
- `name`: dataSource的名称，配置文件可以有多个datasource，使用name区分。
- `type`:数据源类型，如JDBC
- `driver`:数据库驱动包，去提前放到lib目录下
- `url`:数据库连接url
- `user`:数据库用户名
- `password`:数据库密码
- `<field>`字段配置：
  - `column`:数据库查询列名称
  - `name`:Schema.xml中的字段


## `doucment`节点配置 ##
`document`节点用来配置如何从数据库导入数据构建document对象,主要有一个或多个`<entity>`即实体组成。`<entity>`有如下属性：
- `name`:实体名称
- `dataSource`:dataSource名称
- `query`:获取全部数据的SQL
- `deltaImportQuery`:获取增量数据时使用的SQL
- `deltaQuery`:获取pk的SQL
- `parentDeltaQuery`:获取父Entity的pk的SQL
 




在Solr的控制台上可执行：`full-import`全导入和`delta-import`增量导入。

**Full Import工作原理：**
执行本Entity的Query，获取所有数据；
针对每个行数据Row，获取pk，组装子Entity的Query；
执行子Entity的Query，获取子Entity的数据。

**Delta Import工作原理：**
查找子Entity，直到没有为止；
执行Entity的deltaQuery，获取变化数据的pk；
合并子Entity parentDeltaQuery得到的pk；
针对每一个pk Row，组装父Entity的parentDeltaQuery；
执行parentDeltaQuery，获取父Entity的pk；
执行deltaImportQuery，获取自身的数据；
如果没有deltaImportQuery，就组装Query

**限制：**
子Entity的query必须引用父Entity的pk
子Entity的parentDeltaQuery必须引用自己的pk
子Entity的parentDeltaQuery必须返回父Entity的pk
deltaImportQuery引用的必须是自己的pk



solr自带的实例配置：
```xml
<dataConfig>
    <dataSource driver="org.hsqldb.jdbcDriver" 
      url="jdbc:hsqldb:E:/solr_home/hsqldb/ex" user="sa" />
    <document>
        <entity name="item" query="select * from item"
             deltaQuery="select id from item where last_modified > '${dataimporter.last_index_time}'">
            <field column="NAME" name="name" />

            <entity name="feature"  
                    query="select DESCRIPTION from FEATURE where ITEM_ID='${item.ID}'"
                    deltaQuery="select ITEM_ID from FEATURE where last_modified > '${dataimporter.last_index_time}'"
                    parentDeltaQuery="select ID from item where ID=${feature.ITEM_ID}">
                <field name="features" column="DESCRIPTION" />
            </entity>
            
            <entity name="item_category"
                    query="select CATEGORY_ID from item_category where ITEM_ID='${item.ID}'"
                    deltaQuery="select ITEM_ID, CATEGORY_ID from item_category where last_modified > '${dataimporter.last_index_time}'"
                    parentDeltaQuery="select ID from item where ID=${item_category.ITEM_ID}">
                <entity name="category"
                        query="select DESCRIPTION from category where ID = '${item_category.CATEGORY_ID}'"
                        deltaQuery="select ID from category where last_modified > '${dataimporter.last_index_time}'"
                        parentDeltaQuery="select ITEM_ID, CATEGORY_ID from item_category where CATEGORY_ID=${category.ID}">
                    <field column="DESCRIPTION" name="cat" />
                </entity>
            </entity>
        </entity>
    </document>    
</dataConfig>
```


**注意查询条件的写法：${..},如在本例中：**

**${dataimporter.last_index_time}  索引上次导入时间**

**${item.ID}  实体item查询结果中的ID**
