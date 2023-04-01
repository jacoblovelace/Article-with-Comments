const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
        author: String,
        body: String,
        date: { type: Date, 
                default: Date.now, 
                required: false },
        user: String
});

module.exports = model('comment', commentSchema);