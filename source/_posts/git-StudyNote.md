---
layout: post
title: "Git学习笔记--入门"
date: 2016-03-14
comments: true
categories: Git
tags:  [github,git]
description: Git是一款分布式版本控制工具，该篇文章一是作为自己学习的积累，二是希望完成一个Git快速上手教程与大家分享。
---
![git](http://7xrvdu.com1.z0.glb.clouddn.com/0.jpg)
最近在捣鼓自己博客网站，接触到如octopress,Jekyll和Hexo等静态博客生成工具，顺便接触到Git。对于长时间在公司开发，习惯了使用SVN的风格，刚一开始还真不习惯。 现在我使用Hexo+Git,在写文章、生成网页再到发布上已经非常顺手了，故而觉得应该写下这篇文章，一是作为自己学习的积累，二是希望完成一个Git快速上手教程与大家分享。
<!--more -->
目录：
 * [文章目的](#1)
 * [关于版本控制](#2)
    * [集中化版本控制工具](#2.1)
    * [分布式版本控制工具](#2.2)
 * [Git 入门](#3)
    * [创建本地版本库](#3.1)
    * [管理修改](#3.2)
      * [修改提交](#3.2.1)
      * [修改撤销](#3.2.2)
    * [使用远程库](#3.3)
      * [使用Github托管自己的代码库](#3.3.1)
      * [从github克隆代码库](#3.3.2)
 * [总结](#4)
 * [其它详细教程](#5)

# <a id="2">关于版本控制</a>
以下我对版本控制的理解:

版本控制工具就是这样一种工具，它用于记录我们对文件每一次修改记录，以便日后回溯每一次的变更内容。每次的变更我们称之为`版本`，对这些版本的管理即为版本管理。版本控制工具能够提供记录修改、提交修改、更新到最新版本、与其他版本合并以及撤销当前版本或回滚到指定版本。

版本控制工具大概分为以下二类：
 - 集中化版本控制工具
 - 分布式版本控制工具

## <a id="2.1">集中化版本控制工具</a>
我们最常用的SVN就属于集中化版本控制工具，它的特点是所有的版本信息都集中保存在一个中央服务器中，项目人员需要从中央服务器中更新到最新版本，然后干完后后提交自己的部分到中央服务器中。
在使用集中化版本控制工具的项目中，项目组每个人都可以在一定程度上看到项目中其他人改动些什么。而项目经理也可以轻松掌控每个开发者的权限，并且管理一个 SVN服务器 要远比在各个客户端上维护本地版本来得轻松容易。这种集中化的版本控制适合于企业内部的开发，多年以来，这已成为版本控制系统的标准做法。
但是，集中化版本控制的弊端就是依赖网络，也就是说每个人都必须能够连接上中央服务器。如果网络发生异常，无法连接到中央服务器，那么你今天完成部分就无法提交，必须等到网络问题解决后。而通常在网络问题解决后，你面临可能不光是提交之前工作的问题了。

![集中化版本控制](http://7xrvdu.com1.z0.glb.clouddn.com/18333fig0102-tn.jpg)
*（图片来自[廖雪峰的官方网站](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000 "廖雪峰的官方网站")）*

比如，我的工作中就经常发生这样一种情况。接到任务，需要在一个service层java类中扩展几个方法。完成后，单元测试完，准备提交，发现网络断了，代码不能提交。OK，那明天再来提交吧。但是领导不会让你干等呀，加任务，还是原来的类，再扩展几个方法。写到一半，网络好了，前面的代码要求提交。这时，一个很尴尬的问题出现了，我写了A,B,C,D四个方法，A,B可以提交，C,D只写到了一半，显然是不能提交的。但是它们在一个文件里！！！怎么办？只能把C和D的代码剪切掉，再提交，再把C和D复制回来！，搞定！继续干活。

又或者，假如不是扩展独立的方法，而是修改了大段代码，而且修改的地方的非常分散，那么这种人工的处理方式就很有难保证不造成遗漏了。

## <a id="2.2">分布式版本控制工具</a>
为解决集中化版本控制工具的弊端，分布式版本控制工具，比如Git就出现了。
![ 分布式版本控制](http://7xrvdu.com1.z0.glb.clouddn.com/18333fig0101-tn.jpg)

*（图片来自[廖雪峰的官方网站](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000 "廖雪峰的官方网站")）*

这一类版本控制工具的特点是本地版本库+远程版本库。项目组人员并不是单纯的从服务器中获取最新版本的文件了，而是把代码仓库完整地镜像下来，你的版本维护都存储在你本地中。你可以根据任务情况，在本地中维护一系列版本，并且提交（commit)。最后在根据要求推送（push）需要的版本到远程的版本库中。而且项目组人员也可互相推送（push)或提取（pull)。这样能够保证远程版本库中的代码不会出现混乱。
用一句简单得话来概况，分布式版本控制中的分布式指定是版本的分布式。

大名鼎鼎的[Github](https://github.com/)就是一个基于Git的项目托管平台，每个人都可以在上面建立自己远程代码库，然后使用Git做为版本管理工具。换句话，Github为我们提供了分布式版本控制中的远程库。

#  <a id="3">Git 入门</a>
## Git-准备
下载并成功安装Git后（至于如何安装，请百度。我是windows平台，一路下一步就OK了）, 你的鼠标右键菜单应该能看到如下几个选择：

![git bash here](http://7xrvdu.com1.z0.glb.clouddn.com/git1.png)

点击`git bash here`或者在你的开始菜单中“Git”->“Git Bash”，如果弹出下面命令窗口说明Git安装成功:

![git CMD](http://7xrvdu.com1.z0.glb.clouddn.com/git2.jpg)
执行下面的命令，用于注册你的身份
``` bash
$ git config --global user.name "Your Name"
$ git config --global user.email "email@example.com"
```
**注意git config命令的--global参数，用了这个参数，表示你这台机器上所有的Git仓库都会使用这个配置，当然也可以对某个仓库指定不同的用户名和Email地址。**

## <a id="3.1"> 创建本地版本库</a>
`repository`--版本库或称为仓库,可以简单理解成一个目录，这个目录里面的所有文件都可以被Git管理起来，每个文件的修改、删除，Git都能跟踪，以便任何时刻都可以追踪历史，或者在将来某个时刻可以“还原”。在你需要创建版本库的文件夹中打开`git bash`,并执行如下命令：
```bash
$ git init
```
成功后你会看到如下提示：
![git init](http://7xrvdu.com1.z0.glb.clouddn.com/git3.jpg)

你一定会注意到这句话：`Initialized empty Git repository in xxxxx`, 这说明你的`repository`建立成功了。而且在该目录下会多出一个`.git`的文件夹，类似于SVN中的`.svn`，都是用于保存版本相关信息的。

## <a id="3.2">管理修改</a>
`管理修改`就是我们平时工作时，对文件产生的修改以及对修改的提交、撤销操作。
Git一个非常优秀的设计是在Git当中版本管理的单位是`修改`而非文件。所谓修改包括新增一个文件，删除一个文件，或在文件当中新增，修改或删除一行。每一次的修改都会使文件的状态发生改变。
![file status](http://7xrvdu.com1.z0.glb.clouddn.com/18333fig0201-tn.png)
*（git中的文件状态变化，图片来自[Pro Git](http://http://iissnan.com/progit/html/zh/ch2_2.html "Pro Git")）*
下面我们一步步操作来详细看下Git是如何体现以修改为单位的管理。

### <a id="3.2.1">修改提交：</a>
首先，当我们完成工作需要提交文件时，需要执行如下两个命令：

```bash
$ git add <fileName>
```
和
```bash
$ git commit -m '提交说明'
```
在使用这些命令前，需要了解一下git中一个非常重要的概念----**暂存区**。
暂存区是git中最重的概念之一。先说下相对暂存区，还有一个概念叫工作区（Working Directory）。工作区很好理解，就是我们在电脑里能看到的目录，比如我的`gitStudy`文件夹就是一个工作区：
![Working Directory](http://7xrvdu.com1.z0.glb.clouddn.com/Working Directory.jpg)
在这个文件夹中有一个`.git`的文件夹，这个是git的版本库。
Git的版本库里存了很多东西，其中最重要的就是称为stage（或者叫index）的暂存区，还有git为我们自动创建的第一个分支master，以及我们刚才说到过的HEAD指针，它当前分支master。下图将展示工作区，暂存区和分支的一个关系：
![git stage](http://7xrvdu.com1.z0.glb.clouddn.com/git%20stage.jpg)
图中可以看出，当我们使用`add`命令时，实际上就是把文件修改从工作区添加到暂存区。

而当我们使用`commit`命令是，则是将暂存区中所有的修改提交到当前分支(master)中，提交以后暂存区将被清空。

例如我们在仓库中新建一个readme.txt文件，并提交它，如下图：
![git add/commit](http://7xrvdu.com1.z0.glb.clouddn.com/git4.jpg)
命令执行完成后readme.txt便被提交到了`master`分支中。而且，我们通过命令结果输出可以清楚的看到`1 file changed , 0 insertions(+), 0 deletions(-)`。**需要注意的是git add执行成功后不会有任何输出**。
接下我们编辑下`readme.txt`，插入一句话：*first edit* 然后再次提交：
![git add/commit](http://7xrvdu.com1.z0.glb.clouddn.com/git5.jpg)
这次我们通过命令结果输出可以看到`1 file changed , 1 insertions(+)`。

我们可以清楚的发现，Git记录的不光是文件的新增，同时也包含了文件中具体修改-----新增多少行货删除多少行。而不是像如SVN，我们一般只能看add file、upadte file或delete file。

另外我们还可以使用`git status`命令跟踪文件的状态。比如，当我们新建readme.txt时执行`git status`,如图：
![git status](http://7xrvdu.com1.z0.glb.clouddn.com/git6.jpg)
输出结果表示 readme.txt 是`untracked` 状态，并且提示我们使用`add <file>` 命令。然后我们执行
```bash
  $ git add readme.txt
```
再次执行`git status`：
![git status](http://7xrvdu.com1.z0.glb.clouddn.com/git7.jpg)
这时readme.txt已经在暂存区(`stage`)中了。

接下来我们使用`git commit` 来提交，并查看提交后的状态：
![git status](http://7xrvdu.com1.z0.glb.clouddn.com/git8.jpg)
命令结果显示没有需要提交的内容了。

再举一个例子，比如当我们对`readme.txt`进行一次修改后执行`add`,然后再次修改但不执行`add`命令。
![git status](http://7xrvdu.com1.z0.glb.clouddn.com/git17.jpg)
从图中可以看出，`git status`命令显示的结果有两条：上面的状态显示第一次修改已经在暂存区中，而第二次修改还是` not staged` 未加入暂存区。
这个例子也很好的说明了`暂存区`的概念，同时证明了git中对于修改的管理是以`修改`本身为单位，而非文件。

### <a id="3.2.2">修改撤销：</a>
工作中往往可能出现各种错误，使用版本管理工具的好处就是我们可以随时弥补错误。
Git中可以使用 `git checkout -- <fileName>` 和`git reset ` 两个命令来完成修改的撤销。
**git checkout -- <fileName> 如果不加 ‘-- <fileName>’ 则是进行分支切换**
我们先来看下`git checkout -- <fileName>` 命令的使用：
>命令`git checkout  -- <fileName> ` 意思就是，把文件<fileName>在工作区的修改全部撤销，这里有两种情况：
>一种是`<fileName>`自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；
> 一种是`<fileName>`已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。
> 总之，就是让这个文件回到最近一次git commit或git add时的状态。

*修改后还没有被放到暂存区使用`git checkout  -- <fileName> `*
![git](http://7xrvdu.com1.z0.glb.clouddn.com/git9.jpg)
在通过`add`命令前使用`git checkout  -- <fileName> ` 会将文件内容还原为修改前的内容。

*已经添加到暂存区后，又作了修改，使用`git checkout  -- <fileName> `*
![git](http://7xrvdu.com1.z0.glb.clouddn.com/git10.jpg)

接下来是`git reset `。
使用`git reset `可以将文件从暂存区撤销，或者可以将已经commit 的文件进行版本回退。
*使用`git reset HEAD  <fileName> ` 完成从暂存区撤销*
![git](http://7xrvdu.com1.z0.glb.clouddn.com/git11.jpg)
OK，这次修改已经回到了add前，这意味着你可以重新修改文件，再执行add 操作。
再接下来，我们使用`git reset `进行版本操作。
先简单说下git 版本回退的原理。回想前面在`git reset HEAD  <fileName> `命令中出现的 `HEAD` 参数，它其实是git中的版本指针，并且指向的是当前分支的最新版本，比如我们这里的分支是`master`。
所以git中的版本回退原理其实就是将`HEAD`指针指向其他版本号。

这里出现了一个问题，`版本号`从何而来？ 我们可以使用`git log`查询提交记录：
![git log](http://7xrvdu.com1.z0.glb.clouddn.com/git12.jpg)
图中如`292ac30e27a81f66b04a56cffa44074ae353aae7`等一长串的数字就是git中的版本号。
>Git的版本号不像svn使用1，2，3……递增的数字，而是一个SHA1计算出来的一个非常大的数字，用十六进制表示。
这样做的目的是因为git是分布式的版本管理工具，单纯的1,2,3..递增显然很容易出现冲突的。

刚才说到过`HEAD`指向的是最新版本，那么上个版本就是HEAD^,上上个就是HEAD^^,因此我们可以使用如下命令完成版本回退
```bash
git reset --hard HEAD^
```
或者直接指明版本号
```bash
git reset --hard b7568c296
```
`b7568c296`就是你需要回退到的版本，git支持简短缩写版本号，它会自动匹配。当然不要太短了，至少7-8位吧。
![git reset](http://7xrvdu.com1.z0.glb.clouddn.com/git13.jpg)
![git reset](http://7xrvdu.com1.z0.glb.clouddn.com/git14.jpg)
回退成功后，查看`readme.txt`，其中内容应该也相应回到回退版本相应的内容。但是，从图中你会发现，版本回退后，前面的版本号已经没了，这时想后悔怎么办？
没关系，git中总有后悔药吃。我们可以使用`git reflog` 查看所有操作的记录，从而得版本号：
![git reset](http://7xrvdu.com1.z0.glb.clouddn.com/git15.jpg)

### 小结
总结一下上面说到过的git中关于修改管理的基础命令：
- 文件修改后使用`add <fileName>`或 `add .`将指定文件修改或者文件下所有修改保存到`暂存区`中。
- 如果在执行`add`前发现修改中存在问题，可以使用`git checkout -- <fileName>` 将指定的文件修改撤销。
- 如果执行`add`发现修改中存在问题，可以使用`git reset HEAD  <fileName> ` 将指定的文件修改从`暂存区`撤出。
- 确认无误后，使用`git commit -m '修改说明'`将`暂存区`中的修改提交到当前分支中。在提交前，最好使用下`git status` 查看当前有哪些修改提交到暂存或哪些修改还未暂存，避免出现错误的提交或在遗漏提交。
- 在提交完成后，假如需要版本回退，可以使用`git reset --hard HEAD^`回退指定个版本，或者使用`git reset --hard b7568c296 ` 回退到指定版本号，版本号可以通过`git log`查询。

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
