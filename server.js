const express = require('express');
const cors = require('cors');
const {connect, getUser, getAll} = require('./db');


const app = express();

app.use(cors());
app.get('/user', async (req, res) => {
    user = await getUser(req.params.name);
    console.log(user);
    if (!user.length) {
        res.json({});
    } else {
        res.json({...user._doc});
    }
});

app.get('/cards', async (req, res) => {
    cards = await getAll();
    console.log(cards);
    if (!cards.length) {
        res.json({});
    } else {
        res.json({...cards._doc});
    }
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Listening at URL http://localhost:${PORT}!`);
});
connect().catch(console.dir);