var mongoose = require('mongoose');
mongoose.connect(require('./config').connectString);

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    online: Boolean,
    from: { type: String, enum: ['android', 'web'] },
    device: Number
});

var User = exports.User = mongoose.model('User', userSchema);

userSchema.methods.register = function(un, pw, callback) {
    var user = new User({ username: un, password: pw });
    user.save(callback);
}

userSchema.methods.login = function(un, pw, from, device, callback) {
    User.findOne({ username: un, password: pw }, 'online from', function(err, user) {
        if (err) {
            callback(false);
        } else {
            user.online = true;
            user.from = from;
            user.device = device;
            user.save(function(err, user) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        }
    });
}

userSchema.methods.logout = function(un, pw, f, d, callback) {
    User.findOne({ username: un, password: pw, from: f, device: d, online: true }, 'online', function(err, user) {
        if (err) {
            callback(false);
        } else {
            user.online = false;
            user.save(function(err, user) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        }
    });
}

