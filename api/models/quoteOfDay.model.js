const mongoose = require('mongoose');

const quoteOfDay = new mongoose.Schema({
    quoteText: String,
    quoteAuthor: String,
    date: String
}, {
    timestamps: true    
});

module.exports = mongoose.model('QuoteOfDay', quoteOfDay);