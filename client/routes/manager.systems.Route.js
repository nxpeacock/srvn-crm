/**
 * Created by nxcong on 26/05/2014.
 */
Router.map(function(){
    this.route('manager-users',{
        path : '/quanlyhethong/nguoidung',
        template : 'manager-users',
        waitOn : function(){
            return [Meteor.subscribe('allUsers'),Meteor.subscribe('branches')];
        },
        data: function(){
            return {
                users : function(){
                    var allUsers = _.clone(Meteor.users.find().fetch());
                    _.map(allUsers,function(user){
                        var branch = Branches.findOne(user.profile[0].branchId);
                        return _.assign(user.profile[0],{'branchName' : branch.name});
                    })
                    return allUsers;
                },
                branches : Branches.find().fetch()
            }
        },
        onBeforeAction : [filters.authenticate]
    }),
    this.route('manager-categories',{
        path : '/quanlyhethong/danhmuc',
        template : 'manager-categories',
        onBeforeAction:filters.authenticate,
        waitOn : function(){
            return [Meteor.subscribe('categories')]
        }
    }),
    this.route('manager-categories-detail',{
        path : '/quanlyhethong/danhmuc/:_id',
        template : 'manager-categories-detail',
        onBeforeAction:filters.authenticate,
        waitOn : function(){
            //return [Meteor.subscribe('categories_detail',this.params._id),Meteor.subscribe('categories_breadCrumbs',this.params._id)];
            return Meteor.subscribe('categories_by_code',this.params._id);
        },
        data : function(){
            try{
                var parent = Categories.findOne(this.params._id);
                console.log('paramId:'+this.params._id +':'+ parent.name);
                if(parent){
                    var childLevel = parent.level +1;
                    var children = Categories.find({lft:{$gt:parent.lft},rgt:{$lt:parent.rgt},level:childLevel});
                    var breadCrumbs = getCategoriesBreadCrumbs(parent._id);
                    return {
                        caption : parent.name,
                        parentId : parent._id,
                        childCategories : children,
                        breadCrumbs : breadCrumbs
                    }
                }
            }catch(error){
                console.log(error);
            }
            return [];
        }
    })
    ,
    this.route('manager-events',{
        path : '/quanlyhethong/sukien',
        template : 'manager-events',
        onBeforeAction:filters.authenticate,
        waitOn : function(){
            return [Meteor.subscribe('branches')]
        }
    })
})
