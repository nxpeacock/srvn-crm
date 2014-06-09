Template['manager-events'].events({
    'click #btnAddNewEvent': function (e) {
        e.preventDefault();
        var branches = Branches.find({}, {sort: {orderNo: 1}});
        var dom = UI.renderWithData(Template.modal_add_new_event, {branches: branches});
        var dlg = new BootstrapDialog({
            title: 'Thêm sự kiện',
            nl2br: false,
            cssClass: 'modal_add_new_event',
            closable: false,
            message: dom.render().toHTML(),
            buttons: getDialogButton_save_close(),
            onshown: function () {
                $('.multiselect').multiselect({
                    nonSelectedText: 'Chưa chọn địa điểm nào',
                    selectAllValue: 'multiselect-all'
                });
                $('#txtStartDate,#txtEndDate').datetimepicker();
            }
        })
        dlg.realize();
        var btnSave = dlg.getButton('btnDlg_Save');
        btnSave.click(function (e) {
            dlg.close();
            var newEvent =
            {   name: $('#txtEventName').val(),
                description: $('#txtDescription').val(),
                startDate: new Date($('#txtStartDate').data("DateTimePicker").getDate()),
                endDate: new Date($('#txtEndDate').data("DateTimePicker").getDate()),
                locations: _.remove($('#txtLocations').val(), function (o) {
                    return o != 'multiselect-all';
                })
            }
            Meteor.call('addNewEvent',newEvent,function(err,id){
                if(err)
                    console.log(err)
                if(id)
                    FlashMessages.sendSuccess(id);
            })
        })
        dlg.open();
    }
})

/*
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
 }*/
