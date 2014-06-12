/*Template['manager-categories'].rendered = function () {
    $(document).ready(function () {
        $('#manager-categories-tabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        })

    })
}*/

Template['manager-categories'].helpers({
   rootCategories : function() {
       return Categories.find({level:0,isRoot:true});
   }
});

Template['manager-categories'].events({
    'click #btnAddRoot' : function(e){
        e.preventDefault();
        var dom = UI.render(Template.addRootCategory);
        BootstrapDialog.show({
            title : 'Thêm danh mục gốc',
            nl2br: false,
            cssClass : 'addRootCategory',
            closable : false,
            message : dom.render().toHTML(),
            buttons:[
                {
                    label : 'Lưu lại',
                    icon : 'glyphicon glyphicon-save',
                    cssClass : 'btn btn-primary',
                    action : function(dlg){
                        var rootName = $('#txtRootName').val(),
                            rootCode = $('#txtRootCode').val(),
                            rootMaxLevel = $('#txtRootMaxLevel').val();
                        var newRoot = {
                            name : rootName,
                            code : rootCode,
                            maxLevel : parseInt(rootMaxLevel)
                        };
                        Meteor.call('insertRoot',newRoot,function(error,success){
                            if(error)
                                FlashMessages.sendError(error);
                            if(success)
                                FlashMessages.sendSuccess(success);

                            dlg.close();
                        })
                    }
                },
                {
                    label : 'Đóng',
                    icon : 'glyphicon glyphicon-off',
                    cssClass : 'btn btn-danger',
                    action : function(dlg){
                        dlg.close();
                    }
                }
            ]
        })
    }
 })

Template['manager-categories-detail'].events({
    'click #btnAddNewChild' : function(e){
        var parentId = $('#btnAddNewChild').attr('data-parent');
        var parent = Categories.findOne(parentId);
        if(parent){
            var dom = UI.renderWithData(Template.modal_AddNewCateChild,{parentName : parent.name});
            var dlg = new BootstrapDialog({
                title : 'Thêm mới danh mục con',
                nl2br: false,
                cssClass : 'AddNewCateChild',
                closable : false,
                message: dom.render().toHTML(),
                buttons : getDialogButton_save_close()
            });
            dlg.realize();
            var btnSave = dlg.getButton('btnDlg_Save');
            btnSave.click(function(e){
                var input = $('#txtCategoriesName').val();
                var arrInput = _.uniq(input.split('\n'));
                arrInput=_.map(arrInput,function(s){
                    return normalizedString(s);
                })
                arrInput = _.uniq(arrInput,true);
                var data = {
                    position : 'right',
                    parentId : parent._id,
                    names : arrInput
                }
                dlg.close();
                Meteor.call('insertNode',data,function(err,id){
                    if(err)
                        console.log(err)
                    if(id)
                        console.log(id);
                })
            })
            dlg.open();
        }
    },
    'click button[id^="btnRemoveCategories_"]' : function(e){
        e.preventDefault();
        var removeCate = Categories.findOne(this._id);
        if(removeCate){
            var msg = _.template('Bạn chắc chắn muốn xóa danh mục : <b><%= name %></b> ?')
            var dlg = new BootstrapDialog({
                type : BootstrapDialog.TYPE_DANGER,
                title : 'Xóa danh mục',
                message: msg({name : removeCate.name}),
                closeable : false,
                cssClass : 'confirmDlg',
                buttons : getConfirmButtons()
            });
            dlg.realize();
            dlg.open();
            var btnOk = dlg.getButton('btnConfirm_Yes');
            btnOk.click(function(e){
                dlg.close();
                Meteor.call('removeNode',removeCate._id,function(err,success){
                    if(err) console.log(err);
                    if(success) FlashMessages.sendSuccess(success);
                })
            })
        }
    },
    'click button[id^="btnRenameCate_"]' :function(e){
        e.preventDefault();
        var cate = Categories.findOne(this._id);
        if(cate){
            var dom = UI.renderWithData(Template.modal_changeName,{name : cate.name});
            var dlg = new BootstrapDialog({
                title : 'Sửa tên danh mục',
                nl2br: false,
                cssClass : 'modal_changeName',
                closable : false,
                message : dom.render().toHTML(),
                buttons: getDialogButton_save_close()
            });
            dlg.realize();
            dlg.open();
            var btnSave = dlg.getButton('btnDlg_Save');
            btnSave.click(function(e){
                dlg.close();
                var newName = normalizedString($('#txtCategoryName').val());
                if (newName != cate.name){
                    var data = {
                        id : cate._id,
                        name : newName
                    }
                    Meteor.call('updateName',data,function(err,success){
                       if(err) console.log(err);
                        if(success) FlashMessages.sendSuccess('Cập nhật thành công!');
                    });
                }
            })
        }
    }
});
