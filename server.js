const express = require('express');
const cors = require('cors');
const {connect, getUser, getSetsByUser, getAllCards} = require('./db');

const app = express();

app.use(cors());
app.get('/user', async (req, res) => {
    user = await getUser(req.query.name);
    if (!user.length) {
        res.json({});
    } else {
        res.json(user[0]);
    }
});

app.get('/sets', async (req, res) => {
    sets = await getSetsByUser(req.query.user);
    res.json(sets);
});

app.get('/allcards', async (req, res) => {
    cards = await getAllCards();
    console.log(cards);
    res.json(cards);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Listening at URL http://localhost:${PORT}!`);
});
connect().catch(console.dir);