---
layout: post
title: "Solr-富文本索引"
date: 2015-11-30 17:57:14 +0800
comments: true
categories: Solr
tags:  [Solr,企业级搜索引擎,Luence,富文本索引]
description: Solr-富文本索引
---


Solr支持从富文本文件中，如pdf,word中抽取内容建立索引。

首先，需要配置支持这一功能的requestHandler。编辑`solrconfig.xml`,加入：
```xml
 <requestHandler name="/update/extract" 	class="solr.extraction.ExtractingRequestHandler" >  
    <lst name="defaults">
      <str name="fmap.content">content</str>
      <str name="fmap.Content-Type">Content-Type</str>
      <str name="uprefix">ignored_</str>
    </lst>
	<lst name="date.formats">
      <str>yyyy-MM-dd</str>
    </lst>
  </requestHandler>  
```
<!--more-->
**solr.extraction.ExtractingRequestHandler**就是solr中用来处理富文本的handler。为了使用这个类我们我们需要拷贝jar包：**solr-dataimporthandler-extras.jar**到lib目录，并确认**solrconfig.xml**中的lib配置包含它。

<div class="alert alert-info" role="info">
ExtractingRequestHandler底层实际是使用apache Tika进行文件内容抽取的，
</div>

**配置解释：**

- `<requestHandler name="/update/extract" class="solr.extraction.ExtractingRequestHandler" >`：其中name=`update/extract`为改request的请求路径。

- `fmap.xxx` 为从文件中抽取的内容，意见这些内容如何存储。如在这里：
```xml
   <str name="fmap.content">content</str>  <!--文件内容-->
   <str name="fmap.Content-Type">Content-Type</str> <!--文件类型-->
```
官方文档关于`fmap`的描述：
![](http://i.imgur.com/fsmATZQ.png)

意思很简单就是字段的映射。

- `uprefix` 这个配置用于将文件中其它不需要的内容统一加上指定前缀，如这里加上了ignored_。在schema.xml中有该字段与类型配置：
```xml
<dynamicField name="ignored_*" type="ignored" multiValued="true"/>
<fieldType name="ignored" stored="false" indexed="false" multiValued="true" class="solr.StrField" />
```

这是个动态字段，即所有以`ignored_`开头的字段都按`ignored`这个`type`处理。在这达到的忽略这些数据的目的。


**调用/update/extract完成文件索引**

调用/update/extrac的方式有很多种，下面介绍使用solr4j api在java工程里调用：

```java
//建立客户端连接
SolrClient client=new HttpSolrClient("http://localhost:8080/solr/core1");

//单个文件索引
public void  indexFromFile(String fileName,String id) throws Exception{
        //ContentStreamUpdateRequest 是专门用来提交文件的
		ContentStreamUpdateRequest  request=new ContentStreamUpdateRequest("/update/extract");
		String contentType="application/text";
		
		request.addFile(new File(fileName), contentType);
       //literal.xxx 文件以外的字段，xxx将直接映射到schema.xml中的同名字段
		request.setParam("literal.id", String.valueOf(id));  
		request.setParam("literal.author", author);  
		request.setParam("literal.title", tilte);  

		request.setAction(AbstractUpdateRequest.ACTION.OPTIMIZE, true, true);   
		client.request(request);
		
		client.commit();
	    
	}

public static void main(String[] args)  {
		try{
		SolrMananger client=new SolrMananger();
		client.indexFromFile("e:/apache-solr-ref-guide-5.3.pdf", 1, "Justn", "solr-ref");
		}catch(Exception e){
			e.printStackTrace();
		}
		}

```


运行后，查看solr控制台，使用query验证文件是否成功索引。
![](http://i.imgur.com/NbapUSN.png)
可以看到查询结果，且各个字段的值都与预想一样。


关于批量文件生成索引，需要注意性能问题，应做到：

原文：[http://my.oschina.net/u/1403753/blog/468439](http://my.oschina.net/u/1403753/blog/468439)

 - `client.commit();`操作应该放在最外层，即最后提交一次。
 - 不设置action。
 - 一个文件一个ContentStreamUpdateRequest对象，否则会造成contentStream递增，从而影响效率。
 
 代码如下：

```java
SolrClient client=new HttpSolrClient("http://localhost:8080/solr/core1");
ContentStreamUpdateRequest request;
for(File file:files){
    request=new ContentStreamUpdateRequest("/update/extract");
    request.addFile(new File("mailing_lists.pdf"));
    request.setParam("literal.id", "mailing_lists.pdf");
    //request.setAction(AbstractUpdateRequest.ACTION.COMMIT, true, true);//注释这行代码。
    client.request(request);
} 
client.commit();
```


schemal.xml:

```xml

<?xml version="1.0" encoding="UTF-8" ?>
<schema name="sjsmhp" version="1.5">
   <uniqueKey>id</uniqueKey>
   <field name="id" type="long" indexed="true" stored="true" required="true" multiValued="false" ></field> 
   <field name="content" type="text_general" indexed="true"  stored="true"  omitNorms="true"></field> 
   <field name="author" type="text_general" indexed="true" stored="true" ></field> 
   <field name="title" type="text_general" indexed="true" stored="true" ></field> 
   <field name="docType" type="string" indexed="true" stored="true" ></field>
   <field name="Content-Type" type="string" indexed="false" stored="true"></field> 
   <field name="last_modified" type="date" indexed="true" stored="true"  ></field>  
   <field name="_version_" type="long" indexed="true" stored="true"></field>
   <field name="_root_" type="string" indexed="true" stored="false"></field>
   <dynamicField name="ignored_*" type="ignored" multiValued="true"></dynamicField> 
    <fieldType name="string" class="solr.StrField" sortMissingLast="true" ></fieldType>
    <fieldType name="boolean" class="solr.BoolField" sortMissingLast="true"></fieldType>
    <fieldType name="int" class="solr.TrieIntField" precisionStep="0" positionIncrementGap="0" ></fieldType>
    <fieldType name="float" class="solr.TrieFloatField" precisionStep="0" positionIncrementGap="0"></fieldType>
    <fieldType name="long" class="solr.TrieLongField" precisionStep="0" positionIncrementGap="0"></fieldType>
    <fieldType name="double" class="solr.TrieDoubleField" precisionStep="0" positionIncrementGap="0"></fieldType>
    <fieldType name="date" class="solr.TrieDateField" precisionStep="0" positionIncrementGap="0"></fieldType>
   <fieldType name="ignored" stored="false" indexed="false" multiValued="true" class="solr.StrField" ></fieldType>

   <!--中英文分词-->
    <fieldType name="text_general" class="solr.TextField" positionIncrementGap="100">
      <analyzer type="index">
        <tokenizer class="solr.StandardTokenizerFactory"></tokenizer>
        <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt" ></filter>
        <filter class="solr.LowerCaseFilterFactory"></filter>
      </analyzer>
      <analyzer type="query">
        <tokenizer class="solr.StandardTokenizerFactory"></tokenizer>
        <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt" ></filter>
        <filter class="solr.SynonymFilterFactory" synonyms="synonyms.txt" ignoreCase="true" expand="true"></filter>
        <filter class="solr.LowerCaseFilterFactory"></filter>
      </analyzer>
    </fieldType>
</schema>

```