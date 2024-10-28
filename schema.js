const mongoose = require('mongoose');

const defineSchemas = () => {
    const cardSchema = new mongoose.Schema({
        term: String,
        definition: String,
        favorite: Boolean,
    });
    Card = mongoose.model('Card', cardSchema);
    const userSchema = new mongoose.Schema({
        username: {type: String, unique: true},
    });
    const setSchema = new mongoose.Schema({
        cards: [mongoose.Schema.Types.ObjectId],
        user: String,
    });
    return [
        Card,
        mongoose.model('User', userSchema),
        mongoose.model('Set', setSchema),
    ];
}

module.exports = {defineSchemas};