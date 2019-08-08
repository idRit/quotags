const axios = require('axios');

exports.getHashTagsByKey = async (req, res) => {
    let key = req.params.key;
    let hashtags = await getHashtags(key);
    res.json(hashtags);
}

exports.getPopularHashtags = async (req, res) => {
    let hashtags = await getPop();
    res.json(hashtags);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

async function getHashtags(key) {
    let hashtagsBody = await axios.get('http://best-hashtags.com/hashtag/' + key);
    let hashtags = await parseHashTags(hashtagsBody.data.toString());
    return hashtags;
}

async function parseHashTags(body) {
    let hashtags = "";
    let startTag = body.split('<div class="tag-box tag-box-v3 margin-bottom-40">\n<p>');
    let endtag = startTag.toString().split('</p1>\n</div>');

    let startTag1 = body.split('<div class="tag-box tag-box-v3 margin-bottom-40">\n<p>');
    let endtag1 = startTag1.toString().split('</p2>\n</div>');

    let extractedHashtags = endtag[0].split('40">\n<p1> ')[1];
    hashtags += extractedHashtags;

    let extractedHashtags2 = endtag1[0].split('40">\n<p2> ')[1];

    let eH = [{
        hashtags: extractedHashtags.replace(new RegExp(escapeRegExp('bhfyp'), 'g'), 'quotags')
    }, {
        hashtags: extractedHashtags2.replace(new RegExp(escapeRegExp('bhfyp'), 'g'), 'quotags')
    }];

    return eH;
}

async function parseBody() {
    let mainBody = await axios.get("https://www.all-hashtag.com/library/contents/ajax_top.php");
    let parsedBody = mainBody.data.toString();
    return parsedBody;
}

async function getPop() {
    let hashtags = [];
    let fullBody = await parseBody();
    console.log(fullBody);
    let startTag = fullBody.split('<span class="hashtag">');
    let endTag = startTag.toString().split('</span>');
    console.log(endTag);
    endTag.forEach((tag) => {
       let extractedWord = tag.split(',')[1];
       hashtags.push({
           hashtag: extractedWord
       });
    });
    hashtags = hashtags.filter((val) => /(?:\s|^)#[A-Za-z0-9\-\.\_]+(?:\s|$)/g.test(val.hashtag) );
    return hashtags;
}