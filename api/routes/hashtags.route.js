module.exports = (app) => {
    let hTagsController = require('../controllers/tag.controller');
    
    app.get('/api/getHashTagsByKey/:key', hTagsController.getHashTagsByKey);
}