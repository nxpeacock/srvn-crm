Template['manager-categories'].rendered = function () {
    $(document).ready(function () {
        $('#manager-categories-tabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        })

    })
}

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
})