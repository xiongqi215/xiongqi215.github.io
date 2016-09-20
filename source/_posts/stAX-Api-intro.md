---
layout: post
title: "StAX---基于流的拉式XML解析"
date: 2014-08-21
comments: true
categories: java
tags:  [java,xml,stAX]
description: StAX采用一种‘拉（pull）‘的方式，由应用程序主动从解析器中获取当前XML事件然后更具需求处理（保存或者忽略）。StAX使得应用程序掌握了主动权，可以简化调用代码来准确地处理它预期的内容，或者发生意外时停止解析。此外，由于该方法不基于处理程序回调，应用程序不需要像使用 SAX 那样模拟解析器的状态。
---


最近在学习webservice时，发现很多技术框架都在使用StAX作为底层XML解析工具，于是今天看了看资料，简单学习了下，在这里做个总结。
# 简介
StAX，全称Streaming API for XML，一种全新的，基于流的JAVA XML解析标准类库。其最终版本于 2004 年 3 月发布，并成为了 JAXP 1.4（将包含在即将发布的 Java 6 中）的一部分。在某种程度上来说，StAX与SAX一样是基于XML事件的解析方式，它们都不会一次性加载整个XML文件。但是它们之间也有很大的不同。

<!--more-->
## 与SAX相比
虽然StAX与SAX一样基于XML事件解析，相比于DOM将整个XML加载进内存来说效率高。不同的是，StAX在在处理XML事件的方式上使得应用程序更接近底层，所以在效率上比SAX更优秀。
 
使用SAX时，我们知道XML事件是由解析器调用开发人员编写的回调方法来处理的，也就是说应用程序是被动于解析器的。应用程序只能被动的等待解析器将XML事件推送给自己处理，对于每一种事件都需要在解析开始之前就做好准备。这种方式被称为‘推（push)‘。
而StAX正好相反，StAX采用一种‘拉（pull）‘的方式，由应用程序主动从解析器中获取当前XML事件然后更具需求处理（保存或者忽略）。StAX使得应用程序掌握了主动权，可以简化调用代码来准确地处理它预期的内容，或者发生意外时停止解析。此外，由于该方法不基于处理程序回调，应用程序不需要像使用 SAX 那样模拟解析器的状态。



# 简单入门

获取解析器工厂
与其他解析技术一样，在使用StAX解析器之前也需要获取其工厂类。
```java
import java.io.InputStream;  
import java.io.OutputStream;  
import javax.xml.stream.XMLInputFactory;  
import javax.xml.stream.XMLOutputFactory;  
  
  
public class StAX_Frist {  
 public void writeXMlByStream(OutputStream out){  
     XMLOutputFactory outFactor=XMLOutputFactory.newInstance();//写解析器工厂  
     .......  
 }  
    public void  readXmlByStream(InputStream in){  
          
        XMLInputFactory inFactory=XMLInputFactory.newInstance();//读解析器工厂  
        .......  
    } 
```
 
## 主要API
StAX 实际上包括两套处理 XML 的 API，分别提供了不同程度的抽象。基于指针（Cursor）的 API 允许应用程序把 XML 作为一个标记（或事件）流来处理。在这里，解析器就像一跟指针一样在文件流上前进，应用程序可以跟随解析器从文件的开头一直处理到结尾。这是一种低层 API，尽管效率高，但是没有提供底层 XML 结构的抽象。Cursor API 由两个主要API组成，XMLStreamReader和XMLStreamWriter，分别由XMLInputStreamFactory和XMLOutputStreamFactory获取。
使用Cursor API 读XML文件：

