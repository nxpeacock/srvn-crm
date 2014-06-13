IronRouterProgress.configure({
    spinner : false
});

if(Meteor.isClient){
    $(document).on('ready',function(){
        setTimeout(function(){
            $('body').toggleClass('fixed-header fixed-navigation fixed-ribbon fixed-page-footer smart-style-3');
            var ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

            if (!ismobile) {
                // Desktop
                $('body').addClass("desktop-detected");
                $.device = "desktop";
            } else {
                // Mobile
                $('body').addClass("mobile-detected");
                $.device = "mobile";

                // Removes the tap delay in idevices
                // dependency: js/plugin/fastclick/fastclick.js
                //FastClick.attach(document.body);
            }
        },1000)
    })
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
