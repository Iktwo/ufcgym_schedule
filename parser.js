let cheerio = require('cheerio');
let request = require('request');
let debug = require('debug')('parser');

const BASE_URL = 'https://ufcgym.com/api/locations/';

const SELECTOR_CLASS = ".class-schedule__class";
const SELECTOR_TIME = ".class-schedule__class__time";
const SELECTOR_TITLE = ".class-schedule__class__title";
const SELECTOR_INSTRUCTOR = ".class-schedule__class__instructor";
const SELECTOR_DURATION = ".class-schedule__class__duration";

let cache = {};

function parseSchedule(location, date, callback) {
    let url = BASE_URL + location + "/schedule?end_date=" + date + "&start_date=" + date;
    debug("Fetching", url);

    if (cache.hasOwnProperty(location + date)) {
        debug('Returning cached value');
        callback(cache[location + date])
    } else {
        request(url, function (error, response, html) {
            if (!error && response.statusCode === 200) {
                let $ = cheerio.load(html);

                let classes = [];

                $(SELECTOR_CLASS).each((index, e) => {
                    classes.push({
                        time: $(e).find(SELECTOR_TIME).text().trim(),
                        title: $(e).find(SELECTOR_TITLE).text().trim(),
                        instructor: $(e).find(SELECTOR_INSTRUCTOR).text().trim(),
                        duration: $(e).find(SELECTOR_DURATION).text().trim()
                    });
                });

                debug(classes);

                // Saving value to cache
                cache[location + date] = classes;

                callback({classes})
            } else {
                callback({})
            }
        });
    }
}

module.exports.parseSchedule = parseSchedule;
