Template['header'].events({
    'click #btnLogout' : function(e){
        Meteor.logout(function(err){
            if(err)
                console.log(err);
            Router.go('/dangnhap');
        })
    }
})