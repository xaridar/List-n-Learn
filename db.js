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
	const sets = await Set.find({ user: username }).populate();
	return sets;
};

const getAllCards = async () => {
	const cards = await Card.find();
	return cards;
};

const getSet = async (id) => {
	const set = await Set.findById(id).populate('cards');
	return set;
};

const createUser = async (username) => {
	const user = new User({ username });
	return await user.save();
};

const updateSet = async (title, description, cards, id) => {
	await Promise.all(cards.map(async c => {
		if(c._id) {
			const card = await Card.findById(c._id);
			card.term = c.term;
			card.definition = c.definition;
			card.favorite = c.favorite;
			card.save();
		}
		else{
			const card = await newCard(c.term, c.definition, c.favorite)
			const cardID = card._id;
			c._id = cardID;
		}
	}));
	const set = await getSet(id);
	set.title = title;
	set.description = description;
	console.log(set.cards);
	set.cards = cards;
	await set.save();
};

const newSet = async (username) => {
	const set = new Set({ user: username});
	return await set.save();
}

const newCard = async (term, definition, favorite) => {
	const card = new Card({term: term, definition: definition, favorite: favorite});
	return await card.save();
}

module.exports = { connect, createCard, getUser, getSetsByUser, getAllCards, createUser, getSet, updateSet, newSet, newCard };
