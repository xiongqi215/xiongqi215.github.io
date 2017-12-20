---
layout: post
title: "Kettle 初体验"
date: 2017-03-11 17:57:14 +0800
comments: true
categories: Kettle
tags:  [Kettle,ETL]
description: Kettle介绍
---
# 背景
最近因公司项目原因，接触到了Kettle这样一款ETL工具。计划在这段学习与使用的过程中，将自己的心得体会，完成几篇文章作为自己的积累，同时也非常高兴分享给大家。

#Kettle介绍
ETL 是Extract-Transform-Load三个单词的简称，即抽取、转换、加载。ETL工具常用于建立**数据仓库**，但不仅限于这一领域。换句话话说，使用ETL 工具我们可以完成从目标数据源进行数据**抽取**，经过一系列的数据**转换**，最终形成需要的数据模型并**加载**到数据仓库中。

Kettle是一款采用纯JAVA实现的开源ETL工具，属于开源商务智能软件Pentaho的一个重要组成部分。Kettle提供一系列的组件用于完成各种上面所说的抽取、转换、加载的工作。正如Kettle一词的中文意思*水壶*一样，Kettle的开发人员希望使用kettle处理数据就像从水壶中倒水出来一样--`把各种数据放到一个壶里，然后以一种指定的格式流出`。
<!--more-->
Kettle中两个核心是**转换(transformation)**与**作业(job)**：
- 转换(transformation)：完成数据ETL工作；如下图所示的在spoon中设计的转换流程。
 ![kettle-spoon 转换演示,从文件中读取数据并插入到数据库表中](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-transformation.png)  

- 作业(job):定义一个完成整个工作流的控制；
 ![kettle-spoon 作业演示](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-job.png)  

#名词解释
- KETTLE_HOME: KETTLE_HOME是指kettle的home目录，默认位置为(以windows为例)：`C:\Users\Administrator\.kettle`；我们可以通过设置系统环境变量KETTLE_HOME来自定义该目录位置。在KETTLE_HOME目录下会存在如下配置文件：
   - kettle.properties:全局环境参数配置文件;
   - repositories.xml:资源库描述文件;
   - share.xml:共享对象描述文件；

- 资源库(repository):
资源库相当于一个Kettle工程目录。这个工程所有的作业与转换，数据库连接信息，参数变量都将保存在这个资源库。启动一个作业与转换的前提条件也是先连接上所在的资源库。kettle中资源库分为文件资源库与数据库资源库。
  - **文件资源库 **需要指定一个文件系统的目录作为资源库根目录。使用文件资源库所有作业与转换会以文件的形式保存在该资源库根目录下。作业文件扩展名为`.kjb`,转换的件扩展名则为`.ktr`。文件资源库的好处是便于迁移，只要将`.kjb`或`.ktr`拷贝到其他资源目录下就可以完成迁移。

  - **数据库资源库** 需要指定一个数据库连接，这个连接可以是JDBC形式也可以是JNDI或ODBC。Kettel会生成一个数据库脚本，在指定数据库中生成一系列相关的表用于存储作业与转换以及相关的数据库连接信息和参数变量配置。数据库资源库的好处是安全，连接一个数据库资源库是需要进行用户认证的。
可通过spoon界面中`工具-》资源库-》连接资源` 来选择连接指定资源库或者新建资源库。
![](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-createRep)
- 数据库连接： 创建资源库连接作为数据源或资源库。kettle支持绝大多多数数据库系统。

- 元数据(meta):是指用于描述作业与转换属性的数据。上面说到的`.kjb`和`.ktr`文件实际存储的就是元数据的描述信息，同样的数据库资源库中保存的也是元数据信息。执行转换和作业时,kettel首先加载的是各自的元数据，然后生成作业或转换实例，再执行。元数据好比是Class，而实例则是Object。
![转换与作业元数据](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-meta.png)

- 变量与参数:
 - 变量(variable): 变量可以是定义在`kettle.properties`中的全局变量，也可以是通过`设置变量`步骤和`获取变量`步骤在作业运行中动态设置与使用；变量使用时的格式为${变量名}；需要注意的是`设置变量`所设置的变量在同一个转换里是不能被`获取变量`获取的，必须在一个作业中的下一个转换中使用，这是因为转换的步骤是并行运行的（关于这点会在下面细说）。
