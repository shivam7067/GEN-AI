const mongoose = require('mongoose');
const blocklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
    }
);
const Blocklist = mongoose.model('Blocklist', blocklistSchema);
module.exports = Blocklist;