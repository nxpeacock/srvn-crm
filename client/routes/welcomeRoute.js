var welcomeController = RouteController.extend({
    template : 'welcome',
    onBeforeAction : filters.authenticate,
    onAfterAction : [filters.activeMenu,filters.printBreadCrumbs]
});

Router.map(function(){
    this.route('welcome',{
        path : '/tiepdon',
        controller : welcomeController
    })
})