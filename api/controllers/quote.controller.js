const axios = require('axios');
const cheerio = require('cheerio');

exports.getQuotes = (req, res) => {
    let quotes = require('../resources/quotes.json');
    res.json(quotes);
}

exports.analyzeQuote = (req, res) => {
    let quote = req.body.quote;
    let Sentiment = require('sentiment');
    let sentiment = new Sentiment();

    let result = sentiment.analyze(quote);
    console.log(result);

    res.json({
        sentiment: result.score //-5 to 5
    });
}

exports.getQuotesByScore = (req, res) => {
    let score = parseInt(req.params.sentimentScore);
    console.log(score);
    let arrayOfEqualQuotes = [];

    let quotes = require('../resources/quotes.json');

    quotes.forEach(quote => {
        if (quote.sentimentScore === score) {
            arrayOfEqualQuotes.push(quote);
        }
    });

    if (arrayOfEqualQuotes.length === 0) {
        arrayOfEqualQuotes = {
            status: 'error',
            message: 'Check Score, no Quote found for following score.'
        };
    }
    res.json(arrayOfEqualQuotes); //-10 to 16
}

exports.getQuotesByTag = async (req, res) => {
    let tag = req.params.tag;
    let page = req.params.page;
    let quotes = await getQuotes(tag, page);

    res.json(quotes);
}

exports.getQuoteCountAndPages = async (req, res) => {
    let tag = req.params.tag;
    let response = getPagesAndCount(tag);
    res.json(response);
}

async function getPagesAndCount(tag) {
    let mainBody = await axios.get('https://www.goodreads.com/quotes/tag/' + tag);
    let $ = cheerio.load(mainBody.data);
    let title = $("title").text();
    let thenum = parseInt(title.match(/\d+/)[0]);
    let pages = Math.round(thenum / 30);
    return {
        quoteCount: thenum,
        pages: pages
    }
}

async function getQuotes(tag, page) {
    let mainBody = await axios.get('https://www.goodreads.com/quotes/tag/' + tag + '?page=' + page);
    let $ = cheerio.load(mainBody.data);
    let title = $("title").text();
    let thenum = parseInt(title.match(/\d+/)[0]);
    let pages = Math.round(thenum / 30);
    let quotes = await parseQuotes(mainBody.data.toString(), pages, page, thenum);
    return quotes;
}

async function parseQuotes(fullBody, pages, page, totalQuotes) {
    let limit = 30;
    if (pages - 1 < page || page == 0) {
        return {
            status: 'no such page available'
        }
    }

    if (page === pages) {
        limit = totalQuotes % limit;
    }

    let quotes = [];
    let startTagQuote = fullBody.split('&ldquo');
    let endTagQuote = startTagQuote.toString().split('&rdquo');

    let startTagAuthor = fullBody.split('class="authorOrTitle">\n    ');
    let endTagAuthor = startTagAuthor.toString().split('\n  </span>\n');

    for (let i = 0; i < limit; i++) {
        let extractedQuote = endTagQuote[i].split(',;')[1];
        let extractedAuthor = endTagAuthor[i].split(";\n  <span ,")[1];

        quotes.push({
            _id: uuidv4(),
            quoteText: stripHtmlTags(extractedQuote),
            quoteAuthor: extractedAuthor.replace(",", "")
        });
    }
    return quotes;
}

function stripHtmlTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/<[^>]*>/g, '');
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}