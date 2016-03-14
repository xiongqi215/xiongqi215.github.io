---
layout: post
title: "Octopress个人博客搭建"
date: 2015-05-22 15:11:02 +0800
comments: true
categories: Octopress
tags:  [octopress,个人博客]
description: Octopress个人博客搭建
---

![](http://i.imgur.com/47kd0XA.png)

**一直想要做一个属于自己的博客网站。**

试过在`新浪`，`CSDN`上写博客，但总感觉不是很爽，缺少个性化（博主是水瓶座）。后来开始学习PHP，想用wordpress搭建个人网站。学习中发现，wordpress做为个人博客构建工具实在不够轻便，光安装不同的主机提供商就有各种不同的方法，而且wordpress过于强大的功能也让它不在局限于做博客了。

Octopress基于Jekyll使用`Ruby`语言编写，实质是一个静态html生成工具，利用Markdown语言编写博客文章，在通过Github提供的page服务向外发布。
这样好处是明显的,安装好自己主题后，博客撰写不在需要关注如何展示（省去了文字编辑器），而是关注文章内容本身。
另外，最重要一点事省去了租用主机的费用，Github的服务免费的。
<!--more-->
不过Octopress也有明显不足的地方，最为头疼的是前期的环境准备工作。
搭建Octopress需安装的程序:

- Git-1.9.5
- rubyinstaller-2.1.3
- DevKit

另外，编辑makdown可以选择
`markdownpad2` 与 `awesomium_v1.6.6_sdk_win` 的组合。

以上程序我已经放到云盘啦（64位）：[点击下载](http://pan.baidu.com/s/1mgoqUxU) 。

## 一、git环境搭建 ##

----------

先注册[Github](https://github.com/)账号。

安装完Git-1.9.5后，需要完成本地与github的链接。

打开git bash窗口（鼠标右键菜单中选择），输入以下两条命令：
```bash
git config --global user.name "你的github账号"
git config --global user.email"你的github注册邮箱"
```

执行命令生成SSH密钥对:
```bash
ssh-keygen -C "username@email.com" -t rsa
```


**注：出现提示如下两条提示：**
**Enter file in which to save the key (/c/Users/Administrator/.ssh/id_rsa):**
**若不输入文件名，秘钥文件将默认保存到c/Users/Administrator/.ssh/id_rsa （Administrator为当前系统用户）**
**Enter passphrase (empty for no passphrase):**
**输入密码，可以为空。若设置密码，后期每次提交github都需要输入密码。**


登入github，进入setting选择SSH KEYS，点击add ssh key，
打开前面生成的id_rsa.pub文件，将其中内容粘贴到github中。

![](http://i.imgur.com/9pwWnLx.png)

打开git bash 输入：
```bash
$ ssh -T git@github. com
```

执行后若出现一下成功信息，则表示已经与github完成绑定。
<!--more-->


## 二、ruby环境搭建 ##

----------
安装rubyinstaller-2.1.3-x64，解压DevKit-mingw64-64-4.7.2-20130224-1432-sfx

**注意DevKit解压路径不可以有中文。**

**安装rubyinstaller-2.1.3-x64要按下图勾选设置默认环境变量：**
![](http://i.imgur.com/1Hcn5PE.png)

进入Devkit的解压目录，运行git bash, 首先使用`ruby --version` 命令测试下ruby是否成功安装。接着输入：

```bash
ruby dk.rb init
```

打开`config.ym`l文件，在最后添加ruby安装目录，比如： `- D:\Ruby21-x64` 执行命令：

```bash
ruby dk.rb install
```


**注：
若出现任何错误都与config.yml文件中设置的ruby路径有关，请仔细检查。**



## 三、安装octopress: ##


从github上下载octopress，打开git bash 输入命令：
```bash
git clone git://github.com/imathis/octopress.git octopress
```

由于国内网络问题，下载可能出现几次网络错误，需要多试几次。

下载完成后，进入octpress目录，打开git bash。接下来需要为octopress安装默认依赖包。但还是由于国内的网络问题，我们先设置下下载地址到国内的镜像上,执行命令：
```bash
gem sources --remove https://rubygems.org/
gem sources -a http://ruby.taobao.org/
```

**这里非常感谢淘宝提供的软件镜像；**

打开octopress目录下的 `GemFile` 文件 修改source 为`http://ruby.taobao.org/`
执行命令：
```bash
gem install bundler

bundle install
```
等待几分钟.......完成后执行，用于安装默认主题：
```bash
rake install
```

**恭喜，所有本地环境配置完成！！！**


现在，我们便可以运行我们的博客了。执行两个重要命令：
```bash
rake generate //生成网页
rake preview //启动本地预览，默认端口4000。
```

打开浏览器输入localhost:4000,预览你的博客网站吧^.^ 。

**注：从第四步开始，所有的命令、操作都在octopress目录下执行。**


## 四、开始写博文 ##

----------

Ok,既然环境搭建好了，我们开始写博客吧。
通过`rake new_post["title"]`命令，在source/_post下创建一个新的文章，默认文件名如下面的格式:2012-02-16-title.markdown。
然后可以用`VIM`或打`Markdownpad` 开该文件，并在其中输入/编辑文章内容。
再次执行
```bash
rake generate
rake preview
```

打开浏览器就就能看到刚才文章了啦。


## 五、将博客部署到Github上 ##

----------


现在我们将博客部署到Github上。

部署前需要先要在[Github](https://github.com/)上创建一个名为：`username.github.io`的repository， 然后使用'rake setup_github_pages'命令将自己的Blog与上述的repository关联起来。 根据提示输入：
```bash
 git@github.com:username/username.github.io.git
```
**注：username替换为自己github的账户名。**

然后就可以通过下面的命令来部署自己的博客内容至Github了:
```bash
rake deploy  //部署
//上传源码
git status
git add .
git commit -a -m 'comment'
git push origin source
```

开始浏览自己的博客吧！在浏览器的地址栏中输入username.github.io，打开的网站就是自己的博客了，此刻一个独立博客就如此问世了!
