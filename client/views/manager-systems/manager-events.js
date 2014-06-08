Template['manager-events'].events({
    'click #btnAddNewEvent' : function(e){
        e.preventDefault();
        var branches = Branches.find({},{sort:{orderNo : 1}});
        console.log(branches);
        var dom = UI.renderWithData(Template.modal_add_new_event,{branches : branches});
        var dlg = new BootstrapDialog({
            title : 'Thêm sự kiện',
            nl2br: false,
            cssClass : 'modal_add_new_event',
            closable : false,
            message : dom.render().toHTML(),
            buttons : getDialogButton_save_close(),
            onshown : function(){
                $('.multiselect').multiselect({
                    nonSelectedText : 'Chưa chọn địa điểm nào',
                    selectAllText : 'Chọn tất cả'
                });
            }
        })
        dlg.realize();
        var btnSave = dlg.getButton('btnDlg_Save');
        btnSave.click(function(e){

        })
        dlg.open();
    }
})

Template['manager-events'].rendered = function(){
    $(document).ready(function(){
        console.log('aaaaaaaaa')
        $('.multiselect').multiselect();
    })
}

Template['modal_add_new_event'].rendered = function(){
    $(document).ready(function(){

        $('.multiselect').multiselect();
    })
}