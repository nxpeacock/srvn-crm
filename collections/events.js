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
    },
    'updateEvent' : function(id,data){
        try{
            return Events.update({_id : id},data);
        }catch(error){
            throw new Event.Error(error)
        }
        return []
    }
})