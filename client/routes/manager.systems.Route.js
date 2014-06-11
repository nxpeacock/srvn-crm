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
                branches : Branches.find({},{sort:{orderNo:1}}).fetch()
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
                    var children = Categories.find({lft:{$gt:parent.lft},rgt:{$lt:parent.rgt},level:childLevel},{sort:{lft:1}});
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
            return [Meteor.subscribe('branches'),Meteor.subscribe('events')]
        },
        data : function(){
            try{
                var rs = Events.find({},{sort : {createdDate:-1}}).fetch();
                var branches = Branches.find().fetch();
                var events = [];
                _.each(rs,function(r){
                    var time = moment(r.startDate).format('DD/MM/YYYY') + ' - ' + moment(r.endDate).format('DD/MM/YYYY');
                    if(moment(r.startDate).isSame(r.endDate)){
                        time = moment(r.endDate).format('DD/MM/YYYY');
                    }
                    var locations = [];
                    _.each(r.locations,function(l){
                        var i = _.where(branches,{'code' : l});
                        locations.push(i[0].name);
                    });
                    //console.log(locations);
                    events.push({
                        _id : r._id,
                        name : r.name,
                        description : r.description,
                        time : time,
                        locations : locations
                    })
                })
                return {
                    Events : events
                }
            }catch(error){
                console.log(error)
            }
            return [];
        }
    })
})
