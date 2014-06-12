if(Meteor.isClient){
    getDialogButton_save_close = function(){
        return [
            {
                id : 'btnDlg_Save',
                label : 'Lưu lại',
                icon : 'glyphicon glyphicon-save',
                cssClass : 'btn btn-primary'
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
    }
    getConfirmButtons = function(Yes,No){
        if(Yes === undefined) Yes = 'Có';
        if(No === undefined) No = 'Không';
        return [
            {
                id : 'btnConfirm_Yes',
                label : Yes,
                icon : 'glyphicon glyphicon-',
                cssClass : 'btn btn-primary'
            },
            {
                label : No,
                icon : 'glyphicon glyphicon glyphicon-remove',
                cssClass : 'btn btn-danger',
                action : function(dlg){
                    dlg.close();
                }
            }
        ]
    }
}