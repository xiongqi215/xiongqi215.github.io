---
layout: post
title: "ZK--初体验"
date: 2016-10-15
comments: true
categories: java,zk
tags:  [java,zk,javaWeb,j2ee,ajax]
description: ZK是一套以 AJAX/XUL/Java 为基础的网页应用程序开发框架，用于丰富网页应用程序的使用界面。最大的好处是，在设计AJAX网络应用程序时，轻松简便的操作就像设计桌面程序一样。 ZK包含了一个以AJAX为基础、事件驱动（event-driven）、高互动性的引擎，同时还提供了丰富多样、可重复使用的XUL与HTML组件，以及以 XML 为基础的使用界面设计语言 ZK User-interfaces Markup Language (ZUML)。
---

![](http://7xrvdu.com1.z0.glb.clouddn.com/ZK-logo.png)

最近在一个偶然的机会下接触到了一款名为ZK的神奇前端框架(官方网站:[https://www.zkoss.org/](https://www.zkoss.org/))，决定将自己第一次使用的感受再次总结下，与大家分享。


# 什么是ZK

如何神奇？因为ZK颠覆了传统的JAVA WEB应用开发模式。使用ZK后你可以放弃原先的JSP，甚至你不需要写任何的JS，html和css代码就可以实现一个类似桌面程序一样的web应用。`ZK`采用AJAX作为前后端通信方式，采用XUL(  XML User Interface Language)代替HTML，使用JAVA实现页面渲染代替CSS与js的工作。

与其他前端框架，如EasyUi一样，ZK也提供了大量前端组件。在其[live-demo](https://www.zkoss.org/zkdemo/ "live-demo")网站上我们可以查看到所有组件的示例：

![](http://7xrvdu.com1.z0.glb.clouddn.com/ZK_DEMO.gif)

## Hello Wolrd

来一段Hello World感受下吧：
![](http://7xrvdu.com1.z0.glb.clouddn.com/zk-HelloWorld.gif)

代码：
``` xml

<?page title="new page title" contentType="text/html;charset=UTF-8"?>
<zk>
  <window title="Zk First Example"  border="0" width="800px" height="150px" sizable="true">
	<borderlayout>
	  <center border="0" autoscroll="true" flex="true">
		<grid fixedLayout="true">
			<columns>
			 <column />
			 <column />
			</columns>
		<rows>
			<row align="left">
			  <textbox onBlur="hello.value=self.value" placeholder="fill something here" />
				<label id="hello"></label>	
			</row>
			<row align="left" spans="2" >
			 <button id="Hello World!" onClick="alert(self.id)" label="alert Hello world" />
			</row>
		</rows>
	 </grid>
    </center>
  </borderlayout>
 </window>
</zk>

```