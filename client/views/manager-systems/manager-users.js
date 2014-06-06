var showModalUsers = function(){
    $('#modal_manager_users').modal({
        'backdrop' : 'static'
    })
};

var closeModalUsers = function(){
    $('#modal_manager_users').modal('hide');
    $('#modal_manager_users').empty();
};

Template['manager-users'].rendered = function(){
  $(document).ready(function(){
      $('#manager-users-tabs a').on('click',function(e){
          e.preventDefault();
          $(this).tab('show');
      })
  })
};

Template['tab_users'].events({
    "click a[id^='modal-manager-users_']" : function(e){
        e.preventDefault();
        var modalName = $('#'+e.currentTarget.id).attr('data-modal');
        var user = Meteor.users.findOne(this._id,{fields : {services : 0}});
        var data,dom;
        if(modalName === 'addNewUser')
            user = {};
        if(user){
            switch(modalName){
                case 'addNewUser':
                    var branches = Router.getData().branches;
                    var roles = Roles.getAllRoles().fetch();
                    data = {
                        title :'Thêm mới tài khoản',
                        subBranches : branches,
                        style : ''
                    }
                    Session.set('modalType','addNewUser');
                    Session.set('subBranches',branches);
                    Session.set('userRoles',roles);
                    break;
                case 'lockUser':
                    break;
                case 'editUser':
                    var branches = Router.getData().branches;
                    var roles = Roles.getAllRoles().fetch();
                    data = {
                        title : 'Thay đổi thông tin',
                        user : user,
                        style : 'width : 400px !important'
                    }
                    Session.set('manager-users_branchPreSelected',user.profile[0].branchId);
                    Session.set('manager-users_rolesSelected',user.roles);
                    Session.set('subBranches',branches);
                    Session.set('modalType','editUser');
                    Session.set('userRoles',roles);
                    break;
                default:
                    data = {
                        title : 'Thay đổi mật khẩu',
                        user : user,
                        style : 'width : 400px !important'
                    }
                    Session.set('modalType','changePassword')
                    break;
            }
            dom = UI.renderWithData(Template.modal_manager_users,data);
            var modalHTML = dom.render().toHTML();
            $('#modal_manager_users').html(modalHTML).promise().done(function(){
                showModalUsers();
            })
        }
    },
    "click button.btn.saveUser" : function(e,t){
        var modalType = Session.get('modalType');
        switch(modalType){
            case 'changePassword':
                var newPassword = $('#confirmNewPassword').val(),
                    userId = $('#confirmNewPassword').attr('data-id');
                Meteor.call('setUserPassword',userId,newPassword,function(err,isDone){
                    if(err)
                        console.log(err);
                    if(isDone){
                        console.log('Thành công')
                    }
                })
                break;
            case 'editUser':
                var fullName = $('#fullName').val(),
                    userId = $('#fullName').attr('data-id'),
                    email = $('#email').val(),
                    branchId = $('#branch option:selected').val();
                var selectedRoles = [];
                $('#roles :selected').each(function(i,k){
                    selectedRoles[i]=$(k).text();
                });
                var profile = {
                    'emails.0.address' : email,
                    'profile.0.name' : fullName,
                    'profile.0.branchId' : branchId,
                    'roles' : selectedRoles
                };

                Meteor.call('updateUserProfile',userId,profile,function(err,isDone){
                    if(err)
                        console.log(err)
                    if(isDone)
                        console.log('thanh cong')
                })
                break;
            case 'addNewUser':
                var Email = $('#txtEmail').val(),
                    Password = $('#txtConfirmPassword').val(),
                    profile = [{name : $('#txtFullName').val(),branchId : $('#txtBranch').val(),isLock : false}];
                var selectedRoles = [];
                $('#txtRoles :selected').each(function(i,v){
                    selectedRoles[i] = $(v).text()
                });
                Meteor.call('createNewUser',Email,Password,profile,selectedRoles,function(error,id){
                    if(error)
                        console.log(error);
                    if(id)
                        console.log('success :'+id);
                })
                break;
        }
        $('button.btn.cancelUser').html('Đóng');

    },
    "click button.btn.cancelUser" : function(e){
        closeModalUsers();
    }
})
