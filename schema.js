/**
 * Defines This file defines schemas for use with mongoose foreasy database manipulation
 */

const mongoose = require('mongoose');

const defineSchemas = () => {
	const cardSchema = new mongoose.Schema({
		term: String,
		definition: String,
		favorite: { type: Boolean, default: false },
	});
	const userSchema = new mongoose.Schema({
		username: { type: String, unique: true },
	});
	const setSchema = new mongoose.Schema({
		title: String,
		description: String,
		user: String,
		cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
	});
	return [mongoose.model('Card', cardSchema), mongoose.model('User', userSchema), mongoose.model('Set', setSchema)];
};

module.exports = { defineSchemas };
