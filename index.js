/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.connect(process.env.MONGO_URL);
const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Routes
const apiRoute = require('./routes/api.route');

// Helpers
const handleSocketIo = require('./helpers/handleSocketIo.helper');

app.use(cors());
app.use('/api', apiRoute);

app.get('/', (req, res) => res.send('All done'));

handleSocketIo(server);

// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Server has started on port ${port}`));
