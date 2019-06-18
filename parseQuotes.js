const axios = require('axios');

async function getNouns() {
    let mainBody = await axios.get('https://www.talkenglish.com/vocabulary/top-1500-nouns.aspx');
    let nouns = await parseNouns(mainBody.data.toString());
    return nouns;
}

async function parseNouns(fullBody) {
    let nouns = [];
    let startTagQuote = fullBody.split('target="_blank">');
    let endTagQuote = startTagQuote.toString().split('</a>\r\n\t\t\t\t\t\t');

    for (let i = 0; i < 1500; i++) {
        let extractedNoun = endTagQuote[i].split('" ,')[1];
        nouns.push(extractedNoun);
    }
    return nouns;
}

async function run() {
    let nouns = await getNouns(); //0-5
    let json = JSON.stringify(nouns);
    let fs = require('fs');
    await fs.writeFile('nouns.json', json, 'utf8', (err, data) => {
    
    });
    console.log("done");
}

run();