const mongoose = require('mongoose');

const quotes = new mongoose.Schema({
    quoteText: String,
    quoteAuthor: String,
    tag: String
}, {
    timestamps: true    
});

module.exports = mongoose.model('Quotes', quotes);