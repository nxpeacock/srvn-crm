/**
 * Created by nxcong on 10/06/2014.
 */
isAdmin = function () {
    return (Roles.userIsInRole(this.userId, ['admin']));
}

isAdminOrMod = function(){
    return (Roles.userIsInRole(this.userId, ['admin','mod']));
}
