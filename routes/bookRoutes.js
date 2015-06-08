var express = require('express');

var routes = function (Book) {
    var bookRouter = express.Router();
    var bookController = require('../controllers/bookController')(Book)

    bookRouter.route('/')
        //post back to json array
        .post(bookController.post)

        //route to get books from json array, allow user to filter by genre with a query paramter
        .get(bookController.get)

    bookRouter.use('/:bookId', function (req, res, next) {
        Book.findById(req.params.bookId, function (err, book) {
            if (err)
                res.status(500).send(err);
            else if (book) {
                req.book = book;
                next();
            }
            else {
                res.status(404).send('no book found');
            }
        });
    });

    bookRouter.route('/:bookId')
        //get single objects by id
        .get(function (req, res) {

            var returnBook = req.book.toJSON();
            returnBook.links = {};
            var newLink = 'http://' + req.headers.host + '/api/books/?genre=' + returnBook.genre;
            returnBook.links.FilterByThisGenre = newLink.replace(' ', '%20');
            res.json(returnBook);
        })

        //put
        .put(function (req, res) {
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;
            req.book.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.book);
                }
            });
        })

        .patch(function (req, res) {
            //loop through every key and only change something if it changes
            if (req.body._id)
                delete req.body._id;

            for (var p in req.body) {
                req.book[p] = req.body[p];
            }
            req.book.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.book);
                }
            });
        })
        .delete(function (req, res) {
            req.book.remove(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });
    return bookRouter;
};

module.exports = routes;