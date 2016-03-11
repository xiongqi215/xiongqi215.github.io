---
layout: post
title: "Solr-Schema.xml配置"
date: 2015-11-22 17:57:14 +0800
comments: true
categories: Solr
tags:  [Solr,企业级搜索引擎,Luence]
description: Solr-Schema.xml配置
---


schema.xml位于core目录/conf/目录下，用于配置该core中的字段即字段类型，处理、分析方式。主要包括`<schema >`根节点，`<field>`字段定义以及`<fieldType>`字段类型定义组成。

<!--more-->

- **Schema根节点**：`<schema name="example" version="1.2">`

    - name：标识这个schema的名字
    - version：现在版本是1.2
   

- **Field字段定义**:`<field name="id" type="string" indexed="true" stored="true" required="true" />`

	- name：字段名称。
	
	- type：字段类型对应`<fieldType>`中的定义。
	
	- indexed：是否被用来建立索引（关系到搜索和排序）**如果该字段为主键，则indexed必须为true**
	
	- stored：是否储存
	
	-  docValues: 如果这个字段应该有文档值（doc values），设置为true。文档值在门
   面搜索，分组，排序和函数查询中会非常有用。虽然不是必须的，而且会导致生成
   索引变大变慢，但这样设置会使索引加载更快，更加NRT友好，更高的内存使用效率。
   然而也有一些使用限制：目前仅支持StrField, UUIDField和所有 Trie*Fields, 
   并且依赖字段类型, 可能要求字段为单值（single-valued）的,必须的或者有默认值。

	- required：是否必输
	
	- compressed：[false]，是否使用gzip压缩（只有TextField和StrField可以压缩）
	
	- mutiValued：是否包含多个值，可以理解为数组
	
	-  default：如果没有属性需要修改，就可以用这个标识下。
	
	- omitNorms：是否忽略掉Norm，可以节省内存空间，只有全文本field和need an - index-time boost的field需要norm。（具体没看懂，注释里有矛盾）
	
	- termVectors：[false]，当设置true，会存储 term vector。当使用   MoreLikeThis，用来作为相似词的field应该存储起来。
	
	- termPositions：存储 term vector中的地址信息，会消耗存储开销。
	
	- termOffsets：存储 term vector 的偏移量，会消耗存储开销。
	
<div class="alert alert-info" role="info">
`omitNorms`,`termVectors`,`termPositions`,`termOffsets`还不太懂什么意思。
</div>

**着重解释下`indexed`与`stored`:**

   **indexed表示需不需要建立索引，以便之后对这个field进行查询；**

   **stored表示需不需要随索引同时存储这个field本身的内容，以便查询时直接从结果中获取该内容，一般大数据（比如文件内容本身）不会和索引一起保存，节省资源，防止索引过大。** 

官方文档(5.2)中的描述：

