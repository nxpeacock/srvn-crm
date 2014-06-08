/**
 * Created by nxcong on 05/06/2014.
 */
Categories = new Meteor.Collection('categories');

Categories.allow({
    insert: isAdmin,
    update: isAdmin
})

var isAdmin = function () {
    return (Roles.userIsInRole(this.userId, ['admin']));
}

Meteor.methods({
    insertRoot: function (data) {
        if (data) {
            var tmp = Categories.find({level:0, code: data.code});
            if (!_.has(tmp,'_id')) {
                try {
                    var newRoot = {name : data.name,code : data.code,maxLevel : data.maxLevel,level: 0, lft: 1, rgt: 2, isRoot: true};
                    var id = Categories.insert(newRoot);
                    return id;
                } catch (error) {
                    throw new Meteor.Error(error);
                }
            }
        }
        return [];
    },
    insertNode: function (data) {
        switch (data.position) {
            case 'left' :
                break;
            case 'before':
                break;
            case 'after':
                break;
            default :
                return insertRight(data);
                break;
        }
    },
    moveUp: function (id) {
        if (id) {
            var nodeInfo = Categories.findOne({_id: id});
            if (nodeInfo) {
                var parentInfo = Categories.findOne({_id: nodeInfo.parent});
                if (parentInfo) {
                    var nodeBrother = Categories.find({lft: {$lt: nodeInfo.left}, parent: nodeInfo.parent}).sort({lft: -1}).limit(1);
                    if (nodeBrother) {
                        var data = {
                            id: nodeInfo._id,
                            parent: parentInfo._id,
                            brotherId: nodeBrother._id,
                            position: 'before'
                        };
                        moveNode(data);
                    }
                }
            }
        }
    },
    removeNode: function (data) {
        if (data) {
            if (data.option === 'branch') return removeBranch(data);
            if (data.option === 'node') return removeOne(data);
        }
        return false;
    },
    updateName: function (data) {
        if (data) {
            try {
                Meteor.update({_id: data.id}, {$set: {name: data.name}});
                return true;
            } catch (error) {
                throw new Meteor.Error(error);
            }
            return false;
        }
    },
    breadCrumbs : function(id){
        var currentNode = Categories.findOne(id);
        if(currentNode){
            var results = Categories.find({
                code : currentNode.code,
                lft : {$lt:currentNode.lft},
                rgt : {$gt:currentNode.lft}
            }).fetch();
            var str = '<ul class="breadcrumb">';
                str += "<li><a href='/quanlyhethong/danhmuc'>Danh mục</a></li>";
            _.each(results,function(rs){
                str+='<li><a href="/quanlyhethong/danhmuc/'+rs._id+'">'+rs.name+'</a></li>';
            });
            str+='<li class="active">'+currentNode.name+'</li>';
            str+='</ul>';
            return str;
        }
        return [];
    }
})

var moveNode = function (data) {
    if (data) {

    }
    return false;
}

var widthNode = function (left, right) {
    return right - left + 1;
}

var removeBranch = function (data) {
    if (data.removeId) {
        var infoNodeRemove = Categories.findOne({_id: data.removeId});
        if (infoNodeRemove) {
            if (infoNodeRemove.isLock === false) {
                var rgtNodeRemove = infoNodeRemove.rgt,
                    lftNodeRemove = infoNodeRemove.lft,
                    widthNodeRemove = widthNode(lftNodeRemove, rgtNodeRemove);
                try {
                    Categories.remove({lft: {$gte: lftNodeRemove, $lte: rgtNodeRemove}});
                    Categories.update({lft: {$gt: rgtNodeRemove}}, {$inc: {lft: -widthNodeRemove}});
                    Categories.update({rgt: {$gt: rgtNodeRemove}}, {$inc: {rgt: -widthNodeRemove}});
                    return true;
                } catch (error) {
                    throw new Meteor.Error(error);
                }
            }
        }
    }
    return false;
}

