var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db;
console.log('Hello');
if(process.env.ENV == 'Test'){
    db = mongoose.connect('mongodb://localhost/bookAPI_test');
}
else{
    db= mongoose.connect('mongodb://localhost/bookAPI');
}

var Book = require('./models/bookModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
//look at the body and add any json to the db
app.use(bodyParser.json());

bookRouter = require('./routes/bookRoutes')(Book);

app.use('/api/books', bookRouter);

app.get('/', function (reg, res) {
    res.send('welcome to my API');
});

app.listen(port, function () {
    console.log('Gulp is running on PORT:' + port);
});

//allows supertest to excute on the app
module.exports = app;