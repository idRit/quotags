const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require('./config/db.config');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    dbName: "quotags"
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

app.get('/', (req, res) => {
    res.json({
        status: 'working'
    });
});

require('./api/routes/quotes.route.js')(app);
require('./api/routes/hashtags.route.js')(app);

let port = process.env.PORT || 3000;
app.listen(port);
console.log("listening on " + port);