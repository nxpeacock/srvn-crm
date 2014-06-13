/**
 * Created by nxcong on 22/05/2014.
 */
Router.configure({
    layoutTemplate : 'layout',
    notFoundTemplate: '404',
    yieldTemplates : {
        'header' : { to : 'header'},
        'sidebar' : {to : 'sidebar'},
        'footer' : {to : 'footer'}
    }
});

filters = {
    authenticate : function(){
        var user ;
        if(!Meteor.loggingIn()){{
            user = Meteor.user();
            if(!user){
                Router.go('/dangnhap');
                this.pause();
                return;
            }
        }
    }
},
activeMenu : function(){
    $(document).ready(function(){
        setTimeout(function(){
            curPath=function(){var c=window.location.pathname;var b=c.slice(0,-1);var a=c.slice(-1);if(b==""){return"/"}else{if(a=="/"){return b}else{return c}}};
            $('nav li.active').removeClass("active");
            var curNav = $('nav li:has(a[href="' + curPath() + '"])');
            if(curNav){
                $(curNav).addClass("active");
            }else{

            }

        },50);
    })
},
printBreadCrumbs : function(){
    $(document).ready(function(){
        setTimeout(function(){
            var nav_elems = $('nav li.active > a'), count = nav_elems.length;
            $('.breadcrumb').empty();
            $('.breadcrumb').append($("<li><i class='fa fa-home'></i></li>"));
            nav_elems.each(function() {
                $('.breadcrumb').append($("<li></li>").html($.trim($(this).clone().children(".badge").remove().end().text())));
                // update title when breadcrumb is finished...
                if (!--count) document.title = $('.breadcrumb').find("li:last-child").text();
            });

        },100)
    })
}
}
