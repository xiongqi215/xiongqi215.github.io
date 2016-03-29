---
layout: post
title: "字符集与编码"
date: 2015-09-08 17:57:14 +0800
comments: true
categories: 其它
tags:  [字符集与编码,中文乱码,web开发]
description: Java中的字符集与编码
---
*以下内容转自 [http://www.cnblogs.com/skynet/archive/2011/05/03/2035105.html](http://www.cnblogs.com/skynet/archive/2011/05/03/2035105.html)*

# 什么是字符集与字符编码？ #

----------

**字符集** （Charset）：是一个系统支持的所有抽象字符的集合。字符是各种文字和符号的总称，包括各国家文字、标点符号、图形符号、数字等。
常见字符集名称：ASCII字符集、GB2312字符集、BIG5字符集、GB18030字符集、Unicode字符集等

**字符编码**（Character Encoding）：是一套法则，使用该法则能够对自然语言的字符的一个集合（如字母表或音节表），与其他东西的一个集合（如号码或电脉冲）进行配对。即在符号集合与数字系统之间建立对应关系，它是信息处理的一项基本技术。通常人们用符号集合（一般情况下就是文字）来表达信息。而以计算机为基础的信息处理系统则是利用元件（硬件）不同状态的组合来存储和处理信息的。元件不同状态的组合能代表数字系统的数字，因此字符编码就是将符号转换为计算机可以接受的数字系统的数，称为数字代码。

可以这样理解：Unicode是字符集，UTF-32/ UTF-16/ UTF-8是三种字符编码方案。
<!--more-->
# HTTP中关于字符与字符集的参数 #

----------
在HTTP中，与字符集和字符编码相关的消息头是Accept-Charset/Content-Type，另外主区区分Accept-Charset/Accept-Encoding/Accept-Language/Content-Type/Content-Encoding/Content-Language：




- Accept-Charset：浏览器申明自己接收的字符集，这就是本文前面介绍的各种字符集和字符编码，如gb2312，utf-8（通常我们说Charset包括了相应的字符编码方案）；



- Accept-Encoding：浏览器申明自己接收的编码方法，通常指定压缩方法，是否支持压缩，支持什么压缩方法（gzip，deflate），（注意：这不是只字符编码）；



- Accept-Language：浏览器申明自己接收的语言。语言跟字符集的区别：中文是语言，中文有多种字符集，比如big5，gb2312，gbk等等；



- Content-Type：WEB服务器告诉浏览器自己响应的对象的类型和字符集。例如：Content-Type: text/html; charset='gb2312'



- Content-Encoding：WEB服务器表明自己使用了什么压缩方法（gzip，deflate）压缩响应中的对象。例如：Content-Encoding：gzip



- Content-Language：WEB服务器告诉浏览器自己响应的对象的语言。



#Java web 开发中的编码问题#
----------
*以下内容为作者原创，reference from 许令波 《升入分析JAVA web 技术内幕》*
</br>
##字符串编解码##
首先，java中最简单的编解码操作如下：
```java
String str="我是中国人";
//解码为字节数组
//采用UTF-8解码，若不指明编码将采用当前工作空间默认编码
String[] strByte=str.getBytes("UTF-8");
//编码，若不指明编码将采用当前工作空间默认编码
```

以上代码是java 中最简单的字符串编解码操作，但是应用广泛。

*几种常用的编码格式比较：*
GBK与GB2312都是处理汉字常用的编码，但由于GBK比GB2312支持的汉字范围更大，所有推荐使用GBK。
UTF-8与UTF-16都是处理UNICODE的编码，其中UTF-16效率更高，适合在内存中操作(java的内存编码就采用了UTF-16)，但由于UTF-16采用定长双字节表示字符，占用资源较大，加上网络传输容易损坏字节难以恢复，所以并不适合在网络上传输。

UTF-8由于其对ASCII字符采用单字节编码，对中文或其他ASCII以外字符才采用多字节编码，因而网络传输中的字节损坏并不会造成整个字符串不可辨认的问题。另外它的效率鉴于GBK与UTF-16之间，故而非常适合java web开发。这样就是为什么现在公司几乎所有项目都要求使用utf-8。


##URL编码##
首先看下一个url的组成：
**以下是使用get发送进行的一次请求，对于POST请求，它的参数编解码与get不同，将在后面叙述。**

`http://localhost:8080/examples/servlet/搜索?key=中国`
其中出现中文的两部分分别为：

- pathIfo="搜索" //请求的servlet
- queryString="中国"  //GET请求参数，
以tomcat为例，pathIfo的编码是由根目录下\conf\server.xml中一下节点中URIEncoding属性决定的，如果 未设置将默认使用iso-8859-1.

```xml
<Connector port="8080" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" URIEncoding="utf-8"/>
```
对于queryString部分的解码是在第一次调用HttpServletRequest对象的getParameter();方法时开始的。它的解码要么是由Http Header中的contentType决定，要么就是默认的iso-8859-1。如果要设置使用contentType定义的charset作为解码方式则需要在server.xml中对&lt;connector&gt;节点进行修改，增加属性useBodyEncodingforURI="true"。如下：
```xml
<Connector port="8080" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" URIEncoding="utf-8" useBodyEncodingforURI="true" />
```

**注意！这个参数的名称可能会让你觉得是对整个uri都采用bodyEncoding，其实不然，它只影响queryString部分的编码。**


**POST请求的参数编解码：**
POST请求的参数是通过HTTP BODY传输的，默认使用contentType定义的charset作为浏览器编码与服务端解码方式，所以一般不会出现乱码。而且这个编码我可以通过HttpServletRequest对象的setCharacterEncoding();来自行设置。

**注意！setCharacterEncoding();方法必须要在第一次调用getParameter();方法之前调用，否则将会失效。**

**Cookie,redirectPath编解码：**
**Http Header中的Cookie,redirectPath的编码不能进行设置，默认使用iso-8859-1，所以这两部分不能出现中文！**


**Response编解码**
对于后台返回浏览的响应数据的编解码，我们可以通过HttpResponse的setCharacter();方法进行设置，它会改变浏览器收到的header中Content-Type的charset，如果没有设置，将使用
&lt;meta http-equiv="content-type" content="text/html; charset=GBK"/&gt;中的charset来解码。否则使用默认iso-8859-1;