![](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-setVariables.png)
![](http://7xrvdu.com1.z0.glb.clouddn.com/kette-requireVariable.png)
 - 参数(parameter): 参数分为命名参数与位置参数，他们区别是是否存在参数名称。显然命名参数的名称，而且它还有默认值。我们可以在作业与转换的元数据中设置好命名参数以及它的默认值，在运行时传入指定值或者不传值使用默认值；
而位置参数则是通过'?'作为站位符，运行时按传入顺序一个个替换为传入的值。

![](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-namedPar.png)
![](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-namedPar2.png)

#Kettle的组件
 ![kettle组件,图片来源《使用PDI构建开源ETL解决方案  [MATT CASTERS著；初建军，曹雪梅译]》](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-compent.png)
Kettle提供了如下组件:
- spoon(汤勺):一个基于SWT的IDE工具。常用完成转换（transformation）与作业(job)脚本的设计；
- kitchen(厨师):命令行工具，用于执行作业(job)；
- pan(煎锅): 命令行工具，用于执行转换(transformation)；
- carte(菜单): http服务器，用于监听HTTP请求，完成远程执行转换（transformation）与作业(job)。另外也可以用于实现集群。

从图中可知，实际使用Kettle时，利用Spoon做为开发工具，设计好作业与转换，以及相关参数与变量并保存在资源库中。生成环境中，使用kitchen或pan启动作业或转换。同时，根据实际需求与数据量，决定是否使用carte进行远程调用或者集群部署。


#转换与作业的执行方式

Kettle中使用**转换（transformation）**完成数据ETL全部工作。转换由多个**步骤(step)**组成，如文本文件输入，过滤输出行，执行SQL脚本等。各个步骤使用**跳(hop)**来链接。 跳定义了一个数据流通道(也就是上图看到的带箭头的连线)，即数据由一个步骤流(跳)向下一个步骤。在Kettle中数据的最小单位是**行（row）**,数据流中流动其实是缓存的**行集(RowSet)**。

值得注意的是，跳的箭头方向单单只是指出了数据的流向，为步骤指明了从哪读入数据以及向哪儿写入数据， 这与步骤的执行顺序无关。实际上Kettle的转换没有真正的起点与终点。因为，为了提高效率，转换中的每个步骤都是同时启动，并且拥有独立执行线程。输出的步骤不断向数据流中写入数据，直到行集满了则停止，当又有空间时继续写入。而从数据流读入数据的步骤则不停读入，直到数据流空了则停止，当又有数据时继续读入。而当所有步骤都停止了，则整个转换完成。

设计一个从文件读取10000条数据并将读入数据插入数据库中的转换来验证这一点：
 ![](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-eg1.gif) 
这里我将行集最大行数设为了100，这样可以看得比较清楚。我们可以看到``文本文件输入``与`执行SQL脚本`两个步骤都在运作中，且一个在不断输入(从文件)与写入(行集)，而另一个则不断读入(行集)与写出(生成SQL执行)。

因为**转换（transformation）**以并行方式执行，所以必须存在一个串行的调度工具来执行转换，这就是kettle中的**作业(job)**。
 ![kettle-spoon 作业演示](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-job.png)  
作业中必须有个表示开始`strat`步骤。以串行的方式先执行转换1然后根据执行结果判定是发送成功邮件还是失败邮件。

# 常用集成解决方案
实际生产当中我们不太可能打开spoon，以人工形式来执行作业或转换，这就需要一种集成方案，来通过我们的应用程序自动的执行作业或转换。
这里有两套执行方案：
一是比编写好kitchen或者pan脚本，通过应用程序调用这些脚本。或者将脚本放入系统定时任务中，以周期形式来调用；
二是利用carte搭建服务器，应用程序远程调用服务启动作业或转换；
三是可以完全将kettle的API集成到应用程序，以代码的形式，通过API来调用，甚至代替spoon来进行维护。
以上三种方案都是可以实现的，采用哪套，完全取决于实际项目需求。

# 后续
这篇随笔文章只是浅浅介绍了下kettle的一些基本知识，也是目前我所了解到的。如有不足处或错误处还望大牛们指出。
kettle是开源的，为了深入理解其内部实现原理同时能够实现项目上的一些个性化的需求，我的下一步计划是对kettle的源码进行一些分析。