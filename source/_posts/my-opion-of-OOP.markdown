---
layout: post
title: "谈谈我对面向对象以及类与对象的理解"
date: 2016-09-22 17:57:14 +0800
comments: true
categories: java
tags:  [Java,class,object,面向对象编程,java内存机制]
description: 谈谈我对面向对象以及类与对象的理解
---

![](http://7xrvdu.com1.z0.glb.clouddn.com/oop.jpg)

对于刚接触JAVA或者其他面向对象编程语言的朋友们来说，可能一开始都很难理解面向对象的概念以及`类`和`对象`的关系。笔者曾经带过一个短期培训班教授java入门基础，在最后结束课程的时候学生们还是普遍没有真正理解`类`与`对象`的意义。今天兴起，想谈谈我自己对对面向对象的理解以及类与对象的关系。
<!--more-->

# 面向对象

首先一言不和先百度，得到如下定义：

 > 一切事物皆对象，通过面向对象的方式，将现实世界的事物抽象成对象，现实世界中的关系抽象成类、继承，帮助人们实现对现实世界的抽象与数字建模。
 
我们知道，编写程序的目的是为了解决现实生活中的问题，编程的思维方式也应该贴近现实生活的思维方式。面向对象的编程方式就是为了实现上述目的二出现的。它使得编程工作更直观，更易理解。需要注意的是**这里说的编程不光是coding还包括了设计的过程也是面向对象的**

## 为什么说面向对象更贴近实际生活
  想象一下，当我们向别人描述一样事物时，我们都是怎么说的？"它有像鸭子一样的嘴巴"，"它有4条退"，"爪子里还有蹼"，"它是哺乳动物但却是卵生"。
 这种`HAS A ` 和 `IS A`的表达方式往往可以简单而高效的描述一样事物。`HAS A`描述事物的属性或行为，`IS A` 则说明了事物的类属。
当我们把这一系列的属性`组合`起来便得到的鸭嘴兽这一`类`，同时`哺乳动物`一词简单精炼的表面了所有哺乳动物的特性而不用一一列出，这是`继承`特性的体现，同时`卵生`又是`多态`的体现。

## 与早期结构化编程相比

早期结构化编程是面向过程的（功能），换句话说程序是由功能的集合组成，而调用者是作为功能的参数传入的。而在面向对象的程序中，对象是主体，程序是由对象的集合组成。一个对象中包含一系列符合设计的功能供其他对象调用。这么说可能还是比较抽象，
![](http://7xrvdu.com1.z0.glb.clouddn.com/bq_jglz)，例如当我们设计一个五子棋游戏时，
面向过程的设计思路就是首先分析问题的步骤：
1、开始游戏，2、黑子先走，3、绘制画面，4、判断输赢，5、轮到白子，6、绘制画面，7、判断输赢，8、返回步骤2，9、输出最后结果。
把上面每个步骤用分别的函数来实现，问题就解决了。 

而面向对象的设计则是从另外的思路来解决问题。整个五子棋可以分为：
1、黑白双方，这两方的行为是一模一样的，2、棋盘系统，负责绘制画面，3、规则系统，负责判定诸如犯规、输赢等。
第一类对象（玩家对象）负责接受用户输入，并告知第二类对象（棋盘对象）棋子布局的变化，棋盘对象接收到了棋子的变化就要负责在屏幕上面显示出这种变化，同时利用第三类对象（规则系统）来对棋局进行判定。
（以上例子来自[国内著名问答社区](https://www.zhihu.com/question/28790424/answer/42102986 "知乎")）

----------

随便写点代码，大家看看就好，不要太认真....

``` java
/**
玩家类
**/
public class Player {
    String name;       //棋手名称
    boolean isFirst;  //是否先手
    int color_flag;  //代表颜色  0-白 1-黑
    Table table;//棋盘对象
    
	public Player(String name,boolean isFirst;int color_flag){
	         this.name=name;
	         this.isFirst=isFirst;
	         this.color_flag=color_flag;
	  }
   
	/**
	下棋，x,y为落子坐标
	**/
	public void play(int x,int y) throws Exception{
      if(this.table==null){
         throw new IllegalArgumentException("玩家还未注册到棋盘！");
      }
	  table.setNewPieces(x,y);
	}
    
    public void setTable(Table table){
       this.table=table;
    } 
}
/**
棋盘类
**/
public class Table{
  List<Player> playerList=new ArrayList<Player>();
  Referee referee ；
  public Table(){
   referee =new Referee(this);
  }
  /**
    注册玩家
  **/
  public void registPlayer(Player player) throws Exception {
      //检测棋盘中的玩家是否已满，先手玩家和玩家选色是否冲突。
      .......
     playerList.add(player);
     player.setTable(this);
  }

   /**
    落子
   **/

   public void setNewPieces(int x , int y){
          //重新绘制棋盘
          ......
         //调用裁判对象，判断结果
      if(referee.isEnd){
          End();
        }
   }

   public void End(){
      .......
  }
}
/**
裁判类
**/
public class Referee(){
  Table table；
  public Referee（Table table）{
    this.table=table;
 }

   public boolen isEnd(){
      //判断输赢
      ....
    return false; 
   }
}
```
然而事实上，通过上述示例代码，我们不难发现，即使我们使用面向对象的方式，上面例子里面向过程中提到的几个下棋过程我们还是都实现了的，只不过程被`封装`到了类的方法中。所以说其实**面向对象和面向过程并不是编程的区别，而是设计的区别**。


# 类与对象

`类`的定义就是一个模板，它描述的一类对象的属性与行为。

`对象`则是根据所属`类`模板创造出来的实实在在的事物。

换句话说，**类是抽象的而对象是具体的**。鸭嘴兽是类型，具体的鸭嘴兽A、鸭嘴兽B就是对象了。在JAVA中对象通过`new`关键字声明。 在具体点，《红色警戒》中美国大兵是一`类`兵种，点击制造后从兵营里出来的那个会开枪的家伙就是`对象`了：

![](http://7xrvdu.com1.z0.glb.clouddn.com/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20160927173741.png)

前面说的都是概念性的东西，下面我们说说实际的运用过程中的理解。

## 从数据类型来说

 
以java为例，数据类型分为`基本数据类型`和`引用数据类型`。

基本数据类型就是`byte,short,int,long,double,char,boolean`；其它的，需要用到`new`关键字来赋值的都是引用数据类型。 **类与对象指的便是引用数据的类型与其值**(这里指的类不光是`class`，还包括`接口、数组、枚举、注解`)。
看下面的代码：

```java

int a =1; 

Person b=new Person(); 

```
 
a 和 b 都是本身无意义的变量名。需要关注的是：a的类型是基本数据类型int值为1，而b的类型是Person属于引用类型，其引用的是new Person()这个对象。我们往往会说对象xx，比如这里的对象b。但实际上b只是对象的引用，真正的对象是后面的new Person()。

> 需要注意的是String也是引用数据类型，只不过因为使用率非常高，所以对于String，jvm支持其可  以像基本数据类型一样使用：String a = "abc"; 同等于 String a = new String("abc");

总之呢，简单来说`类`指的的引用数据的类型，`对象`是具体赋的值。为了更深入理解，我们下面需要解释下这个`引用`是如何体现的。

## 什么是引用（从内存来说）
要正在理解什么是类，什么是对象，什么又是引用，就离不开说说java的内存使用方式。

在java中内存被大致划分为`栈`与`堆` （之所以是大致，是因为还包括其它几部分就不在这细说）。






 
 

  


