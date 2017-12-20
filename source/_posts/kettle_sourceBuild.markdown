---
layout: post
title: "Kettle分析之源码环境搭建"
date: 2017-03-11 17:57:14 +0800
comments: true
categories: Kettle
tags:  [Kettle,ETL]
description: Kettle分析之源码环境搭建
---

继续上一篇文章[《Kettle初识》](http://www.jianshu.com/p/2a7ace927825),本篇文章继续来说说kettle的源码环境搭建。
<!--more-->
# 写在前面
- JDK版本: JDK 1.6
- Kettle版本: 5.4.0.1-130
- Kettle源码获取地址：[https://github.com/pentaho/pentaho-kettle](https://github.com/pentaho/pentaho-kettle)，在master下选择tags选项卡，选取自己需要的版本，并下载。需要与自己目前使用的发行版版本一致，比如我这里的**5.4.0.1**

#开始搭建

##建立java工程
在自己的IDE中建立一个普通java工程，并在工程目录下新建`core`,`dbdialog`,`engine`,`ui`,`plugins`五个文件夹，用于放置源码包；

##复制源码
按如下规则复制源码到工程目录下

 >源码根目录\core\src        ---copy--- > 工程目录\core\
 >源码根目录\dbdialog\src ---copy--- > 工程目录\dbdialog\	 
>源码根目录\engine\src   ---copy--- >工程目录\engine\	 
> 源码根目录\plugins\src  ---copy--- >工程目录\plugins\	 
> 源码根目录\ui\src          ---copy--- > 工程目录\ui\
> 源码根目录\assembly\package-res\ui   ---copy--- >工程目录\ui\


##复制依赖
将从官网下载的发行版kettle中的的`lib`,`libswt`,`launcher`，`simple-jndi` 四个文件夹拷贝至项目的根目录中。
并将lib包下除了`kettle-core.xxx.jar` ,`kettle-bddialog.xxx.jar`,`kettle-engine.xxx.jar`三个包以外的所有.jar add to build path中。 
将`libswt`中符合自己操作系统位数的`swt.jar`add to build path中。 
>例如我的系统是`windows x64`那么选择的是`libswt->win64->swt.jar`

![](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-source-build1.gif)

##编译运行
将`core`,`dbdialog`,`engine`,`ui`三个文件 `User as Source Floder` ,即加入编译目录中，等待Eclipse 自动完成编译。
![](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-source-build2.gif)

当编译完成后，将`org.pentaho.di.ui.spoon.Spoon`加入到 `Main-class `中，然后点击RUN。成功运行，并弹出spoon的界面则说明源码环境搭建成功！
![](http://7xrvdu.com1.z0.glb.clouddn.com/kettle-source-build3.gif)
![如果出现此欢迎页面，恭喜你，源码环境搭建成功！](http://7xrvdu.com1.z0.glb.clouddn.com/spoon-welcome.png)


##源码包中各部分功能说明

- core 包：Kettle核心类所在包；
- dbdialog包：Kettle数据库操作相关包所在类；
- engine 包：Kettle运行时类所在包，包括作业与转换的实现类。如果希望了解作业和转换的执行实现和运行细节，可以从这里入手；
- ui 包：Spoon界面实现类；  当我们希望实现一个管理平台，不妨从这里入手。看看Spoon在执行作业或转换时是如何调用其他API的，比如是如何连接资源库，如何加载作业和转换实例并执行的。


#写在最后

好了，源码环境搭建成功了！接下来，慢慢分析实现的细节。

