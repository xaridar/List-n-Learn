/**
 * This file connects to the specified MongoDB database and completes all operations on this database;
 * All functions are exported for use in server.js (API calls).
 */

// Mongoose is used to simplify MongoDB operations from within Node.js
const mongoose = require('mongoose');
const { defineSchemas } = require('./schema');
require('dotenv').config();

// a local .env file defines the MONGODB password to avoid pushing to GitHub directly
const uri = `mongodb+srv://Cluster86935:${process.env.MONGODB_PASS}@cluster86935.4megh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster86935`;
let Card, User, Set;
/**
 * Connects to the database and defines all necessary schema classes
 */
const connect = async () => {
	await mongoose.connect(uri);
	[Card, User, Set] = defineSchemas();
};

/**
 * Selects a user from the database given a username
 * @param {string} username the username of the user to find
 * @returns {User} the requested user
 */
const getUser = async (username) => {
	const user = await User.find({ username });
	return user;
};

/**
 * Selects all non-empty sets created by a given user
 * @param {string} username the username of the user
 * @returns {[Set]} all sets created by the user
 */
const getSetsByUser = async (username) => {
	// Deletes empty sets that may have been created so they aren't returned
	await Set.deleteMany({ user: username, cards: { $size: 0 } });
	const sets = await Set.find({ user: username }).populate('cards');
	return sets;
};

/**
 * Selects all information associated with a given card set
 * @param {string} id set ID to fetch
 * @returns {Set} all information on the given set
 */
const getSet = async (id) => {
	const set = await Set.findById(id).populate('cards');
	return set;
};

/**
 * Deletes a set by ID, as well as all of its cards
 * @param {string} setId set ID to delete
 */
const deleteSet = async (setId) => {
	const set = await Set.findById(setId);
	await Card.deleteMany({ _id: { $in: set.cards } });
	await Set.findByIdAndDelete(setId);
};

/**
 * Creates a new user given a username
 * @param {string} username a username for the new user
 * @returns {User} the newly created user
 */
const createUser = async (username) => {
	const user = new User({ username });
	return await user.save();
};

/**
 * Updates a card set in the database to match the parameters passed
 * @param {string} title the new title for this set
 * @param {string} description the new description for this set
 * @param {[{term: string, definition: string, favorite: boolean, _id: string}]} cards a new array of cards for this set
 * @param {string} id the card set's ID for identification
 * @param {[string]} toDel an array of card IDs that have been deleted on the frontend, for database removal
 * @returns {boolean} true if set could be saved
 */
const updateSet = async (title, description, cards, id, toDel) => {
	// Set cannot be saved if any cards are unfinished
	if (cards.some(c => (c.term === '') != (c.definition === ''))) return false;

	// All cards in cards are resolved (updated, created, deleted) before proceeding
	await Promise.all(
		cards.map(async (c, i) => {
			if (c.term === '' && c.definition === '') {
				// cards with empty term and description are deleted in the database
				await Card.findByIdAndDelete(c._id);
				c._id = -1;
			} else if (!c._id.startsWith('newCard')) {
				// existing cards are updated
				const card = await Card.findById(c._id);
				card.term = c.term;
				card.definition = c.definition;
				card.favorite = c.favorite;
				card.save();
			} else {
				// new cards are created
				const card = await newCard(c.term, c.definition, c.favorite);
				const cardID = card._id;
				c._id = cardID;
			}
		}),
	);
	// removes deleted cards from cards array
	let i = 0;
	while (i < cards.length) {
		if (cards[i]._id === -1) cards.splice(i, 1);
		else i++;
	}

	// all cards in toDel are deleted from the database
	for (let i = 0; i < toDel.length; i++) {
		await Card.deleteOne({ _id: toDel[i] });
	}

	if (!cards.length) return false;

	// set details updated
	const set = await getSet(id);
	set.title = title;
	set.description = description;
	// setting the cards array updated order of cards
	set.cards = cards;
	await set.save();
	return true;
};

/**
 * Creates a card set associated with a given user
 * @param {string} username the name of the user creating the set
 * @returns {Set} the newly created card set
 */
const newSet = async (username) => {
	const set = new Set({ user: username });
	return await set.save();
};

module.exports = {
	connect,
	getUser,
	getSetsByUser,
	createUser,
	getSet,
	updateSet,
	newSet,
	deleteSet,
};
