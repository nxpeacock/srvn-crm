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
                Meteor.call('insertNode',data,function(err,id){
                    if(err)
                        console.log(err)
                    if(id)
                        console.log(id);
                    dlg.close();
                })
            })
            dlg.open();
        }
    }
})

/*
Template['tab_study'].helpers({
    majors_level1: function () {
        var majors = Categories.find({level: 1});
        return {
            majors: majors,
            count: majors.count()
        };
    }
})

Template['tab_study'].events({
    "click button[id^='majors_l1_btn_']": function (e) {
        e.preventDefault();
        var id = this._id;
        var modalType = e.currentTarget.attributes['data-modal'].value;
        var data = {};
        var dom, cssClass;
        if (modalType) {
            switch (modalType) {
                case 'add-l2':
                    _.assign(data, {
                        parentId: id,
                        parentName: this.name
                    });
                    dom = UI.renderWithData(Template.tab_study_modal_add_l2, data);
                    cssClass = 'tab_study_modal_add_l2';
                    break;
                default :
                    break;
            }
            if (dom) {
                BootstrapDialog.show({
                    title: 'Thêm chuyên ngành',
                    message: dom.render().toHTML(),
                    nl2br: false,
                    cssClass: cssClass,
                    buttons: [
                        {
                            label: 'Lưu lại',
                            action: function (dlgRef) {
                                switch (modalType) {
                                    case 'add-l2':
                                        var names = _.uniq($('#txtCategoriesName').val().split('\n'));
                                        _.assign(data, {position: 'right'});
                                        _.each(names, function (a) {
                                            _.assign(data,{name : a});
                                            Meteor.call('insertNode',data,function(err,id){
                                                if(err)
                                                    console.log(err);
                                                if(id)
                                                    console.log(id);
                                            })
                                        })
                                        break;
                                }
                                dlgRef.close();
                            }
                        },
                        {
                            label: 'Hủy',
                            action: function (dlgRef) {
                                dlgRef.close();
                            }
                        }
                    ]
                })
            }
        }
    }
})*/
