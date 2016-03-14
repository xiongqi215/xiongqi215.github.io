---
layout: post
title: "Solr环境搭建"
date: 2015-11-22 17:57:14 +0800
comments: true
categories: Solr
tags:  [Solr,企业级搜索引擎,Luence]
description: Solr环境搭建
---

# Solr安装 #
总结下solr环境的部署步骤。

Solr非常易于安装，我们只要从官网下载他的工程报，准备一个servlet容器，如tomcat,jetty都可以。
这里已tomcat为例子。步骤如下

- 获取solr.war，部署到tomcat

- 由于solr.war中有jar包缺失，故而第一次启动不能成功。将solr解压后`\server\lib\ext`中所有jar包拷贝到项目`/WEB-INF/lib`下。
<!--more-->
 - 配置solr-home。solr-home是放置solr核心core的地方，core可以简单理解为数据库中实例。该目录可以随便定义自己创建，创建后，将solr根目录 `server\solr` 中solr.xml复制到你的solr-home目录下。
 修改`web.xml` 增加如下一段：

```xml
   <env-entry>
     <env-entry-name>solr/home</env-entry-name> 
     <env-entry-value>E:\solr_home</env-entry-value> 
     <env-entry-type>java.lang.String</env-entry-type> 
   </env-entry>    
```
其中env-entry-value为你的solr-home路径，再次启动tomcat 访问'http://localhost:8080/solr'成功出现solr的控制台。 
![](http://i.imgur.com/uiQaQba.png)

环境搭建基本完成！ 

# solr-home配置 #

solr-home为solr的核心，我们90%对的开发工作都将在这里进行。首先solr-home的目录结构有若干个core的文件夹和solr.xml组成。关键的配置为core。在solr根目录`example`文件下可以找到相关例子。

- 复制solr根目录下 `\example\example-DIH\solr\solr\` 文件夹到solr-home中 

- 新建lib目录，并将solr根目录下 `\dist` 下如下jar包复制到lib中 

![](http://i.imgur.com/686UdNO.png)

- 修改`conf/solrconfig.xml`。将jar包引入配置：

![](http://i.imgur.com/yqx2ifa.png)


- 修改为：

```xml
<lib dir="./lib" regex=".*\.jar"/>
</pre>
```

- 启动tomcat，进入solr控制，可以在左边看到刚才新建的core

![](http://i.imgur.com/tbRhQra.png)



- 点击进入后，左侧出现所以操作，包括收索( `query` ),文档(`document`),数据导入(`dataimport`)


![](http://i.imgur.com/DMMLLFH.png)

solr可以对多个core进行综合管理，并接受请求选择特定的一个或者多个core执行相关任务。

core的主要结构包括一个存储数据的`Data`文件夹、一个放置配置文件的`conf`文件夹。最主要的配置文件是：`solrconfig.xml`和`schema.xml`。

`solrconfig.xml`从整体上对core进行了配置，例如索引的存放路径、字段的最大长度（`maxFiedlLength`）、写锁的超时时间（`writeLockTimeout`）、锁类型（`lockType`）、是否压缩索引（`useCompoundFile`）、内存索引缓冲区大小（`ramBufferSizeMB`）、合并因子（`mergeFactor`）、删除策略、自动提交策略、缓存设置等，它好比是一份组装机器人的说明书，里面详细描述了各个部件（handler）的参数。

`schema.xml`主要是对索引的配置，例如分词器、字段名称+索引方法+存储方式+分词方式、唯一标识字段等，它好比是机器人学习的学习方法，机器人主动或被动接受特定数据，按照配置转化成索引，然后通过其部件（handler）展示出来，例如：search、moreLikeThis、spellCheck、factedSearcher等。

后面再继续总结各个配置文件。


