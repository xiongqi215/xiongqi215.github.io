$(function(){
$("img").lazyload({   
placeholder : "/images/loading.gif",   
effect : "fadeIn"  
}); 


});


<!-- 多说公共JS代码 start (一个网页只需插入一次) -->

var duoshuoQuery = {short_name:"justin-blog"};
	(function() {
		var ds = document.createElement('script');
		ds.type = 'text/javascript';ds.async = true;
		ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
		ds.charset = 'UTF-8';
		(document.getElementsByTagName('head')[0] 
		 || document.getElementsByTagName('body')[0]).appendChild(ds);
	})();

<!-- 多说公共JS代码 end -->


$(function(){
        //当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
        $(function () {
            $(window).scroll(function(){
                if ($(window).scrollTop()>100){
                    $("#back-to-top").fadeIn(1500);
                    $("#back-to-top").css("bottom",$(window).scrollTop());
                }
                else
                {
                    $("#back-to-top").fadeOut(1500);
                }
            });
 
            //当点击跳转链接后，回到页面顶部位置
 
            $("#back-to-top").click(function(){
                $('body,html').animate({scrollTop:0},1000);
                return false;
            });
        });
    });
