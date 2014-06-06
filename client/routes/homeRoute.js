/**
 * Created by nxcong on 26/05/2014.
 */
var homeController  = RouteController.extend({
    template : 'dashboard',
    onBeforeAction : filters.authenticate
});

Router.map(function(){
    this.route('dashboard',{
        path : '/',
        controller : homeController
    })
})