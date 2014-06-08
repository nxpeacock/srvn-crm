if(Meteor.isClient){
    Meteor.startup(function () {
        $(document).ready(function(){
            $(window).bind("load resize", function() {
                width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
                if (width < 768) {
                    $('div.sidebar-collapse').addClass('collapse')
                } else {
                    $('div.sidebar-collapse').removeClass('collapse')
                }
            })
        })
    });
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
}