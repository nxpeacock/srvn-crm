/**
 * Created by nxcong on 05/06/2014.
 */
Categories = new Meteor.Collection('categories');

Categories.allow({
    insert: isAdmin,
    update: isAdmin,
    remove : isAdmin
})

/*var isAdmin = function () {
 return (Roles.userIsInRole(this.userId, ['admin']));
 }*/

Meteor.methods({
    insertRoot: function (data) {
        if (data) {
            var tmp = Categories.find({level: 0, code: data.code});
            if (!_.has(tmp, '_id')) {
                try {
                    var newRoot = {name: data.name, code: data.code, maxLevel: data.maxLevel, level: 0, lft: 1, rgt: 2, isRoot: true};
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
    removeNode: function (id) {
        if (id) {
            var nodes = Categories.find({parent : id}).count();
            console.log(nodes)
            if(nodes === 0)
                return removeBranch(id);
            if(nodes > 0)
                return removeOne(id);
        }
        return false;
    },
    updateName: function (data) {
        if (data) {
            try {
                Categories.update({_id: data.id}, {$set: {name: data.name}});
                return true;
            } catch (error) {
                throw new Meteor.Error(error);
            }
            return false;
        }
    },
    breadCrumbs: function (id) {
        var currentNode = Categories.findOne(id);
        if (currentNode) {
            var results = Categories.find({
                code: currentNode.code,
                lft: {$lt: currentNode.lft},
                rgt: {$gt: currentNode.lft}
            }).fetch();
            var str = '<ul class="breadcrumb">';
            str += "<li><a href='/quanlyhethong/danhmuc'>Danh mục</a></li>";
            _.each(results, function (rs) {
                str += '<li><a href="/quanlyhethong/danhmuc/' + rs._id + '">' + rs.name + '</a></li>';
            });
            str += '<li class="active">' + currentNode.name + '</li>';
            str += '</ul>';
            return str;
        }
        return [];
    }
})

var moveNode = function (data) {
    if (data) {
        if (data.position == 'right' || data.position === undefined) moveRight(data);
        if (data.position == 'left') moveLeft(data);
        if (data.position == 'after') moveAfter(data);
        if (data.position == 'before') moveBefore(data);
    }
    return false;
}

var moveAfter = function (data) {
    if (data) {
        try {
            var infoMoveNode = Categories.findOne(data.id),
                lftMoveNode = infoMoveNode.lft,
                rgtMoveNode = infoMoveNode.rgt,
                widthMoveNode = widthNode(lftMoveNode, rgtMoveNode);

            Categories.update({code: infoMoveNode.code, lft: {$gte: lftMoveNode}, rgt: {$lte: rgtMoveNode}}, {$inc: {rgt: -rgtMoveNode, lft: -lftMoveNode}});

            Categories.update({code: infoMoveNode.code, rgt: {$gt: rgtMoveNode}}, {$inc: {rgt: -widthMoveNode}});
            Categories.update({code: infoMoveNode.code, lft: {$gt: rgtMoveNode}}, {$inc: {lft: -widthMoveNode}});

            var infoBrotherNode = Categories.findOne(data.brotherId),
                rgtBrotherNode = infoBrotherNode.rgt;

            Categories.update({code: infoBrotherNode.code, lft: {$gt: rgtBrotherNode}, rgt: {$gt: 0}}, {$inc: {lft: widthMoveNode}});
            Categories.update({code: infoBrotherNode.code, rgt: {$gt: rgtBrotherNode}}, {$inc: {rgt: widthMoveNode}});

            var infoParentNode = Categories.findOne(data.parentId),
                levelMoveNode = infoMoveNode.level,
                levelParentNode = infoParentNode.level,
                newLevelMoveNode = levelParentNode + 1;

            Categories.update({code: infoParentNode.code, rgt: {$lte: 0}}, {$inc: {level: -(levelMoveNode + newLevelMoveNode)}});

            var newParent = infoParentNode._id,
                newLeft = infoBrotherNode.rgt + 1,
                newRight = infoBrotherNode.rgt + widthMoveNode;

            Categories.update(data.id, {$set: {parent: newParent, lft: newLeft, rgt: newRight}});
            Categories.update({rgt: {$lt: 0}}, {$inc: {rgt: newRight, lft: newLeft}});
            return true;
        } catch (error) {
            throw new Meteor.Error(error);
        }
    }
    return false;
}

var widthNode = function (left, right) {
    return right - left + 1;
}

var removeBranch = function (removeId) {
    if (removeId) {
        var infoNodeRemove = Categories.findOne({_id: removeId});
        if (infoNodeRemove) {
            if (infoNodeRemove.isLock === undefined || infoNodeRemove.isLock === false) {
                var rgtNodeRemove = infoNodeRemove.rgt,
                    lftNodeRemove = infoNodeRemove.lft,
                    widthNodeRemove = widthNode(lftNodeRemove, rgtNodeRemove);
                try {
                    Categories.remove({code : infoNodeRemove.code,lft: {$gte: lftNodeRemove, $lte: rgtNodeRemove}});
                    Categories.update({code : infoNodeRemove.code,lft: {$gt: rgtNodeRemove}}, {$inc: {lft: -widthNodeRemove}});
                    Categories.update({code : infoNodeRemove.code,rgt: {$gt: rgtNodeRemove}}, {$inc: {rgt: -widthNodeRemove}});
                    return true;
                } catch (error) {
                    throw new Meteor.Error(error);
                }
            }
        }
    }
    return false;
}

var removeOne = function (id) {
    if (id) {
        try {
            var nodeInfo = Categories.findOne(id);
            if (nodeInfo) {
                var results = Categories.find({parent: nodeInfo._id}, {sort: {lft: 1}}).fetch();
                var childIds = _.pluck(results, '_id').reverse();
                if (_.size(childIds) > 0) {
                    _.each(childIds, function (id) {
                        var dataNode = {
                            id: id,
                            parentId: nodeInfo.parent,
                            position: 'after',
                            brotherId: nodeInfo._id
                        }
                        moveNode(dataNode);
                    })
                    this.removeNode(nodeInfo._id);
                    return true;
                }
            }
        } catch (error) {
            throw new Meteor.Error(error);
        }
    }
    return false;
}

var insertRight = function (data) {
    if (data) {
        try {
            var ids = [];
            if (data.names) {
                _.each(data.names, function (name) {
                    var parentInfo = Categories.findOne({_id: data.parentId});
                    var parentRight = parentInfo.rgt,
                        parentCode = parentInfo.code;
                    Categories.update({code: parentCode, lft: {$gt: parentRight}}, {$inc: {lft: 2}}, {multi: true});
                    Categories.update({code: parentCode, rgt: {$gte: parentRight}}, {$inc: {rgt: 2}}, { multi: true });
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
                Categories.update({code: parentInfo.code, lft: {$gt: parentLeft}}, {$inc: {lft: 2}}, {multi: true});
                Categories.update({code: parentInfo.code, rgt: {$gt: (parentLeft + 1)}}, {$inc: {rgt: 2}}, {multi: true});
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
                Categories.update({code: parentInfo.code, lft: {$gt: brotherInfo.rgt}}, {$inc: {lft: 2}}, {multi: true});
                Categories.update({code: parentInfo.code, rgt: {$gt: brotherInfo.rgt}}, {$inc: {rgt: 2}}, {multi: true});
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
                Categories.update({code: parentInfo.code, lft: {$gte: brotherInfo.lft}}, {$inc: {lft: 2}}, {multi: true});
                Categories.update({code: parentInfo.code, rgt: {$gte: (brotherInfo.lft + 1)}}, {$inc: {rgt: 2}}, {multi: true});

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