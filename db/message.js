var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

var modelNames = require('./config').moduleNames;

mongoose.connect(require('./config').connectString);

var messageSchema = new Schema({
    createDate: { type: Date, 'default': Date.now },
    text: { type: String, required: true },
    owner: { type: ObjectId, ref : modelNames.user }
});

var MessageModel = exports.MessageModel = new Schema(modelNames.message, messageSchema);
