const axios = require('axios');
let cbks = require('../models/combacks.model');

exports.getRelatedWords = async (req, res) => {
    let word = req.params.word;
    console.log(word);
    let relatedWords = await relatedWordsScraper(word);
    res.json(relatedWords);
}

exports.getPopularWords = async (req, res) => {
    let relatedWords = await relatedWordsScraper(null);
    res.json(relatedWords);
}

exports.getRandomComback = async (req, res) => {
    let comebacks = await getAllcbks();

    await comebacks.forEach(async (cbcke) => {
        let newcbc = new cbks(cbcke);
        await newcbc.save();
    });

    res.json(comebacks);
}

async function relatedWordsScraper(word) {
    let words = [];
    if (word === null) {
        let wordsArr = ['area', 'book', 'business', 'case', 'child', 'company', 'country', 'day', 'eye', 'fact', 'family', 'government', 'group', 'hand', 'life'];
        wordsArr.forEach((word) => {    
            words.push({
                word: word
            });
        });
    } else {
        let fullBody = await parseBody(word);
        let startTag = fullBody.split('class="css-1dlcb58 etbu2a31">');
        let endTag = startTag.toString().split('</a></span></li>');
        console.log(endTag);
        for (let i = 0; i < 5; i++) {
            let extractedWord = endTag[i].split('data-linkid="nn1ov4" ,')[1];
            words.push({
                word: extractedWord
            });
        }
    }
    return words;
}

async function parseBody(word) {
    let mainBody = await axios.get("https://www.thesaurus.com/browse/" + word);
    let parsedBody = mainBody.data.toString();
    return parsedBody;
}

async function parseBody() {
    let mainBody = await axios.get("https://thoughtcatalog.com/melanie-berliet/2016/02/50-hilarious-comebacks-that-will-shut-everyone-up-and-make-you-look-like-a-genius/");
    let parsedBody = mainBody.data.toString();
    return parsedBody;
}

async function getAllcbks() {
    let comebacks = [];
    let fullBody = await parseBody();
    let startTag = fullBody.split('<p><strong>\d.</strong>');
    let endTag = startTag.toString().split('</p>\n');
    endTag.forEach((tag) => {
        let extractedWord = tag.split('</strong> ')[1];
        comebacks.push({
            comeback: extractedWord
        });
    });
    comebacks = comebacks.filter((val) => typeof val.comeback !== "undefined");
    return comebacks;
}
