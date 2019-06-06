const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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