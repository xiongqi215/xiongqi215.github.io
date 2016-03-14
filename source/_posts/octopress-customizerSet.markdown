---
layout: post
title: "Octopress个性配置"
date: 2015-05-24 17:57:14 +0800
comments: true
categories: Octopress
tages:  [octopress,个人博客]
description: Octopress个人博客搭建,Octopress 个性化
---

Octopress 有许多可以个性化设置的地方。
简单的可以通过'rake install[ThemeName]' 安装主题。 也可以修改导航、增加自定义页面、侧边栏等。当然，增加插件什么也不在话下，如果会Ruby语言，也可以自己写插件。大部分的配置在官网上就能查到（[octopress-help](http://octopress.org/help/)）。为方便日后查看，在此也做个简单的整理。

<!--more-->

## 一、_config.yml 全局配置##

----------
Octopress根目录下有一个_config.yml文件，这个是全局配置文件。一般的，刚装好需要设置下面几项基本的参数：
```properties
url: http://xiongqi215.github.io            # 博客地址
title: Justin-Blog          	                # 博客标题
subtitle: 用心甘情愿的态度，过随遇而安的生活    # 副标题
author: Justin                              # 你的姓名、网名
simple_search: https://www.baidu.com/      # 搜索引擎
description: Justin的个人博客 Octopress BootStrap 响应式布局                              
# 博客默认的描述，出现在HTML页面中的 meta 中的 description

subscribe_rss:                   # Url for your blog's feed, defauts to /atom.xml
subscribe_email:                # Url to subscribe by email (service required)
email:              # Email address for the RSS feed if you want it.
```


**注：参数值与前面的':'之间必须要有个空格！**


##二，添加多说评论

----------
Octopress 默认使用`Disqus`作为社交评论工具，由于国内网络问题，我们需要改为`多说`。

首先登陆[多说](http://duoshuo.com/)注册账号，然后点击`我要安装`，填入站点与个人信息，创建。

![](http://i.imgur.com/KhU01wA.png)

复制代码：

![](http://i.imgur.com/xCQbtOr.png)



打开_config.yml文件，关闭Disqus评论开关，增加多说评论开关

```properties
disqus_show_comment_count: false

#duoshuo
duoshuo_comments: true
```

在`source/_includes/post/`新建`duoshuo_thread.html`将刚才复制的代码粘贴进去。按如下代码修改：
- 将data-thread-key值改为{% raw %}{{page.id}}{% endraw %}
- 将data-title值改为{% raw %}{{ page.id }}{% endraw %}
- 将data-url值改为{% raw %}{{sit.url}}{{page.url}}{% endraw %}

打开`octopress\source\_layouts\post.html`,将
```xml
{% raw %}{% if site.disqus_short_name and page.comments == true %}{% endraw %}
     <section>
    <h1>Comments</h1>
    <div id="disqus_thread" aria-live="polite">{% raw %}{% include post/disqus_thread.html %}{% endraw %}</div>
    </section>
{% raw %}{% endif %}{% endraw %}
```

替换为：
```xml
{% raw %} {% if site.duoshuo_comments == true %}{% endraw %}

    <section>
      <h1>评论</h1>
      <div id="disqus_thread" aria-live="polite">{% raw %}{% include duoshuo_thread.html %}{% endraw %}</div>
    </section>

{% raw %}{% endif %}{% endraw %}
```

执行`rake generate` 和 `rake preview` 查看效果吧^.^

##三、添加分享工具
打开_config.yml文件，关闭Twitter分享开关，增加JiaThis评论开关
```properties
    twitter_tweet_button: flase
    
    #jiathis
    jiathis_share: true
```
从[jiaThis](http://www.jiathis.com/)上获取代码，这个比较简单，就不在这罗列了。
在`octopress\source\_includes\post`下新建`jiathis.html`，并将jiathis代码放入。接着将`octopress\source\_includes\sharing.html` 中以下代码：

```xml
{% raw %}{% if site.twitter_tweet_button %}

  <a href="http://twitter.com/share" class="twitter-share-button" data-url="{{ site.url }}{{ page.url }}" data-via="{{ site.twitter_user }}" data-counturl="{{ site.url }}{{ page.url }}" >Tweet</a>

  {% endif %}
{% endif %}{% endraw %}
```

替换为：
```xml
{% raw %}{% if site.twitter_tweet_button %}
{% include post/jiathis.html %}
  {% endif %}
{% endif %}{% endraw %}
```