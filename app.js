var express             = require('express'),
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    methodOverride      = require('method-override'),
    expressSanitizer    = require('express-sanitizer');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
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

// Root reroute to Index
app.get('/', function(req, res) {
    res.redirect('/posts');
});

// INDEX - GET
app.get('/posts', function(req, res) {
    Post.find({}, function(error, posts) {
        if (error) {
            console.log(error);
        }
        else {
            res.render('index', {posts: posts});
        }
    });
});

// NEW - GET
app.get('/posts/new', function(req, res) {
    res.render('new');
});

// CREATE - POST
app.post('/posts', function(req, res) {
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.create(req.body.post, function(error, post) {
        if (error) {
            console.log('Error:');
            console.log(error);
            res.render('new');
        }
        else {
            console.log('New post:');
            console.log(post);
            res.redirect('/posts');
        }
    })
});

// SHOW - GET
app.get('/posts/:id', function(req,res) {
    Post.findById(req.params.id, function(error, post) {
        if (error) {
            console.log('Error:');
            console.log(error);
            res.redirect('/');
        }
        else {
            res.render('show', {post: post})
        }
    });
});

// EDIT - GET
app.get('/posts/:id/edit', function(req, res) {
    Post.findById(req.params.id, function(error, post) {
        if (error) {
            console.log('Error:');
            console.log(error);
            res.redirect('/');
        }
        else {
            res.render('edit', {post: post})
        }
    });
});

// UPDATE - PUT
app.put('/posts/:id', function(req, res) {
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(error, post) {
        if (error) {
            console.log('Error:');
            console.log(error);
            res.redirect('/');
        }
        else {
            res.redirect('/posts/' + req.params.id);
        }
    });
});

// DESTROY - DELETE
app.delete('/posts/:id', function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(error) {
        if (error) {
            console.log('Error:');
            console.log(error);
            res.redirect('/');
        }
        else {
            res.redirect('/posts');
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Server is running');
});