const express = require('express');
const cors = require('cors');
const { connect, getUser, getSetsByUser, getAllCards, createUser, getSet } = require('./db');

const app = express();

app.use(express.json());
app.use(cors());
app.get('/user', async (req, res) => {
	user = await getUser(req.query.name);
	if (!user.length) {
		res.json({});
	} else {
		res.json(user[0]);
	}
});

app.post('/user', async (req, res) => {
	try {
		user = await createUser(req.body.username);
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json({ success: false });
	}
});

app.get('/sets', async (req, res) => {
	sets = await getSetsByUser(req.query.user);
	res.json(sets);
});

app.get('/allcards', async (req, res) => {
	cards = await getAllCards();
	res.json(cards);
});

app.get('/set', async (req, res) => {
	set = await getSet(req.query.id);
	res.json(set);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log(`Listening at URL http://localhost:${PORT}!`);
});
connect().catch(console.dir);
