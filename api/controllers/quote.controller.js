const axios = require('axios');
const cheerio = require('cheerio');
const QuoteSchema = require('../models/quote.model');
const QuoteTagSchema = require('../models/QuoteTag.model');
const QuoteOfDaySchema = require('../models/quoteOfDay.model');
const words = require('../resources/nouns.json');

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
    storeQuotes(tag);
    res.json(quotes);
}

exports.getQuoteCountAndPages = async (req, res) => {
    let tag = req.params.tag;
    let response = await getPagesAndCount(tag);
    res.json(response);
}

exports.getRandomQuotes = async (req, res) => {
    let quotesArr = [];
    //let words = ["fashion", "fresh", "new", "cat", "art", "car", "hero", "comic"];
    let i = 0;
    while (i < 20) {
        let randomNumber = Math.floor(Math.random() * 899);
        //let randomWordI = Math.floor(Math.random() * 7);
        console.log(randomNumber);
        let doc = await QuoteSchema.findOne().skip(randomNumber);
        quotesArr.push(doc);
        i++;
    }

    res.json(quotesArr);
}

exports.getQuoteOfDay = async (req, res) => {
    try {
        let docCount = await QuoteOfDaySchema.countDocuments();
        console.log(docCount);
        if (docCount === 1) {
            let qod = await QuoteOfDaySchema.findOne({});
            if (qod.date !== getDate()) {
                await QuoteOfDaySchema.deleteMany({});
                do {
                    let randomNumber = Math.floor(Math.random() * 1499);
                    let randomWord = words[randomNumber];

                    let pages = await getPagesAndCount(randomWord);
                    pages = pages.pages;

                    let randomPageNumber = Math.floor(Math.random() * (pages - 2));
                    if (randomPageNumber > 0) {
                        let quotes = await getQuotes(randomWord, randomPageNumber);
                        if (quotes !== null) {
                            let randomQuoteI = Math.floor(Math.random() * 29);
                            console.log(quotes[randomQuoteI]);
                            let qod = quotes[randomQuoteI];
                            qod.date = getDate();
                            let newQod = new QuoteOfDaySchema(qod);
                            let data = await newQod.save();
                            res.json(quotes[randomQuoteI]);
                        }
                    }
                } while (true);
            }
            res.json(qod);
        } else {
            if (!(docCount === 0)) {
                await QuoteOfDaySchema.deleteMany({});
            }

            do {
                let randomNumber = Math.floor(Math.random() * 1499);
                let randomWord = words[randomNumber];

                let pages = await getPagesAndCount(randomWord);
                pages = pages.pages;

                let randomPageNumber = Math.floor(Math.random() * (pages - 2));
                if (randomPageNumber > 0) {
                    let quotes = await getQuotes(randomWord, randomPageNumber);
                    if (quotes !== null) {
                        let randomQuoteI = Math.floor(Math.random() * 29);
                        console.log(quotes[randomQuoteI]);
                        let qod = quotes[randomQuoteI];
                        qod.date = getDate();
                        let newQod = new QuoteOfDaySchema(qod);
                        let data = await newQod.save();
                        res.json(quotes[randomQuoteI]);
                    }
                }
            } while (true);
        }
    } catch (err) {
        console.log(err);
    }
}

async function storeQuotes(tag) {
    let storedTag = await QuoteTagSchema.findOne({ tag: tag });

    if (storedTag !== null) {
        if (tag === storedTag.tag) {
            return "here";
        }
    }

    let token = {
        tag: tag
    }
    let newTag = new QuoteTagSchema(token);
    let data = await newTag.save();

    let pagesAndCount = await getPagesAndCount(tag);
    let quotes = [];
    for (let i = 1; i < pagesAndCount.pages - 1; i++) {
        let x = await getQuotes(tag, i);
        x.tag = tag;
        quotes.push(x);
    }
    let merged = await [].concat.apply([], quotes);

    await merged.forEach(async (quote) => {
        let newQuote = new QuoteSchema(quote);
        console.log(quotes);
        await newQuote.save();
    });
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
            //_id: uuidv4(),
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

function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}