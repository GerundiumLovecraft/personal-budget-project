const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(express.static(__dirname));

const PORT = 3000;

// Add middleware for handling CORS requests from index.html

app.use(cors());

// Add middware for parsing request bodies here:

app.use(bodyParser.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./api/api.js');
app.use('/', apiRouter);


// const apiRouter = require('./api/api');
// app.use('/api', apiRouter);
app.get('/', (req, res) => {
    res.send("Good job!");
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
