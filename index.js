const express = require('express');
const parser = require('./parser');
const cors = require('cors');
const helmet = require('helmet');

const debug = require('debug')('main');
const port = 8525;

const app = express();

app.use(helmet());
app.use(cors());

app.get('/schedule', (req, res) => {
    if (req.query.location === undefined || req.query.date === undefined) {
        res.send("error")
    } else {
        parser.parseSchedule(req.query.location, req.query.date, (schedule) => {
            res.send(schedule)
        });
    }
});

app.listen(port, () => {
    debug('Server running on ' + port);
});
