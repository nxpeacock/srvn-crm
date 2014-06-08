// * Created by nxcong on 27/05/2014.
Meteor.publish('allUsers', function () {
    if (Roles.userIsInRole(this.userId, ['admin', 'mod'])) {
        return Meteor.users.find();
    } else {
        this.stop();
        return;
    }
});

Meteor.publish(null, function () {
    return Meteor.roles.find({})
})

Meteor.publish('branches', function () {
    return Branches.find();
});

Meteor.publish('categories', function () {
    return Categories.find();
});

Meteor.publish('categories_filter', function (criteria) {
    return Categories.find(criteria);
});

Meteor.publish('categories_by_code',function(parentId){
    var parent = Categories.findOne(parentId);
    return Categories.find({code : parent.code});
})

Meteor.publish('categories_detail', function (parentId) {
    var parent = Categories.findOne(parentId);
    var parentAndChildren = Categories.find({code : parent.code,lft: {$gte: parent.lft}, rgt: {$lte: parent.rgt}});
    return parentAndChildren;
});

Meteor.publish('categories_breadCrumbs',function(id){
    var currentNode = Categories.findOne(id);
    if(currentNode) {
        var results = Categories.find({
            code: currentNode.code,
            lft: {$lt: currentNode.lft},
            rgt: {$gt: currentNode.lft}
        }
        );
        return results;
    }
    return [];
})
Meteor.publish('rootCategories', function () {
    return RootCategories();
});

Meteor.publish('majorsCategories', function () {
    return MajorsCategories();
})