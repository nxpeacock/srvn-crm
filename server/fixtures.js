InitDefaultDatabase = function () {
    try {
        if (Branches.find().count() === 0) {
            var o = 0;
            _.each(Assets.getText('fixtures/branches.json').split('\n'), function (i) {
                if(!_.isEmpty(i)){
                    var j = EJSON.parse(i);
                    var id = Branches.insert(j);
                    if (id) o += 1;
                }
            });
            console.log('Branches : ' + o + ' rows...')
        }
        if (Meteor.users.find().count() === 0) {
            var o = 0;
            _.each(Assets.getText('fixtures/users.json').split('\n'), function (i) {
                if(!_.isEmpty(i)){
                    var j = EJSON.parse(i);
                    var id = Meteor.users.insert(j);
                    if (id) o += 1;
                }
            });
            console.log('Users : ' + o + ' rows...')
        }
        if (Meteor.roles.find().count() === 0) {
            var o = 0;
            _.each(Assets.getText('fixtures/roles.json').split('\n'), function (i) {
                if(!_.isEmpty(i)){
                    var j = EJSON.parse(i);
                    var id = Meteor.roles.insert(j);
                    if (id) o++;
                }
            });
            console.log('Roles : ' + o + ' rows...')
        }
        if (Categories.find().count() === 0) {
            var o = 0;
            _.each(Assets.getText('fixtures/categories.json').split('\n'), function (i) {
                if(!_.isEmpty(i)){
                    var j = EJSON.parse(i);
                    var id = Categories.insert(j);
                    if(id) o++;
                }
            });
            console.log('Categories : ' + o + ' rows...')
        }
    } catch (error) {
        console.log(error);
    }
}