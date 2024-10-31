const mongoose = require('mongoose');
const { defineSchemas } = require('./schema');
require('dotenv').config();

const uri = `mongodb+srv://Cluster86935:${process.env.MONGODB_PASS}@cluster86935.4megh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster86935`;
let Card, User, Set;
const connect = async () => {
	await mongoose.connect(uri);
	[Card, User, Set] = defineSchemas();
};

const createCard = async (term, definition) => {
	const card = new Card({ term, definition });
	return await card.save();
};

const getUser = async (username) => {
	const user = await User.find({ username });
	return user;
};

const getSetsByUser = async (username) => {
	const sets = await Set.find({ user: username });
	return sets;
};

const getAllCards = async () => {
	const cards = await Card.find();
	return cards;
};

const getCardsInSet = async (id) => {
	const cards = await Card.find({ set: id });
	return cards;
};

const createUser = async (username) => {
	const user = new User({ username });
	return await user.save();
};

module.exports = { connect, createCard, getUser, getSetsByUser, getAllCards, createUser };
