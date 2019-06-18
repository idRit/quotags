const mongoose = require('mongoose');

const quoteTags = new mongoose.Schema({
    tag: String
}, {
    timestamps: true    
});

module.exports = mongoose.model('QuoteTags', quoteTags);