const mongoose = require('mongoose');
const {defineSchemas} = require('./schema')
require('dotenv').config();

const uri = `mongodb+srv://Cluster86935:${process.env.MONGODB_PASS}@cluster86935.4megh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster86935`;
let Card, User, Set;
const connect = async () => {
    await mongoose.connect(uri);
    [Card, User, Set] = defineSchemas();
}

const createCard = async (term, definition) => {
    const card = new Card({term, definition,});
    await card.save();
    return card;
}

const getUser = async (username) => {
    const user = await User.find({username});
    return user;
}

const getAll = async() => {
    const cards = await Card.find();
    return cards;
}

module.exports = {connect, createCard, getUser, getAll};