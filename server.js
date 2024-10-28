const express = require('express');
const cors = require('cors');
const {connect, getUser} = require('./db');

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

app.get('/all', async (req, res) => {
    res.json({...card});
})


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Listening at URL http://localhost:${PORT}!`);
});
connect().catch(console.dir);