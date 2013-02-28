"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId,
    UserModel = require('./user').UserModel,
    MessageModel = require('./message').MessageModel,
    modelNames = require('./config').modelNames;
mongoose.connect(require('./config').connectString);


var conversationSchema = new Schema({
    createDate: { type: Date, 'default': Date.now },
    host: { type: ObjectId, ref: modelNames.user },
    moderator: [{ type: ObjectId, ref: modelNames.user, required: false }],
    guest: [{ type: ObjectId, ref: modelNames.user, required: false }],
    messages: [{ type: ObjectId, ref: modelNames.message, required: false }]
});

var ConversationModel = exports.ConversationModel = new Schema(modelNames.conversation, conversationSchema);

conversationSchema.statics.create_conversation = function (hostId, callback) {
    UserModel.findOneById(hostId, function (err, user) {
        if (err) {
            callback(false);
        } else {
            var conversation = new ConversationModel(
                { host: hostId },
                function (err, conversation) {
                    if (err) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                }
            );
        }
    });
};

conversationSchema.methods.add_guest = function (uid, callback) {
    UserModel.findOneById(uid, function (err, user) {
        if (err) {
            callback(false);
        } else {
            if (this.guest.indexOf(user._id) === -1) {
                this.guest.push(user._id);
                this.save(function (err, conversation) {
                    if (err) {
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            } else {
                callback(false);
            }
        }
    });
};

conversationSchema.methods.add_moderator = function (uid, callback) {
    UserModel.findOneById(uid, function (err, user) {
        if (err) {
            callback(false);
        } else {
            if (this.moderator.indexOf(user._id) === -1) {
                this.moderator.push(user._id);
                this.save(function (err, conversation) {
                    if (err) {
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            } else {
                callback(false);
            }
        }
    });
};

conversationSchema.methods.remove_moderator = function (uid, callback) {
    if (this.moderator.indexOf(uid) === -1) {
        callback(false);
    } else {
        this.moderator.remove(uid);
        this.save(function (err, conversation) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    }
};

conversationSchema.methods.remove_guest = function (uid, callback) {
    if (this.guest.indexOf(uid) === -1) {
        callback(false);
    } else {
        this.guest.remove(uid);
        this.save(function (err, conversation) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    }
};

conversationSchema.methods.clear_guest = function (callback) {
    this.guest = [];
    this.save(function (err, conversation) {
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

conversationSchema.methods.clear_moderator = function (callback) {
    this.moderator = [];
    this.save(function (err, conversation) {
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

conversationSchema.methods.add_message = function (messageId, callback) {
    if (this.messages.indexOf(messageId) === -1) {
        this.messages.push(messageId);
        this.save(function (err, conversation) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(false);
    }
};

conversationSchema.methods.clear_messages = function (callback) {
    MessageModel.remove({ _id: this.messages });
    this.messages = [];
    this.save(function (err, conversation) {
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

conversationSchema.methods.fetch_messages = function (callback) {
};

conversationSchema.methods.promote = function (uid, callback) {
    var indexOfGuest = this.guest.indexOf(uid),
        indexOfModerator = this.moderator.indexOf(uid);

    if (indexOfGuest !== -1 && indexOfModerator === -1) {
        this.guest.remove(uid);
        this.moderator.push(uid);
        this.save();
        callback(true);
    } else {
        callback(false);
    }
};

conversationSchema.methods.demote = function (uid, callback) {
    var indexOfModerator = this.moderator.indexOf(uid),
        indexOfGuest = this.moderator.indexOf(uid);
    
    if (indexOfGuest === -1 && indexOfModerator !== -1) {
        this.moderator.remove(uid);
        this.guest.push(uid);
        this.save(function (err, conversation) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    } else {
        callback(false);
    }
};

conversationSchema.methods.hasUser = function (uid, callback) {
    if (this.host._id === uid) {
        callback(true);
    } else if (this.moderator.indexOf(uid) !== -1) {
        callback(true);
    } else if (this.guest.indexOf(uid) !== -1) {
        callback(true);
    } else {
        callback(false);
    }
};

conversationSchema.pre('remove', function (conversation) {
    MessageModel.remove({ _id: conversation.messages });
});

