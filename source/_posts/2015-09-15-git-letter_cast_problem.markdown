---
layout: post
title: "配置Git支持大小写敏感"
date: 2015-09-10 17:57:14 +0800
comments: true
categories: Git
tags:  [github,git]
description: Git 提交时大小写的问题
---




- 方案一是设置Git大小写敏感：

```bash
$ git config core.ignorecase false
```



- 方案二是先删除文件，再添加进去：
```bash
 $ git rm ; git add  ;  
 $ git commit -m "rename file"
```

<!--more-->