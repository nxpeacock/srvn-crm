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
            {   name: normalizedString($('#txtEventName').val()),
                description: $('#txtDescription').val(),
                createdDate : Date.now(),
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
    },
    'click button[id^="btnEditEvent_"]' : function(e){
        e.preventDefault();
        var event = Events.findOne(this._id);
        if(event){
            var branches = Branches.find();
            var dom = UI.renderWithData(Template.modal_add_new_event, {branches: branches});
            var dlg = new BootstrapDialog({
                title: 'Sửa sự kiện',
                nl2br: false,
                cssClass: 'modal_add_new_event',
                closable: false,
                message: dom.render().toHTML(),
                buttons: getDialogButton_save_close(),
                onshown: function () {
                    $('#txtLocations').multiselect({
                        nonSelectedText: 'Chưa chọn địa điểm nào',
                        selectAllValue: 'multiselect-all'
                    }).promise().done(function(){
                        _.each(event.locations,function(v){
                         $('#txtLocations').multiselect('select',v);
                        })
                    });
                    $('#txtStartDate,#txtEndDate').datetimepicker();

                    $('#txtStartDate').data("DateTimePicker").setDate(moment(event.startDate).format('DD/MM/YYYY'));
                    $('#txtEndDate').data("DateTimePicker").setDate(moment(event.endDate).format('DD/MM/YYYY'));
                    $('#txtEventName').val(event.name);
                    $('#txtDescription').val(event.description);
                }
            })
            dlg.realize();
            dlg.open();
            var btnSave = dlg.getButton('btnDlg_Save');
            btnSave.click(function(){
                dlg.close();
                var updateEvent = {$set : {
                    name: normalizedString($('#txtEventName').val()),
                    description: $('#txtDescription').val(),
                    createdDate : Date.now(),
                    startDate: new Date($('#txtStartDate').data("DateTimePicker").getDate()),
                    endDate: new Date($('#txtEndDate').data("DateTimePicker").getDate()),
                    locations: _.remove($('#txtLocations').val(), function (o) {
                        return o != 'multiselect-all';
                    })
                }}
                Meteor.call('updateEvent',event._id,updateEvent,function(error,success){
                    if(error)
                        console.log(error)
                    if(success)
                        FlashMessages.sendSuccess(success);
                })
            })
        }
    }
})

Template['manager-events'].rendered =function(){
    $(document).ready(function(){
        $('td[data-toggle^="tooltip"]').tooltip()
    })
}
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