![](http://i.imgur.com/BUvFSaY.png)
![](http://i.imgur.com/mJy7VRx.png)

- FieldType 字段了定义：这个节点想对复杂。简单的可以按如下定义
   `<fieldType name="string" class="solr.StrField" sortMissingLast="true" precisionStep="0" positionIncrementGap="0" />` 


   - name：类型名称，对应`<field>`中`type='String'`
   
   - class：类型对应的处理java类，常用的基本类型有：   `solr.StrField`、`solr.BoolField`、`solr.TrieIntField`、`solr.TrieFloatField`、`solr.TrieLongField`、`solr.TrieDoubleField`、`solr.UUIDField`
   
   - sortMissingLast和sortMissingFirst两个属性是用在可以内在使用String排序的类型上（包括：string,boolean,sint,slong,sfloat,sdouble,pdate）。
   sortMissingLast="true"，没有该field的数据排在有该field的数据之后，而不管请求时的排序规则。
   sortMissingFirst="true"，跟上面倒过来呗。


  **`precisionStep`和`positionIncrementGap`还未理解是什么意思，但是可以知道的是,****`positionIncrementGap`只对`mutiValued=ture`有意义。**


官方文档(5.2)中的描述：

![](http://i.imgur.com/lwQxUuC.png)

solr自带数据类型(官方文档):

![](http://i.imgur.com/kTLNaEe.png)
![](http://i.imgur.com/8yawFbv.png)
![](http://i.imgur.com/Dxm9a7l.png)
![](http://i.imgur.com/Kzogdcl.png)

   - **使用analyzer，tokenizer，filter自定义字段类型**
   
   - 如下：定义了一个字段，使用中文分词器
```xml
  <fieldType name="text_general" class="solr.TextField" positionIncrementGap="100">
      <analyzer type="index">
        <tokenizer class="solr.StandardTokenizerFactory"/>
        <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt" />
        <filter class="solr.LowerCaseFilterFactory"/>
      </analyzer>
      <analyzer type="query">
        <tokenizer class="solr.StandardTokenizerFactory"/>
        <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt" />
        <filter class="solr.SynonymFilterFactory" synonyms="synonyms.txt" ignoreCase="true" expand="true"/>
        <filter class="solr.LowerCaseFilterFactory"/>
      </analyzer>
    </fieldType>
```
<div class="alert alert-danger" role="alert">
  <ul>
   <li>只用 solr.TextField 这种类型的字段可以使用自定义analyzer</li>
   <li>tokenizer是分词器，其作用就将文本切分为一个个词语或单词</li>
   <li>filter是过滤器，用于过滤到文本中不需要的成分，如英文中的a,the等介词或标点符号和空格。它们需要我们制定一个txt作为过滤的依据词典，如本例中的stopwords.txt和synonyms.txt</li>
</div>


- **其它标签**

主键：`<uniqueKey>id</uniqueKey>`定义文档主键使用的字段

保留字段: `_version_`为保留字段，不得删除，每个schema中都必须有。实际上name前后带有_的字段都为保留字段。
```xml
    <field name="_version_" type="long" indexed="true" stored="true"/>
```



一份简单的`schema.xml`:
```xml
 
<?xml version="1.0" encoding="UTF-8" ?>
  <schema name="sjsmhp" version="1.5">
   <uniqueKey>id</uniqueKey>
   <field name="id" type="long" indexed="true" stored="true" multiValued="false" /> 
   <field name="name_cn" type="text_general" indexed="ture" stored="true"  />  
   <field name="name_en" type="text_general" indexed="ture" stored="true"  />  
   <field name="continents_cn" type="text_general" indexed="ture" stored="true"  />  
   <field name="continents_en" type="text_general" indexed="ture" stored="true"  />  
   <field name="en_first_letter" type="string" indexed="ture" stored="true"  /> 
   <field name="cn_first_letter" type="string" indexed="ture" stored="true"  /> 
   <field name="sort" type="int" indexed="ture" stored="false"  />  
   <field name="_version_" type="long" indexed="true" stored="true"/>
   <field name="_root_" type="string" indexed="false" stored="false"/>

   <fieldType name="string" class="solr.StrField" sortMissingLast="true" />
   <fieldType name="boolean" class="solr.BoolField" sortMissingLast="true"/>
   <fieldType name="int" class="solr.TrieIntField" precisionStep="0" positionIncrementGap="0"/>
   <fieldType name="float" class="solr.TrieFloatField" precisionStep="0" positionIncrementGap="0"/>
   <fieldType name="long" class="solr.TrieLongField" precisionStep="0" positionIncrementGap="0"/>
   <fieldType name="double" class="solr.TrieDoubleField" precisionStep="0" positionIncrementGap="0"/>

<!--中英文分词-->
<fieldType name="text_general" class="solr.TextField" positionIncrementGap="100">

  <analyzer type="index">
     <tokenizer class="solr.StandardTokenizerFactory"/>
     <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt" />
     <filter class="solr.LowerCaseFilterFactory"/>
  </analyzer>

  <analyzer type="query">
	   <tokenizer class="solr.StandardTokenizerFactory"/>
	   <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt" />
	   <filter class="solr.SynonymFilterFactory" synonyms="synonyms.txt" ignoreCase="true" expand="true"/>
	   <filter class="solr.LowerCaseFilterFactory"/>
  </analyzer>
</fieldType>

  
   <fieldType name="uuid" class="solr.UUIDField" indexed="false" />
</schema>
```