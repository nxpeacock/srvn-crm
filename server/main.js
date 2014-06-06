if (Meteor.isServer) {
    Meteor.startup(function () {
        if (Branches.find().count() === 0) {
            var branches = [
                {code: 'SRVN-HN', name: 'Hà Nội', orderNo: 1},
                {code: 'SRVN-HP', name: 'Hải Phòng', orderNo: 2},
                {code: 'SRVN-HCM', name: 'Tp.Hồ Chí Minh', orderNo: 3}
            ];

            _.each(branches, function (b) {
                Branches.insert(b);
            })
            if (Meteor.users.find().count() === 0) {
                var users = [
                    {name: 'Nguyễn Xuân Công', shortName: 'N.X.Công', email: 'cong.nx@sunrisevietnam.com', branch: 'SRVN-HN', roles: ['admin', 'view-reports', 'user', 'consult', 'accounting', 'mod']},
                    {name: 'Trần Thị Dần', shortName: 'T.T.Dần', email: 'dantt@sunrisevietnam.com', branch: 'SRVN-HN', roles: ['view-reports']},
                    {name: 'Hoàng Minh Phượng', shortName: 'H.M.Phượng', email: 'phuong.hm@sunrisevietnam.com', branch: 'SRVN-HN', roles: ['user']},
                    {name: 'Lê Kiều Trang', shortName: 'L.K.Trang', email: 'trang@sunrisevietnam.com', branch: 'SRVN-HN', roles: ['consult', 'user']},
                    {name: 'Vũ Thị Huệ', shortName: 'V.T.Huệ', email: 'hue@sunrisevietnam.com', branch: 'SRVN-HP', roles: ['consult', 'user']},
                    {name: 'Đinh Xuân Quỳnh', shortName: 'Đ.X.Quỳnh', email: 'xuanquynh@sunrisevietnam.com', branch: 'SRVN-HN', roles: ['accounting']},
                    {name: 'Phạm Thanh Vân', shortName: 'P.T.Vân', email: 'thanhvan@sunrisevietnam.com', branch: 'SRVN-HN', roles: ['accounting']},
                    {name: 'Lê Trọng Vinh', shortName: 'L.T.Vinh', email: 'vinh.lt@sunrisevietnam.com', branch: 'SRVN-HN', roles: ['mod', 'user']}
                ];
                _.each(users, function (user) {
                    var branchId = Branches.findOne({code: user.branch})._id;
                    if (branchId) {
                        var id;
                        id = Accounts.createUser({
                            email: user.email,
                            password: 'Sunrise@213',
                            profile: [
                                {name: user.name, shortName: user.shortName, branchId: branchId, isLock: false}
                            ]
                        });

                        Meteor.users.update({_id: id}, {$set: {'emails.0.verified': true}});

                        Roles.addUsersToRoles(id, user.roles);
                    }

                })
            }
        }

        if (Categories.find().count() === 0) {
            var rootId = Categories.insert({
                name: '------Tất cả------',
                code :'majors',
                level: 0,
                lft: 1,
                rgt: 22
            });

            if (rootId) {
                var majors = [
                    {name: 'Kinh doanh', level: 1, lft: 2, rgt: 3},
                    {name: 'Kinh tế', level: 1, lft: 4, rgt: 5},
                    {name: 'CNTT', level: 1, lft: 6, rgt: 7},
                    {name: 'Kỹ sư', level: 1, lft: 8, rgt: 9},
                    {name: 'Khoa học', level: 1, lft: 10, rgt: 11},
                    {name: 'Nghệ thuật', level: 1, lft: 12, rgt: 13},
                    {name: 'Giáo dục', level: 1, lft: 14, rgt: 15},
                    {name: 'Ngôn ngữ', level: 1, lft: 16, rgt: 17},
                    {name: 'Y ~ Dược', level: 1, lft: 18, rgt: 19},
                    {name: 'Luật', level: 1, lft: 20, rgt: 21}
                ];
                var i = 0;
                _.each(majors,function(m){
                    _.assign(m,{parent : rootId,orderNo:i++,code:'majors'});
                    Categories.insert(m);
                })
                Categories._ensureIndex({lft:1,rgt:1,code:1});
            }

        }
    })
}