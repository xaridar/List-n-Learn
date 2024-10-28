const express = require('express');
const cors = require('cors');
const {connect, createCard} = require('./db');

const app = express();

app.use(cors());
app.get('/api', async (req, res) => {
    card = await createCard('apple', 'red');
    res.json({...card});
});

app.get('/all', async (req, res) => {
    res.json({...card});
})


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Listening at URL http://localhost:${PORT}!`);
});
connect().catch(console.dir);