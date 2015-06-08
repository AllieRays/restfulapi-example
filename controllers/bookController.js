var bookController = function (Book) {

    var post = function (req, res) {
        var book = new Book(req.body);

        if (!req.body.title) {
            res.status(400);
            res.send('Title is required');
        }
        else {
            book.save();
            res.status(201);
            res.send(book);
        }
    }

    var get = function (req, res) {
        var query = {};
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        Book.find(query, function (err, books) {
            if (err)
                res.status(500).send(err);
            else


            //adding hypermedia - loop through and append links onto the books
            //create a new array. Use .push to append each item to the array.
            var returnBooks = [];
            books.forEach(function (element, index, array) {
                //create new book to copy the element over in order to leave mongoose model alone
                var newBook = element.toJSON();
                newBook.links = {};
                newBook.links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id
                returnBooks.push(newBook);
            });
            res.json(returnBooks);
        });
    }

    //return functions in order to make them accessible by other files
    return {
        post: post,
        get: get
    }

}

module.exports = bookController;