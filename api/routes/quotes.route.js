module.exports = (app) => {
    let quoteController = require('../controllers/quote.controller');

    //comented code is for future use!!!

    //app.get('/api/getQuotes', quoteController.getQuotes);
    //app.get('/api/getQuotesByScore/:sentimentScore', quoteController.getQuotesByScore);
    //app.post('/api/analyzeQuote', quoteController.analyzeQuote);
    
    app.get('/api/getQuotesByTag/:tag/:page', quoteController.getQuotesByTag);
    app.get('/api/getQuoteCountAndPages/:tag', quoteController.getQuoteCountAndPages);
}