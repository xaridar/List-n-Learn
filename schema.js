const mongoose = require('mongoose');

const defineSchemas = () => {
    const cardSchema = new mongoose.Schema({
        term: String,
        definition: String,
    });
    return [
        mongoose.model('Card', cardSchema)
    ];
}

module.exports = {defineSchemas};