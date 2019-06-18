module.exports = (app) => {
    let quoteController = require('../controllers/quote.controller');
    let wordController = require('../controllers/word.controller');

    //comented code is for future use!!!

    //app.get('/api/getQuotes', quoteController.getQuotes);
    //app.get('/api/getQuotesByScore/:sentimentScore', quoteController.getQuotesByScore);
    //app.post('/api/analyzeQuote', quoteController.analyzeQuote);
    //app.get('/api/getQuoteOfDay', quoteController.getQuoteOfDay); depracated
    
    app.get('/api/getQuotesByTag/:tag/:page', quoteController.getQuotesByTag);
    app.get('/api/getQuoteCountAndPages/:tag', quoteController.getQuoteCountAndPages);
    app.get('/api/getRandomQuotes', quoteController.getRandomQuotes);
    
    app.get('/api/getRelatedWords/:word', wordController.getRelatedWords); //new
    app.get('/api/getPopularWords', wordController.getPopularWords); //new
}