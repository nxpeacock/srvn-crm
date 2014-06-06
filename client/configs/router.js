/**
 * Created by nxcong on 22/05/2014.
 */
Router.configure({
    layoutTemplate : 'layout',
    notFoundTemplate: '404',
    yieldTemplates : {
        'header' : { to : 'header'},
        'sidebar' : {to : 'sidebar'}
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
}}