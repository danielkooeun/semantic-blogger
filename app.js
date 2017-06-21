var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost/blogapp')


// mongoose boilerplate model
var postSchema = new mongoose.Schema({
    title: String,
    image: {type: String, default: 'http://english.tw/wp-content/themes/qaengine/img/default-thumbnail.jpg'},
    body: String,
    created: {type: Date, default: Date.now}
});
var Post = mongoose.model('Post', postSchema);

// RESTful ROUTES:

// Index - GET
app.get('/', function(req, res) {
    res.redirect('/blog');
});

app.get('/blog', function(req, res) {
    Post.find({}, function(error, posts) {
        if (error) {
            console.log(error);
        }
        else {
            res.render('index', {posts: posts});
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Server is running');
})