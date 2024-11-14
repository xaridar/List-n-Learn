const express = require('express');
const cors = require('cors');
const { connect, getUser, getSetsByUser, getAllCards, createUser, getSet, updateSet, newSet, newCard } = require('./db');

const app = express();

app.use(express.json());
app.use(cors());
app.get('/user', async (req, res) => {
	const user = await getUser(req.query.name);
	if (!user.length) {
		res.json({});
	} else {
		res.json(user[0]);
	}
});

app.post('/user', async (req, res) => {
	try {
		const user = await createUser(req.body.username);
		res.json({ success: true });
	} catch (e) {
		console.log(e);
		res.json({ success: false });
	}
});

app.get('/sets', async (req, res) => {
	const sets = await getSetsByUser(req.query.user);
	res.json(sets);
});

app.get('/allcards', async (req, res) => {
	const cards = await getAllCards();
	res.json(cards);
});

app.get('/set', async (req, res) => {
	const set = await getSet(req.query.id);
	res.json(set);
});

app.put('/set', async (req, res) => {
	try {
		const {id, title, description, cards} = req.body;
		await updateSet(title, description, cards, id);
		res.json({ success: true});
	} catch (e) {
		console.log(e);
		res.json({ success: false });
	}
})

app.post('/set', async (req, res) => {
	try {
		const { username } = req.body;
		const set = await newSet( username );
		const id = set._id;
		res.json({ id, success: true });
	} catch (e) {
		console.log(e);
		res.json({ success: false });
	}
})

app.post('/card', async (req, res) => {
	try {
		const { term, definition, favorite, setID } = req.body;  // Get data for the new card
        const newCard = await newCard({ term, definition, favorite }); // Create new card instance
		const id = newCard._id;

		if (setID) {
            const set = await Set.findById(setID);
            set.cards.push(newCard._id); // Add card ID to the set's card list
            await set.save(); // Save the updated set
        }

		res.json({ id, success: true });
	} catch (e) {
		console.log(e);
		res.json({ success: false });
	}
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log(`Listening at URL http://localhost:${PORT}!`);
});
connect().catch(console.dir);