/**
 * Created by nxcong on 29/05/2014.
 */
if(Meteor.isServer){
    Meteor.users.allow({
        update : function(userId,doc){
            if(Roles.userIsInRole(userId,['admin'])){
                return true;
            }
            return false;
        },
        insert : function(userId,doc){
            if(Roles.userIsInRole(userId,['admin'])){
                return true;
            }
            return false;
        }
    })
    Meteor.methods({
        setUserPassword : function(userId,newPassword){
            var currentUser = this.userId;
            var isDone = false;
            if(!currentUser){
                throw new Meteor.Error(401, "Cần đăng nhập để thực hiện chức năng này!");
            }

            if(!Roles.userIsInRole(currentUser,['admin'])){
                throw new Meteor.Error(403, "Không đủ tuổi để thực hiện chức năng này.");
            }

            var user = Meteor.users.findOne(userId);
            if(!user){
                throw new Meteor.Error(404, "Tài khoản này không tồn tại.");
            }

            try{
                Accounts.setPassword(userId,newPassword);
                isDone = true;
            }catch(err){
                throw new Meteor.Error(err);
            }
            return isDone;
        },
        updateUserProfile : function(userId,profile){
            if(!this.userId){
                throw new Meteor.Error(401, "Cần đăng nhập để thực hiện chức năng này!");
            }

            if(!Roles.userIsInRole(this.userId,['admin'])){
                throw new Meteor.Error(403, "Không đủ tuổi để thực hiện chức năng này.");
            }

            var user = Meteor.users.findOne(userId);
            if(!user){
                throw new Meteor.Error(404, "Tài khoản này không tồn tại.");
            }
            Meteor.users.update(userId,{$set:profile},function(error,affected){
                if(error)
                    throw new Meteor.Error(error);
                if(affected !== 0)
                    return affected;
            })
            return false;
        },
        createNewUser : function(email,password,profile,roles){
            if(!this.userId){
                throw new Meteor.Error(401, "Cần đăng nhập để thực hiện chức năng này!");
            }

            if(!Roles.userIsInRole(this.userId,['admin'])){
                throw new Meteor.Error(403, "Không đủ tuổi để thực hiện chức năng này.");
            }
            try{
                var id = Accounts.createUser({
                    email : email,
                    password : password,
                    profile : profile
                });

                Meteor.users.update({_id: id}, {$set:{'emails.0.verified': true}});
                Roles.addUsersToRoles(id,roles);

                return id;
            }catch(error){
                throw new Meteor.Error(error);
            }
        }
    })
}