```java
import java.io.InputStream;  
import javax.xml.stream.XMLInputFactory;;  
import javax.xml.stream.XMLStreamConstants;  
import javax.xml.stream.XMLStreamReader;  
  
  
public class StAX_Frist {  
      
    public void  readXmlByStream(InputStream in){  
          
        XMLInputFactory inFactory=XMLInputFactory.newInstance();//读解析器工厂  
          
  
        try {  
            XMLStreamReader reader=inFactory.createXMLStreamReader(in);//获取读解析器  
            while(reader.hasNext()){//reader.hasNext();说明文件未到结尾。  
                int eventId=reader.next();  
                switch (eventId) {  
                case XMLStreamConstants.START_DOCUMENT:  
                    System.out.println("start docmuent");  
                    break;  
                      
                case XMLStreamConstants.START_ELEMENT:  
                    System.out.println("<"+reader.getLocalName()+">");  
                    for(int i=0;i<reader.getAttributeCount();i++){  
                        System.out.println(reader.getAttributeLocalName(i)+"="+reader.getAttributeValue(i));  
                    }  
                    break;  
                      
                case XMLStreamConstants.CHARACTERS:  
                    if(reader.isWhiteSpace()){  
                        break;  
                    }  
                    System.out.println(reader.getText());  
                    break;  
                case XMLStreamConstants.END_ELEMENT:  
                    System.out.println("</"+reader.getLocalName()+">");  
                      
                    break;  
                case XMLStreamConstants.END_DOCUMENT:  
                    System.out.println("end docmuent");  
                    break;  
                default:  
                    break;  
                }  
            }  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
```
另外一种是较为高级的基于迭代器（Iterator）的 API ，它允许应用程序把 XML 作为一系列事件对象来处理，每个对象和应用程序交换 XML 结构的一部分。应用程序只需要确定解析事件的类型，将其转换成对应的具体类型，然后利用其方法获得属于该事件的信息。基于事件迭代器的方法具有一个基于指针的方法不具备的重要优点。通过将解析器事件变成一级对象，从而让应用程序可以采用面向对象的方式处理它们。这样做有助于模块化和不同应用程序组件之间的代码重用。Iterator API 由两个主要API组成，XMLEventReader和XMLEventWriter，分别由XMLInputStreamFactory和XMLOutputStreamFactory获取。
使用Iterator API 读XML文件：

```java

import java.io.InputStream;  
import java.util.Iterator;  
import javax.xml.stream.XMLEventReader;  
import javax.xml.stream.XMLInputFactory;  
import javax.xml.stream.XMLStreamConstants;  
import javax.xml.stream.events.Attribute;  
import javax.xml.stream.events.Characters;  
import javax.xml.stream.events.StartElement;  
import javax.xml.stream.events.XMLEvent;  
  
   public class StAX_Frist {  
      
           public void  readXmlByEvent(InputStream in){  
          
        XMLInputFactory factory=XMLInputFactory.newInstance();//获取解析器工厂  
        try {  
            XMLEventReader reader=factory.createXMLEventReader(in);//获取解析器  
            while(reader.hasNext()){  
            XMLEvent event=reader.nextEvent();  
              
                switch (event.getEventType()) {  
                case XMLStreamConstants.START_DOCUMENT:  
                    System.out.println("start docmuent");  
                    break;  
                      
                case XMLStreamConstants.START_ELEMENT:  
                    StartElement element=(StartElement)event;  
                    System.out.println("<"+element.getName().getLocalPart()+">");  
                    for(Iterator it=element.getAttributes();it.hasNext();){  
                        Attribute attr=(Attribute) it.next();  
                        System.out.println(attr.getName().getLocalPart()+"="+attr.getValue());  
                    }  
                    break;  
                      
                case XMLStreamConstants.CHARACTERS:  
                    Characters charData=(Characters)event;  
                    if(charData.isIgnorableWhiteSpace()&&charData.isWhiteSpace()){  
                        break;  
                    }  
                    System.out.println(charData.getData());  
                    break;  
                case XMLStreamConstants.END_ELEMENT:  
                    element=(StartElement)event;  
                    System.out.println("</"+element.getName().getLocalPart()+">");  
                      
                    break;  
                case XMLStreamConstants.END_DOCUMENT:  
                    System.out.println("end docmuent");  
                    break;  
                default:  
                    break;  
                }  
            }  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
```