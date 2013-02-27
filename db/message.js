var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.connect(require('./config').connectString);

var messageSchema = new Schema({
    date: { type: Date, 'default': Date.now },
    text: { type: String, required: true },
    oner: { type: ObjectId, ref : 'User' }
});
