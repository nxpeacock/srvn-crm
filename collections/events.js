Events = new Meteor.Collection('events');

Events.allow({
    insert : isAdminOrMod,
    update : isAdminOrMod,
    remove : isAdminOrMod
});

Meteor.methods({
    'addNewEvent' : function(newEvent){
        try{
            return Events.insert(newEvent);
        }catch(error){
            throw new Meteor.Error(error);
        }
        return [];
    }
})