"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
mongoose.connect(require('./config').connectString);

var modelNames = require('./config').modelNames;

var userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    online: { type: Boolean, 'default': false },
    from: { type: String, 'enum': ['android', 'web'] },
    device: Number
});

var UserModel = exports.UserModel = mongoose.model(modelNames.user, userSchema);

userSchema.methods.register = function (un, pw, callback) {
    var user = new UserModel({ username: un, password: pw });
    user.save(function (err, user) {
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

userSchema.statics.logout = function (un, pw, f, d, callback) {
    UserModel.findOneAndUpdate(
        { username: un, password: pw, from: f, device: d, online: true },
        { online: false },
        function (err, user) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        }
    );
};

userSchema.statics.login = function (un, pw, f, d, callback) {
    UserModel.findOneAndUpdate(
        { username: un, password: pw },
        { online: true, from: f, device: d },
        function (err, user) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        }
    );
};

userSchema.statics.delete_account = function (un, pw, callback) {
    UserModel.findOneAndRemove(
        { username: un, password: pw },
        function (err, user) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        }
    );
};

userSchema.statics.online_count = function (callback) {
    UserModel.count({ online: true }, function (err, count) {
        if (err) {
            callback(0);
        } else {
            callback(count);
        }
    });
};

userSchema.statics.count = function (callback) {
    UserModel.count(function (err, count) {
        if (err) {
            callback(0);
        } else {
            callback(count);
        }
    });
};
