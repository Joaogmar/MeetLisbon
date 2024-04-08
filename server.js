require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

app.use('/', routes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'places.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
