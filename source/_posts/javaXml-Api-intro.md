---
layout: post
title: "浅析SAX,DOM,JAXP,JDOM与DOM4J之间的关系"
date: 2014-08-21
comments: true
categories: java
tags:  [java,xml,SAX,DOM,JAXP,JDOM,DOM4J]
description: SAX与DOM是JAVA中两大核心XML解析API类库，而JAXP,JDOM与DOM4J都是基于这两大核心API而衍生出来的。
---
![java xml api](http://7xrvdu.com1.z0.glb.clouddn.com/javaXmlApi.jpg)
*图片来源百度*

众所周知，`SAX`与`DOM`是JAVA中两大核心XML解析API类库，而`JAXP`,`JDOM`与`DOM4J`都是基于这两大核心API而衍生出来的。今日兴起看了看相关资料，写篇文章总结总结^.^。
<!--more -->
# SAX与DOM
首先需要说明白的是SAX与DOM的关系。

`SAX`与`DOM`都是底层API，在JDK中他们的包路径分别为：org.xml.sax与org.w3c.dom。自JDK1.5开始，JDK中自带的实现为Apache的`xerces`（位于com.sun.org.apache.xerces.internal.parsers下）。

`SAX`是`Simple API for XML`的简称，它是在JAVA平台上第一个被广泛使用的XML API。也就说它是为JAVA而出现的。目前已经有多个语言版本，比如C++。
`DOM`是`Documents Object Model`的简称，与SAX不同的是，DOM是`W3C`的标准，它出现的目的是为了实现一套跨平台与语言的标准。

以上是它们之间的第一个不同。第二个，就是解析方式的不同。

SAX是`基于事件解析`，解析过程中根据目前的XML元素类型，调用用户自己实现的回调方法（或着叫事件方法）来处理，如：`startDocument();`，`startElement();` 。
SAX2.0中有4个核心接口：
- org.xml.sax.ContentHander
- org.xml.sax.ErrorHandler
- org.xml.sax.DTDHandler
- org.xml.sax.EntityResolver

实现这几个Handler，然后调用解析器相应的set方法注册给解析器，就可以完成各种元素的解析与处理。 对应的注册进解析器的方法分别是：
- parser.setContentHandler(ContentHander handler)
- parser.setErrorHandler(ErrorHandler handler)
- parser.setDTDHandler(DTDHandler handler)
完整例子：
```java
 DefaultHandler  handler=new XmlParserHandler();//DefaultHandler已经实现了全部org.xml.sax.ContentHandler，  
                                                   //org.xml.sax.ErrortHandler，org.xml.sax.DTDHandler和org.xml.sax.EntityHandler接口  
 XMLReader xr=XMLReaderFactory.createXMLReader();//获取解析器实例  
 xr.setContentHandler(handler);//设置处理类  
        xr.setErrorHandler(handler);  
        xr.setDTDHandler(handler);  
xr.setFeature("http://xml.org/sax/features/validation", true);//开启DTD验证  
xr.setFeature("http://apache.org/xml/features/validation/schema", true);//开启SCHMAE验证  
xr.parse(new InputSource("F:/Work/Workspace/XmlStudy/test.xml"));  
```
基于事件处理的好处是，不需要等到整个XML文件被加载完成后在开始处理，而是加载到哪处理到哪。这样便带来了效率上的优势。但是其也有明显的不足，第一个不足便是无法随机访问元素。如果你只想获取第二元素的信息，那么你必须等到第一个元素处理完成后，第二个元素开始的时候。如果这时，你又需要返回第一个元素，那么对不起，已经来不及了。SAX不会主动记忆或保存已处理过的元素（为了效率）。为了实现前面的需求，开发人员需要自己使用容器来保存处理过的元素，并且建立一个模型来表示XML的树形结构。这样一来也就带来了第二个缺点，使用的复杂性。

再来说说DOM。DOM采用了解析方式是`一次性加载`整个XML文档，在内存中形成一个树形的数据结构，这个数据结构我们称为文档对象模型。通过DOM解析器获取Documen文档t对象后，开发人员可以很方便的对其进行操作，如`getDocumentElement();（获取更元素）`，`getFirstChild();获取一个子元素`，`appendChild();增加子元素`，`removeChild();移除子元素`。因此，使用DOM可以很方便对XML中的数据进行获取与修改，而不需要像SAX一样自己设计模型保存获取的数据。
完整例子：
```java
  DOMParser dp=new DOMParser();  
  dp.parse(new InputSource("e:/test.xml"));  
  Document doc=dp.getDocument();  
  Element rootElemet=doc.getDocumentElement();  
  NodeList list=rootElemet.getChildNodes();  
```

**跟重要的一点是**，在DOM中所有Element都是Node，这意味着，我们不需要明确知道文档的结构就可以操作它。我们可以判断当前获取到的任意Node对象类型来做不同操作。主要Node类型有：
    - Node.DOCUMENT_NODE
    - Node.ELEMENT_NODE
    - Node.TEXT_NODE
    - Node.CDATA_SECTION_NODE
    - Node.PROCESSING_INSTRUCTION_NODE
    - Node.ENTITY_REFERENCE_NODE
    - Node.DOCUMENT_TYPE_NODE

但是，由于DOM是一次性加载整个XML文件到内存， 如果XML文件非常庞大，构建文档树的内存与时间开销会很大，且很有可能导致内存溢出异常。

那么如何在SAX与DOM直接选择呢？这取决于下面几个因素：
1. 应用程序的目的：如果打算对数据作出更改并将它输出为 XML，那么在大多数情况下，DOM 是适当的选择。并不是说使用 SAX 就不能更改数据，但是该过程要复杂得多，因为您必须对数据的一份拷贝而不是对数据本身作出更改。
2. 数据容量： 对于大型文件，SAX 是更好的选择。
4. 数据将如何使用：如果只有数据中的少量部分会被使用，那么使用 SAX 来将该部分数据提取到应用程序中可能更好。 另一方面，如果您知道自己以后会回头引用已处理过的大量信息，那么 SAX 也许不是恰当的选择。
5. 对速度的需要： SAX 实现通常要比 DOM 实现更快。

>`SAX` 和 `DOM` 不是相互排斥的，记住这点很重要。您可以使用 DOM 来创建 SAX 事件流，也可以使用 SAX 来创建 DOM 树。事实上，用于创建 DOM 树的大多数解析器实际上都使用 SAX 来完成这个任务，比如`DOM4J`与`JDOM`！

# JAXP,JDOM与DOM4J
## JAXP
`JAXP`，全称`Java API for XML Processing`，打开其为JDK的目录：javax.xml.parsers， 你会发现它与SAX和DOM一样只是一套API。实际上，JAXP出现时SUN公司为了弥补JAVA在XML标准制定上的空白而制定的一套JAVA XML标准API。它并没有为JAVA解析XML提供任何新功能，但是它为在JAVA获取SAX与DOM解析器提供了更加直接的途径。它封装了SAX与DOM两种接口，并在SAX与DOM的基础之上，作了一套比较简单的api以供开发。
例如：JAXP获取SAX解析器：
```java
  SAXParserFactory factory=SAXParserFactory.newInstance();  
  SAXParser parser=factory.newSAXParser();  
  parser.parse("F:/Work/Workspace/xiongqi/XmlStudy/test.xml", handler);  
```
获取DOM解析器：
```java
  DocumentBuilderFactory factory=DocumentBuilderFactory.newInstance();  
  DocumentBuilder builder= factory.newDocumentBuilder();  
  Document document= builder.parse("F:/Work/Workspace/xiongqi/XmlStudy/test.xml");  
```

在 JAXP 的早期版本中，自带解析器的实现为 Apachede 的Crimson，在 JAXP 的新版本中 （包括在 JDK 中） ，Sun 已经重新包装了 Apache Xerces 做为解析器的实现。

## JDOM
由于DOM是为了实现一套跨平台与语言的标准，因此使用它对于JAVA开发人员来说并不是特别的得心应手，这时`JDOM`就出现了。

`JDOM` 的目的是成为 Java 特定文档模型，它简化与 XML 的交互并且比使用 DOM 实现更快。而且它是第一个 Java 特定模型。与`DOM`相比较，首先，JDOM 仅使用具体类而不使用接口。这在某些方面简化了API，但是也限制了灵活性。第二，API 大量使用了 Collections 类，相对于dom中的Node，简化了那些已经熟悉这些类的Java 开发者的使用。JDOM 自身不包含解析器，默认使用随jar包一起发行的pache Xerces。

例子：


```java
SAXBuilder builder = new SAXBuilder(false);  
Document doc = builder.build(in);  
```
从上面代码中可以看出，JDOM使用SAX2 解析器来解析和验证输入 XML 文档，然后构建Doucment对象。

## DOM4J
`DOM4J`  最初是 JDOM 的一个分支。它合并了许多超出基本 XML 文档表示的功能，包括集成的 XPath 支持、XML Schema 支持以及用于大文档或流化文档的基于事件的处理。它还提供了构建文档表示的选项，它通过 DOM4J API 和标准 DOM 接口具有并行访问功能。

为支持所有这些功能，DOM4J 使用`接口`和`抽象`基本类方法。DOM4J 大量使用了 API 中的Collections 类，但是在许多情况下，它还提供一些替代方法以允许更好的性能或更直接的编码方法。直接好处是，虽然 DOM4J 付出了更复杂的 API 的代价，但是它提供了比 JDOM 大得多的灵活性。在添加灵活性、XPath 集成和对大文档处理的目标时，DOM4J 的目标与 JDOM 是一样的：针对 Java开发者的易用性和直观操作。它还致力于成为比 JDOM 更完整的解决方案，实现在本质上处理所有Java/XML 问题的目标。在完成该目标时，它比 JDOM 更少强调防止不正确的应用程序行为。

例子：
```java
SAXReader reader = new SAXReader(false);  
Document  doc = reader.read(in);  
```
DOM4J 是一个非常非常优秀的Java XML API，具有性能优异、功能强大和极端易用使用的特点，同时它也是一个开放源代码的软件。如今你可以看到越来越多的 Java 软件都在使用 DOM4J 来读写 XML，特别值得一提的是连 Sun 的 JAXM 也在用 DOM4J。
