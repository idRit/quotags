const mongoose = require('mongoose');

const comebacks = new mongoose.Schema({
    comeback: String,
}, {
    timestamps: true    
});

module.exports = mongoose.model('comebackschema', comebacks);