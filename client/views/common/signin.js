Template['signin'].events({
    'submit #login-form' : function(e,t){
        e.preventDefault();
        var email = t.find('#email').value,
            password = t.find('#password').value;
        Meteor.loginWithPassword(email,password,function(err){
            if(err){
                console.log(err);
            }else{
                console.log('dang nhap thanh cong');
                Router.go('/');
            }
        });
        return false;
    }
})