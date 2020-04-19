var mysql = require('mysql');
const express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();


var connection = mysql.createConnection({
	host:'localhost',
	user:'phpmyadmin',
	password:'hello123',
	database:'pet_diary',
	port:3306
});

connection.connect(function(err) {
	if (err) {
	  return console.error('error: ' + err.message);
	}

	console.log('Connected to the MySQL server.');
});


const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: 'cse312',
	saveUninitialized: true,
	resave: true
}));
var sess;

const port = 8000;


app.use(express.static('website'));


app.get('/', function (req, res) {
         res.sendFile(__dirname + "/website/signUp.html")
    }
);

app.post('/file-text', upload.single("feed_text_body") ,function(req, res) {

	var feed_body = req.body["feed_text_body"];
	feed_body = removeBadChars(feed_body);
	connection.query("INSERT INTO feed ( id, `user_name`, `type`, `name`) VALUES (?,?,?,?)", [sess.user_id, sess.username, "text", feed_body], function(err, result){
        if(err){
			throw err;
		}else{
			console.log("record innserted into file-image");
			res.redirect('./home.html');
		}
    });
	
}) ;


app.post('/file-image', function(req, res) {
	var username=req.body.name;
    connection.query("INSERT INTO names (name) VALUES (?)",[], function(err, result){
        if(err) throw err;
            console.log("record innserted into file-image");
        });
    res.send(username);
});


app.post('/file-video', function(req, res) {
	const post = models.feed.build({
		id: req.session.id,
		username: req.session.username,
		name: req.name.file,
		type: "video",
		creation_time: Date.now()
	});

	post.save().then(function(post) {
		console.log(post);
	});
});

app.post('/create-comment', function(req, res) {
	const post = models.feed.build({
		id: req.session.id,
		username: req.session.username,
		name: req.name.file,
		type: "video",
		creation_time: Date.now()
	});

	post.save().then(function(post) {
		console.log(post);
	});
});

function removeBadChars(bad){
	bad = bad.replace('<', '');
	bad = bad.replace('>', '');
	bad = bad.replace('\'', '');
	bad = bad.replace('\"', '');
	//bad = bad.replace(' ', '');
	bad = bad.replace('$', '');
	bad = bad.replace('*', '');
	bad = bad.replace('#', '');
	bad = bad.replace('&', '');
	bad = bad.replace('!', '');
	bad = bad.replace('~', '');
	bad = bad.replace('`', '');
	bad = bad.replace('%', '');
	bad = bad.replace('^', '');
	bad = bad.replace('(', '');
	bad = bad.replace(')', '');
	bad = bad.replace('=', '');
	bad = bad.replace('-', '');
	bad = bad.replace('[', '');
	bad = bad.replace(']', '');
	bad = bad.replace('{', '');
	bad = bad.replace('}', '');
	bad = bad.replace(';', '');
	bad = bad.replace(',', '');
	bad = bad.replace('/', '');
	bad = bad.replace('\\', '');
	var good  = bad;
	return good;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
app.post('/auth', function(request, response) {
    var username = request.body["username"];
	username = removeBadChars(username);
	var password = request.body["password"];
	password = removeBadChars(password);

	
	console.log("~~~~~~~~~~~~~~~log in ~~~~~~~~~~~~~~~~~");

	if (username && password) {
		sess = request.session;

		connection.query("SELECT * from users WHERE email=? AND password=?",[username, password], function(error, results, fields) {
			console.log(results);
			// console.log(results.length);
			// console.log(results[0].length);
			// console.log(results[0]);
			if(error){
				response.send('Incorrect Username and/or Password!');
			}
			else if (results.length > 0) {
				
				sess.user_id = results[0]['id'];
				sess.username = results[0]['name'];
				// console.log(results[0]['id']);
				console.log("logged in! ");
				response.redirect('./home.html');
				
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.use(function (req, res, next) {
    res.status(404).send("404'ed")
});


app.listen(port, function () {
        console.log('Example app listening on port' + port + '!');
});
