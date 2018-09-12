const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const Article = require('../../models/article');

// get articles from db
router.get('/', function(req, res) {

    Article.find({}).exec(function(error, data) {

        if (error) {

            console.log(error);
            res.status(500);

        } else {

            res.status(200).json(data);

        }

    });
});

// get saved articles 
router.get('/saved', function(req, res) {

    Article.find({}).where('saved').equals(true).where('deleted').equals(false).populate('notes').exec(function(error, data) {

        if (error) {

            console.log(error);
            res.status(500);

        } else {

            res.status(200).json(data);

        }
    });
});

// get all deleted articles
router.get('/deleted', function(req, res) {

    Article.find({}).where('deleted').equals(true).exec(function(error, data) {

        if (error) {

            console.log(error);
            res.status(500);

        } else {

            res.status(200).json(data);

        }
    });
});

// post article by id
router.post('/save/:id', function(req, res) {

    Article.findByIdAndUpdate(req.params.id, {$set: { saved: true}}, { new: true }, function(error, doc) {
        
        if (error) {

            console.log(error);
            res.status(500);

        } else {

            res.redirect('/');

        }
    });
});

// delete an article
router.delete('/dismiss/:id', function(req, res) {

    Article.findByIdAndUpdate(req.params.id, { $set: { deleted: true } }, { new: true }, function(error, doc) {

        if (error) {

            console.log(error);
            res.status(500);

        } else {

            res.redirect('/');

        }
    });
});

// delete a saved article by id
router.delete('/:id', function(req, res) {

    Article.findByIdAndUpdate(req.params.id, { $set: { deleted: true} }, { new: true }, function(error, doc) {
        
        if (error) {

            console.log(error);
            res.status(500);

        } else {

            res.redirect('/saved');

        }

    });
});

// get scraped articles
router.get('/scrape', function(req, res, next) {
    request('https://comicbook.com/', function(error, response, html) {

        let $ = cheerio.load(html);

        $('article').each(function(i, element) {

            let title = $(element).find("h3").find("a").text();
            let link = $(element).find("h3").find("a").attr("href");
            let img = $(element).find("img").attr("src");

            let articleObj = {};

            if (link !== undefined && link.includes('http') &&  title !== '') {

                articleObj = {
                    title: title,
                    link: link,
                    img: img
                };

                // create and save an article in the database

                let entry = new Article(articleObj);
                entry.save(function(err, doc) {

                    if (err) {

                        console.log(err);
                        
                    } else {

                        console.log('Scrape completed.');

                    }
                });
            }
        });

        next();

    });
}, function(req, res) { 
    
    res.redirect('/');

});

module.exports = router;