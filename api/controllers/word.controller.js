const axios = require('axios');

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

