let axios = require('axios');
let cbks = require('./api/models/combacks.model');

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

async function run() {
    let comebacks = await getAllcbks();

    comebacks.forEach(async (cbcke) => {
        let newcbc = new cbks(cbcke);
        let prom = await newcbc.save();
        console.log(prom);
    });

    //console.log(comebacks);
}

run();