var removeOne = function (data) {
    if(data){
        try{
            var nodeInfo = Categories.findOne(data.id);
            if(nodeInfo){
                var results = Categories.find({parent : nodeInfo._id},{sort:{lft:1}}).fetch();
                var childIds = _.pluck(results,'_id').reverse();

            }
        }catch(error){
            throw new Meteor.Error(error);
        }
    }
    return false;
}

var insertRight = function (data) {
    if (data) {
        try {
            var ids = [];
            if(data.names){
                _.each(data.names,function(name){
                    var parentInfo = Categories.findOne({_id: data.parentId});
                    var parentRight = parentInfo.rgt,
                        parentCode = parentInfo.code;
                    Categories.update({code : parentCode,lft: {$gt: parentRight}}, {$inc: {lft: 2}}, {multi: true});
                    Categories.update({code : parentCode,rgt: {$gte: parentRight}}, {$inc: {rgt: 2}}, { multi: true });
                    var category = {
                        name: name,
                        parent: parentInfo._id,
                        code: parentCode,
                        lft: parentRight,
                        rgt: parentRight + 1,
                        level: parentInfo.level + 1
                    };
                    var id = Categories.insert(category);
                    ids.push(id);
                })
            }

            return ids;
        } catch (error) {
            throw new Meteor.Error(error);
        }
    }
    return [];
}

var insertLeft = function (data) {
    if (data) {
        try {
            var parentInfo = Categories.findOne({_id: data.parentId});
            if (parentInfo) {
                var parentLeft = parentInfo.lft;
                Categories.update({code : parentInfo.code,lft: {$gt: parentLeft}}, {$inc: {lft: 2}}, {multi: true});
                Categories.update({code : parentInfo.code,rgt: {$gt: (parentLeft + 1)}}, {$inc: {rgt: 2}}, {multi: true});
                var newCate = {
                    name: data.name,
                    code: parentInfo.code,
                    parent: parentInfo._id,
                    lft: parentLeft + 1,
                    rgt: parentLeft + 2,
                    level: parentInfo.level + 2
                };
                var id = Categories.insert(newCate);
                return id;
            }
        } catch (error) {
            throw new Meteor.Error(error);
        }
    }
    return [];
}

var insertAfter = function (data) {
    if (data) {
        try {
            var parentInfo = Categories.findOne({_id: data.parentId}),
                brotherInfo = Categories.findOne({_id: data.brotherId});
            if (parentInfo && brotherInfo) {
                Categories.update({code : parentInfo.code,lft: {$gt: brotherInfo.rgt}}, {$inc: {lft: 2}}, {multi: true});
                Categories.update({code : parentInfo.code,rgt: {$gt: brotherInfo.rgt}}, {$inc: {rgt: 2}}, {multi: true});
                var newCate = {
                    name: data.name,
                    code: parentInfo.code,
                    parent: parentInfo._id,
                    lft: brotherInfo.rgt + 1,
                    rgt: brotherInfo.rgt + 2,
                    level: parentInfo.level + 1
                };
                var id = Categories.insert(newCate);
                return id;
            }
        } catch (error) {
            throw new Meteor.Error(error);
        }
    }
    return [];
}

var insertBefore = function (data) {
    if (data) {
        try {
            var parentInfo = Categories.findOne({_id: data.parentId}),
                brotherInfo = Categories.findOne({_id: data.brotherId});
            if (parentInfo && brotherInfo) {
                Categories.update({code : parentInfo.code,lft: {$gte: brotherInfo.lft}}, {$inc: {lft: 2}}, {multi: true});
                Categories.update({code : parentInfo.code,rgt: {$gte: (brotherInfo.lft + 1)}}, {$inc: {rgt: 2}}, {multi: true});

                var newCate = {
                    name: data.name,
                    code: parentInfo.code,
                    parent: parentInfo._id,
                    lft: brotherInfo.lft,
                    rgt: brotherInfo.lft + 1,
                    level: parentInfo.level + 1
                };

                var id = Categories.insert(newCate);
                return id;
            }
        } catch (error) {
            throw new Meteor.Error(error);
        }
    }
    return [];
}