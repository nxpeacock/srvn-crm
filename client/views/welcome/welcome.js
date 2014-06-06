Template['welcome'].rendered = function(){

}

Template['welcome'].events({
    'click .btn.btn-primary' : function(e){
        var student = {};
        var dlg_addNewUser = UI.render(Template.dlg_addNewStudent);
        BootstrapDialog.show({
            title : 'Thêm học sinh',
            message : dlg_addNewUser.render().toHTML(),
            buttons : [{
                label : 'Lưu lại',
                action : function(dialogRef){
                    dialogRef.close();
                }
            },{
                label : 'Hủy',
                action : function(dialogRef){
                    dialogRef.close();
                }
            }],
            nl2br: false,
            cssClass : 'addNewStudent',
            closable : false
        })
    }
})
