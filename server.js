/**
 * This file defines the CRUD API used for data operations and user fetching for List n' Learn.
 */

// Express.js is used for API integration
const express = require('express');
const cors = require('cors');
const { connect, getUser, getSetsByUser, createUser, getSet, updateSet, newSet, deleteSet } = require('./db');

const app = express();

app.use(express.json());
app.use(cors());
// Route to fetch a user by name
app.get('/user', async (req, res) => {
	const user = await getUser(req.query.name);
	if (!user.length) {
		res.json({});
	} else {
		res.json(user[0]);
	}
});

// Route to create a user given a username
app.post('/user', async (req, res) => {
	try {
		const user = await createUser(req.body.username);
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json({ success: false });
	}
});

// Route to get all the sets created by a given user
app.get('/sets', async (req, res) => {
	const sets = await getSetsByUser(req.query.user);
	res.json(sets);
});

// Route to get all information and cards associated with a set
app.get('/set', async (req, res) => {
	const set = await getSet(req.query.id);
	res.json(set);
});

// Route to update an existing set
app.put('/set', async (req, res) => {
	try {
		const { id, title, description, cards, toDel } = req.body;
		const success = await updateSet(title, description, cards, id, toDel);
		res.json({ success });
	} catch (e) {
		console.log(e);
		res.json({ success: false });
	}
});

// Route to create a new empty set
app.post('/set', async (req, res) => {
	try {
		const { username } = req.body;
		const set = await newSet(username);
		const id = set._id;
		res.json({ id, success: true });
	} catch (e) {
		console.log(e);
		res.json({ success: false });
	}
});

// Route to delete a card set
app.delete('/set', async (req, res) => {
	try {
		const { setId } = req.body; // Extract the set ID from the request body

		deleteSet(setId);

		res.json({ success: true });
	} catch (error) {
		console.error('Error deleting set:', error);
		res.json({ success: false });
	}
});

// API by default listens on port 8080;
// React frontend proxies all internal requests to this server for API functionality
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log(`Listening at URL http://localhost:${PORT}!`);
});
connect().catch(console.dir);
