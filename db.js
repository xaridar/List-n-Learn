const mongoose = require('mongoose');
const {defineSchemas} = require('./schema')
require('dotenv').config();

const uri = `mongodb+srv://Cluster86935:${process.env.MONGODB_PASS}@cluster86935.4megh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster86935`;
let Card;
const connect = async () => {
    await mongoose.connect(uri);
    [Card] = defineSchemas();
}

const createCard = async (term, definition) => {
    const card = new Card({term, definition,});
    await card.save();
    return card;
}

module.exports = {connect, createCard};