// * Created by nxcong on 27/05/2014.
Meteor.publish('allUsers',function(){
    if(Roles.userIsInRole(this.userId,['admin','mod'])){
        return Meteor.users.find();
    }else{
        this.stop();
        return;
    }
});

Meteor.publish(null, function (){
    return Meteor.roles.find({})
})

Meteor.publish('branches',function(){
    return Branches.find();
});

Meteor.publish('majors',function(){
    return Categories.find({code : 'majors'});
})