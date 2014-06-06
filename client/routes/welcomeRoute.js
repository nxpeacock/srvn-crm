var welcomeController = RouteController.extend({
    template : 'welcome',
    onBeforeAction : filters.authenticate
});

Router.map(function(){
    this.route('welcome',{
        path : '/tiepdon',
        controller : welcomeController
    })
})