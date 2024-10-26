const express = require('express');
const cors = require('cors');
const {connect, createCard} = require('./db');

const app = express();

app.use(cors());
app.get('/api', async (req, res) => {
    await createCard('apple', 'red');
    res.json({success: true});
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}!`);
});
connect().catch(console.dir);