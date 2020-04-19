var mysql = require('mysql');
const express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var multer = require('multer');
const path = require('path');

var file_name = 1;


// Set The Storage Engine
const storage = multer.diskStorage({
	destination: './website/images/',
	filename: function(req, file, callback){
		var fl_nm = file_name.toString() + path.extname(file.originalname);
		//callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		file_name = file_name + 1;
		callback(null, fl_nm);
	}
});

var textUpload = multer();
// Init Upload
const upload = multer({
	storage: storage,
	fileFilter: function(req, file, cb){
		checkFileType(file, cb);
	}
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if(mimetype && extname){
	  	return cb(null,true);
	} else {
	  	cb('Error: Images Only!');
	}
}



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
	connection.query("SELECT `file_name` FROM lastSave where id=0", function(error, results, fields) {
		// console.log(results);
		// console.log("##################################################");
		// console.log(JSON.stringify(results));
		if(error){
			console.log("could't load last save");
		}
		else{
			file_name = results[0]['file_name'] + 1;
			console.log("current filename = "+ file_name);
		}
	});
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
	if(sess == undefined){
		res.sendFile(__dirname + "/website/login.html");
		
	}else{
		res.sendFile(__dirname + "/website/signUp.html");
	}
});


app.post('/file-text', textUpload.single("feed_text_body") ,function(req, res) {
	if(sess == undefined){
		res.sendFile(__dirname + "/website/login.html");
		res.end();
		return;
	}
	var feed_body = req.body["feed_text_body"];
	feed_body = removeBadChars(feed_body);
	//console.log(feed_body);
	connection.query("INSERT INTO feed ( id, `user_name`, `type`, `name`) VALUES (?,?,?,?)", [sess.user_id, sess.username, "text", feed_body], function(err, result){
        if(err){
			throw err;
		}else{
			console.log("record innserted into file-image");
			res.redirect('./home.html');
		}
    });

}) ;

app.post('/comment-sub', textUpload.single("feed_text_body") ,function(req, res) {

	var feed_body = req.body["feed_text_body"];
	feed_body = removeBadChars(feed_body);
	var time = new Date();
	var queryString = window.location.search;
	let queryString = anyString.substring(anyString.length - 1)
	connection.query("INSERT INTO comments ORDER BY creation_time DESC ( comment_id, `feed_id`, `username`, `comment`, `creation_time`) VALUES (?,?,?,?,?)", [id,queryString,sess.user_id, sess.username, feed_body,time], function(err, result){
        if(err){
			throw err;
		}else{
			console.log("record innserted into comment");
		}
    });

}) ;


app.post('/image_submit', function(req, res) {
	if(!sess.user_id){
		res.sendFile(__dirname + "/website/login.html");
		res.end();
		return;
	}
	upload(req, res, (err) => {
		if(err){
			console.log("~~~errrrrrroooooorrrrr~~~");
			console.log(err);
		}else {
			if(req.file == undefined){
				console.log("undefined1234567890");
			} else {
				console.log("##########################");
				console.log(req.file.filename);
				console.log("##########################");

				connection.query("INSERT INTO feed ( id, `user_name`, `type`, `name`) VALUES (?,?,?,?)", [sess.user_id, sess.username, "img","images/"+req.file.filename ], function(err, result){
				    if(err){
						throw err;
					}else{
						connection.query("UPDATE lastSave  SET `file_name`=? where id=0", [file_name] , function(err, result){
							if(err){
								console.log("issue with file name");
							}
						});
						console.log("record innserted into file-image");
						res.redirect('./home.html');
					}
				});
			}
		}
	});

});


app.post('/file-video', function(req, res) {
	res.send("sorry this is too much to handle, next phase we will get this done");
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

app.get('/get_feed', function(req, response){
	connection.query("SELECT `feed_id`, `id`, `user_name`, `type`, `name`, `creation_time`, `likes` FROM feed", function(error, results, fields) {
		// console.log(results);
		// console.log("##################################################");
		// console.log(JSON.stringify(results));
		if(error){
			response.send('errrrroor!!!');
		}
		else if (results.length > 0) {

			console.log("logged in! ");
			response.send(results);

		}
		response.end();
	});
});



app.get('/get_single_feed', function(req, response){
	
	var feedID = req.query.feed_id;
	console.log("~~~~~~~~~~~~~~feed id is:"+feedID);

	connection.query("SELECT `feed_id`, `id`, `user_name`, `type`, `name`, `creation_time`, `likes` FROM feed where `feed_id`=?",[feedID], function(error, results, fields) {
		if(error){
			response.send('errrrroor!!!');
		}
		else if (results.length > 0) {
			console.log("logged in! ");
			response.send(results);
		}
		response.end();
	});
});



app.get('/get_comment', function(req, response){
	
	var feedID = req.query.feed_id;
	console.log("~~~~~~~~~~~~~~feed id is:"+feedID);

	connection.query("SELECT `feed_id`, `id`, `user_name`, `type`, `name`, `creation_time`, `likes` FROM feed", function(error, results, fields) {
		// console.log(results);
		// console.log("##################################################");
		// console.log(JSON.stringify(results));
		if(error){
			response.send('errrrroor!!!');
		}
		else if (results.length > 0) {

			console.log("logged in! ");
			response.send(results);

		}
		response.end();
	});
});

app.use(function (req, res, next) {
	console.log(req.originalUrl);
    res.status(404).send("404'ed")
});


app.listen(port, function () {
        console.log('Example app listening on port' + port + '!');
});
