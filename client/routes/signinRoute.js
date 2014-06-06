/**
 * Created by nxcong on 26/05/2014.
 */
var signinController = RouteController.extend({
    template : 'signin',
    layoutTemplate : 'blankLayout'
});

Router.map(function(){
    this.route('signin',{
        path : '/dangnhap',
        controller : signinController
    });
})
