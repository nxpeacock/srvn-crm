/**
 * Created by nxcong on 29/05/2014.
 */
UI.registerHelper('selected',function(foo){
    var bar = Session.get('manager-users_branchPreSelected');
    return foo === bar ? 'selected' : ''
})

UI.registerHelper('manager_users_roles_selected',function(foo){
    var foobar = Session.get('manager-users_rolesSelected');
    return (_.contains(foobar,foo))? 'selected' : '';
})