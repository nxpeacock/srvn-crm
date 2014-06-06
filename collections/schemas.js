/**
 * Created by nxcong on 27/05/2014.
 */
/*var Schemas = {};
Schemas.Branch = new SimpleSchema({
    code : {
        type : String,
        label : 'Code',
        max : 10
    },
    name : {
        type : String,
        label : 'BranchName',
        max : 100
    },
    orderNo : {
        type : Number,
        min : 0
    }
});

Branches.attachSchema(Schemas.Branch);

Schemas.User = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    username: {
        type: String,
        regEx: /^[a-z0-9A-Z_]{3,15}$/,
        optional : true
    },
    emails: {
        type: [Object]
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Schemas.UserProfile,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    }
});

Schemas.UserProfile = new SimpleSchema({
    name: {
        type: String,
        regEx: /^[a-zA-Z-]{2,25}$/,
        optional: true
    },
    birthday: {
        type: Date,
        optional: true
    },
    gender: {
        type: String,
        allowedValues: ['Male', 'Female'],
        optional: true
    },
    branchId: {
        type: Schemas.Branch,
        optional: true
    }
});

Meteor.users.attachSchema(Schemas.User);*/
