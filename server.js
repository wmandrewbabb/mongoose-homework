const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

//express

const PORT = process.env.PORT || 3000;
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(require('./controllers'));

//mongoose
mongoose.Promise = Promise;

const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/news";

mongoose.connect(dbURI, { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", function(error) {
    console.log("ERROR WITH MONGOOSE: ", error);
});

db.once("open", function() {
    console.log("Mongoose running -- success!");
    // start the server, listen on port 3000
    app.listen(PORT, function() {
        console.log("App running on port " + PORT);
    });
});

module.exports = app;