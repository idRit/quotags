const axios = require('axios');

exports.getHashTagsByKey = async (req, res) => {
    let key = req.params.key;
    let hashtags = await getHashtags(key);
    res.json([{
        hashtags: hashtags.replace("bhfyp", "quotags")
    }]);
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
    let extractedHashtags = endtag[0].split('40">\n<p1> ')[1];
    hashtags += extractedHashtags;
    return hashtags;
}