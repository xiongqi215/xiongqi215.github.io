---
layout: post
title: "Git学习笔记（二）"
date: 2016-03-29
comments: true
categories: Git
tags:  [github,git]
description: Git是一款分布式版本控制工具，该篇文章一是作为自己学习的积累，二是希望完成一个Git快速上手教程与大家分享。
---

![github](http://7xrvdu.com1.z0.glb.clouddn.com/github_logo)
## <a id="3.3"> 远程库的使用</a>

前面说到的都是git在本地的操作，那么实际协作开发过程中我们肯定是要有一个远程版本库作为项目的核心版本库，也就是投入生产使用的版本。这里我们以 [Github](https://github.com/ "Github")为例。Github是一个开放的git远程服务器，首先我们先注册一个github账户，如何注册就不在这里说了绑定本地版本库与Github远程库有两种方式，一种是以ssh协议连接，在这方式下我们需要先绑定一个ssh key，这个在下面会说。还有一种是https协议，但是使用`https`速度慢会比慢，而且每次推送(`push`)都必须输入口令，但是在某些只开放http端口的公司内部就无法使用ssh协议而只能用https。
### <a id="3.3.1">使用Github托管自己的代码库</a>
如果你已经注册完你的Github账户，新增需要在生成一个`ssh key`，这个key用于验证你的身份是该版本库的创立者，也就是如上面说的允许你使用`ssh`方式连接Github上的远程库。执行如下命令生成`ssh key`:
```bash
$ ssh-keygen -t rsa -C "youremail@example.com"
```
**注意把`youremail@example.com`改为你的邮箱。** 命令执行过程只能够会要求你设置密码，这个可选的，如果设置了密码，后面每次提交也许输入密码。最后你可以在用户目录下找到.ssh文件夹（我的是`C:\Users\Justin\.ssh`)里面有`id_rsa`和`id_rsa.pub`两个文件，这两个就是SSH Key的秘钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉任何人。
接下来我们需要绑定这个key到你的github账户中:
![github sshkey](http://7xrvdu.com1.z0.glb.clouddn.com/githu%20sshkey.jpg)
填上任意Title，在Key文本框里粘贴`id_rsa.pub`文件的内容,点“Add Key”，你就应该看到已经添加的Key。
>当然，GitHub允许你添加多个Key。假定你有若干电脑，你一会儿在公司提交，一会儿在家里提交，只要把每台电脑的Key都添加到GitHub，就可以在每台电脑上往GitHub推送了。

接下来我们在Github上建立一个名为`gitstudy`的`Repository`：
![github](http://7xrvdu.com1.z0.glb.clouddn.com/github1.jpg)
![github](http://7xrvdu.com1.z0.glb.clouddn.com/github2.jpg)
![github](http://7xrvdu.com1.z0.glb.clouddn.com/github3.jpg)
GitHub告诉我们，可以从这个仓库克隆出新的仓库，也可以把一个已有的本地仓库与之关联，然后，把本地仓库的内容推送到GitHub仓库。
**Github的Repository分为public 和 private 两种。 public是公共的也就是谁都能查看，如果是商业项目的话还是使用private的吧，不过github要收保护费。**
现在，我们根据GitHub的提示，在本地的仓库的目录，也就前面用到的`gitStudy`下运行命令：
```bash
git remote add origin git@github.com:xiongqi215/gitstudy.git
```
其中`xiongqi215`更换成你的github账户。 另外`origin`是远程库在你本地的名字，这个git默认的叫法，一般情况下不需要修改。
下一步，就可以把本地库的所有内容推送到远程库上,使用命令
```bash
git push -u origin master
```
把本地库的内容推送到远程，用`git push`命令，实际上是把当前分支master推送到远程。

由于远程库是空的，我们第一次推送master分支时，加上了-u参数，以后就不需要加上这个参数了：
[github push](http://7xrvdu.com1.z0.glb.clouddn.com/git%20push.jpg)
**如果前面建立ssh key的时候你设置了密码，那么push过程中你也会看到`Enter passphrase for key '/c/Users/Justin/.ssh/id_rsa':`的提示，这时你需输入之前设置的密码。**
成功`push`后，查看Github上的`gitstudy`库，发现所有文件已经推送上去了，并且是最新的版本。

### <a id="3.3.2">从github克隆代码库</a>
现在，假设我们换了一台电脑，或者我们需要克隆别人在Github上的某个库时，我们需要使用`git clone`:
```bash
git clone  git@github.com:xiongqi215/gitstudy.git
```
同样`xiongqi215`更换成你的github账户。
![github clone](http://7xrvdu.com1.z0.glb.clouddn.com/git%20clone.jpg)

现在，我们的已经在github建立了一个远程库，同时这个库被`clone`到了多台电脑上。
这时假如A电脑`push`了一些修改到远程库中，B电脑需要更新到这部分修改，那么可以使用如下命令：
```bash
git pull origin master
```
![github pull](http://7xrvdu.com1.z0.glb.clouddn.com/github%20pull.jpg)

###  小结
- 要绑定本地库与远程库，使用命令`git remote add origin git@server-name:path/repo-name.git`。
- 绑定后后，使用命令`git push -u origin master`第一次推送master分支的所有内容。
- 以后，只要使用`git push origin master`推送最新修改。
- 使用`git clone  git@server-name:path/repo-name.git`命令克隆一个远程库到本地。
- 多台电脑可以使用 `git pull origin master`抓取相互提交到远程库中的最新修改。

# <a id="4">总结</a>
Git是个非常高效的版本控制工具。分布式的、基于修改的管理方式非常适合多人协调完成开发工作。
>分布式版本系统的最大好处之一是在本地工作完全不需要考虑远程库的存在，也就是有没有联网都可以正常工作，而SVN在没有联网的时候是拒绝干活的！当有网络的时候，再把本地提交推送一下就完成了同步，真是太方便了！

这次学习笔记还有很多内容没有涉及，本人还在学习当中。后面陆续补充如`分支管理`、`冲突处理`等内容。这里再提供一份命令手册供大家[下载](http://7xrvdu.com1.z0.glb.clouddn.com/git-cheatsheet.pdf "下载")。

# <a id="5">其它详细教程</a>
- [Pro Git中文翻译 by iissnan](http://iissnan.com/progit/html/zh/ch1_0.html "Pro Git中文翻译")

- [廖雪峰的官方网站](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000 "廖雪峰的官方网站")
