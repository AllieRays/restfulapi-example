// End to End integration testing
//https://www.npmjs.com/package/supertest
//The motivation with supertest is to provide a high-level abstraction for testing HTTP,
// while still allowing you to drop down to the lower-level API provided by super-agent.
//Supertest lets you manipulate the environment variables in gulp so you can set up a test environment end to end including the database in the dev environment.

var should = require('should'),
    request = require('supertest'),
    app = require('../app.js'),
    mongoose = require('mongoose'),
    Book = mongoose.model('Book'),
    agent = request.agent(app);

describe('Book Crud Test', function () {
    it('Should allow a book to be posted and return a read and _id', function (done) {
        var bookPost = {title: 'new Book', author: 'Jon', genre: 'Fiction'};
        agent.post('/api/books')
            .send(bookPost)
            .expect(200)
            .end(function (err, results) {
                results.body.read.should.not.equal(false);
                results.body.should.have.property('_id');
                done()
            })
    })

    afterEach(function (done) {
        book.remove().exec();
        done();
    })
})

