---
layout: post
title: "spring中@Autowired与@Resource的区别"
date: 2015-09-21 17:57:14 +0800
comments: true
categories: Spring
tags:  [J2EE,Spring,JAVA,web,SSH,依赖注入,依赖翻转]
description: spring中@Autowired与@Resource的区别
---


*原文：[http://www.cnblogs.com/suneryong/p/4311829.html](http://www.cnblogs.com/suneryong/p/4311829.html)*
 
 
1、@Autowired与@Resource都可以用来装配bean. 都可以写在字段上,或写在setter方法上。 

2、@Autowired默认按类型装配（这个注解是属业spring的），默认情况下必须要求依赖对象必须存在，如果要允许null 值，可以设置它的required属性为false，如：@Autowired(required=false) ，如果我们想使用名称装配可以结合@Qualifier注解进行使用，如下： 
```java
@Autowired() @Qualifier("baseDao")     
private BaseDao baseDao;    
```
<!--more-->
 3、@Resource（这个注解属于J2EE的），默认安照名称进行装配，名称可以通过name属性进行指定， 
如果没有指定name属性，当注解写在字段上时，默认取字段名进行按照名称查找，如果注解写在setter方法上默认取属性名进行装配。 当找不到与名称匹配的bean时才按照类型进行装配。但是需要注意的是，如果name属性一旦指定，就只会按照名称进行装配。
```java
@Resource(name="baseDao")     
private BaseDao baseDao;    
```

@Resource注解在字段上，这样就不用写setter方法了，并且这个注解是属于J2EE的，减少了与spring的耦合。