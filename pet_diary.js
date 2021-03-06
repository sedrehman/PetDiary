var mysql = require('mysql');
const express = require('express');
var session = require('express-session');
// var exphbs = require('express-handlebars');
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


//host: localhost for normal testing
//mysql for docker
var connection = mysql.createConnection({
	host:'mysql',
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

	// ~~~~~~~~Create tables if they dont exists ..~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	connection.query(`CREATE TABLE if not exists users( id int(10) unsigned primary key auto_increment,
		email varchar(255) not null, password varchar(255) not null, name varchar(255) not null,
		bio varchar(255), requests TEXT, friends TEXT );`, function(error, result, fields){
			if(error){
				console.error('could not make user table ' + error.message);
			}
	});
	connection.query(`CREATE TABLE if not exists comments(comment_id int(10) unsigned primary key auto_increment,
		feed_id int(10) unsigned not null, username varchar(255) not null, comment varchar(255) not null,
		creation_time datetime DEFAULT CURRENT_TIMESTAMP not null);`, function(error, result, fields){
			if(error){
				console.error('could not make comments table ' + error.message);
			}
	});

	connection.query(`CREATE TABLE if not exists feed ( feed_id int(10) unsigned primary key auto_increment,
		id int(10) unsigned not null, user_name varchar(255) not null, type varchar(255) not null,
		name varchar(255) not null, creation_time datetime DEFAULT CURRENT_TIMESTAMP not null,
		likes int(10) unsigned not null );`, function(error, result, fields){
			if(error){
				console.error('could not make comments table ' + error.message);
			}
	});
	//SELECT `to_id`, `to_name`, `from_id`, `from_name`, `msg` FROM `messages` WHERE 1
	connection.query(`CREATE TABLE if not exists messages ( to_id int(10) unsigned not null,
		to_name varchar(255) not null, from_id int(10) unsigned not null, from_name varchar(255) not null,
		msg varchar(255) );`, function(error, result, fields){
			if(error){
				console.error('could not make messages table ' + error.message);
			}
	});

	connection.query("CREATE TABLE if not exists lastSave ( `file_name` int(10) unsigned not null, id int(10) unsigned not null ) ;",
		function(error, result, fields){
			if(error){
				console.error('could not make comments table ' + error.message);
			}
	});
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	connection.query("SELECT `file_name` FROM lastSave where id=0", function(error, results, fields) {
		// console.log(results);
		// console.log("##################################################");
		// console.log(JSON.stringify(results));
		if(error){
			console.log("could't load last save");
		}
		if(results.length < 1){
			connection.query("INSERT INTO lastSave (`file_name` , `id`) VALUES (?, ?);", [0, 0],
			function(error, result, fields){
				if(error){
					console.error('add to lastSave ' + error.message);
				}
			});
			connection.query("SELECT `file_name` FROM lastSave where id=0", function(error, res, fields) {
				if(res){
					file_name = res[0]['file_name'] + 1;
					console.log("current filename = "+ file_name);
				}else{
					console.log("res is null again");
				}
			});
			
		}else{
			console.log(results);
			file_name = results[0]['file_name'] + 1;
			console.log("current filename = "+ file_name);
		}
		
	});
});


const app = express();

// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: 'cse312',
	saveUninitialized: true,
	resave: true
}));
const port = 8000;



//middleware . this is very important. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.use(function (req, res, next) {
	var req_path = req.path;
	console.log(req_path);
	if( req_path.includes("profile") || req_path.includes("home") || req_path.includes("item") || req_path.includes("edit") || req_path.includes("createFeed") ||
	req_path.includes("messages")){
		user_id = req.session.user_id;
		token = req.session.token;
		if(!user_id || !token){
			res.redirect("./login.html");
		}else{
			next();
		}

	}else{
		next();
	}
});

app.use(express.static('website'));
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/website/login.html");
});


app.post('/file-text', textUpload.single("feed_text_body") ,function(req, res) {
	
	var feed_body = req.body["feed_text_body"];
	feed_body = removeBadChars(feed_body);
	//console.log(feed_body);
	connection.query("INSERT INTO feed ( id, `user_name`, `type`, `name`, `likes`) VALUES (?,?,?,?,?)",
	[req.session.user_id, req.session.username, "text", feed_body, 0], function(err, result){
        if(err){
			throw err;
		}else{
			console.log("record innserted into file-image");
			res.redirect('./home.html');
    	}

	});
});


app.post('/profile-image', function(req, res) {
	
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
				connection.query("UPDATE users SET profile_image = `description`=? where `id`=?",["images/"+req.file.filename, req.session.user_id], function(err, result){
				    if(err){
						throw err;
					}else{
						connection.query("UPDATE lastSave  SET `file_name`=? where id=0", [file_name] , function(err, result){
							if(err){
								console.log("issue with file name");
							}
						});
						console.log("record innserted into image_submit");
						res.redirect('./home.html');
					}
				});
			}
		}
	});

});

app.post('/comment-sub', textUpload.single("feed_text_body") ,function(req, res) {
	console.log("here "+ req.query);
	
	var feed_body = req.body["feed_text_body"];
	feed_body = removeBadChars(feed_body);

	var feedID = req.query.feed_id;
	console.log("~~~~~~~~~~~~~~feed id is:"+feedID);

	connection.query("INSERT INTO comments ( `feed_id`, `username`, `comment`) VALUES (?,?,?)", [feedID, req.session.username, feed_body], function(err, result){
        if(err){
			throw err;
		}else{
			console.log("record innserted into comment");
			res.redirect('./item.html?feed_id='+feedID);
		}
    });

}) ;


app.post('/image_submit', function(req, res) {
	
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

				connection.query("INSERT INTO feed ( id, `user_name`, `type`, `name`, `likes`) VALUES (?,?,?,?,?)", [req.session.user_id, req.session.username, "img","images/"+req.file.filename, 0 ], function(err, result){
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


app.post('/signup_form' , function(request, response){

	var name = request.body["name"];
	var email = request.body["email"];
	var pass = request.body["pass"];

	var flag = true;
	var err_mid = "";

	if(email.includes("@")){
		connection.query("SELECT * from users WHERE email=?",[email], function(error, results, fields) {
			if(results.length > 0){
				flag = false;
			}
		});
		if(flag != false && pass.length > 7){
			if(name.length > 0){
				connection.query("INSERT INTO users( email, password, name) VALUES(?,?,?)", [email, pass, name], function(err, results){
					if(err){
						console.log("~~~~~~~~~~~~~~failed to sign up ~~~~~~~~~~~~~");
						console.log(err.message);
					}
				});
				
				response.redirect('./login.html');
			}else{
				err_mid = "Please Enter a valid name";
				flag = false;
			}
		}else{
			err_mid = "Please Enter a password 8 or more characters";
			flag = false;
		}
	}else{
		err_mid = "Please Enter a valid email";
		flag = false;
	}

	if(flag == false) {
		var body_signup1 =  `
			<!DOCTYPE html>
			<html>
			<head>
			<title>
			</title>
			<link rel = "stylesheet" type = "text/css" href = "style.css" />
			<style>
			</style>
			<script src="script.js">
			</script>
			</head>
			<body class ="centered">
			<img src="../images/bunham.jpg" id="bunham">
			<img src="../images/turtleparrot.jpg" id="turtleparrot">
			<div id = "signUpBox">
			<form action="/signup_form" method="post">`;

		var mid_msg = "<p>" + err_mid + "</p>";

		var body_signup2 = `
			<label id="msg_lbl"></label>
			<label for="name">Name: </label><br/><br>
			<input id="name" name = "name" type="text"><br/><br>
			<label for="pass">Password: </label><br/><br>
			<input id="pass" name = "pass" type="text"><br/><br>
			<label for="email">Email: </label><br/><br>
			<input id="email" name = "email" type="text"><br/><br>
			<input type="submit" value="Sign Up">
			<br><br>
			<a href = "login.html">Already have an account? Log in here!</a>
			</form>
			</div>
			</body>
			</html> `;

		response.send(body_signup1 + mid_msg + body_signup2);
	}

});


//~~~~~~~~~~~~~~~~~~~~~~~~log in form~~~~~~~~~~~~~~~~~~~~~`
app.post('/auth', function(request, response) {
    var username = request.body["username"];
	username = removeBadChars(username);
	var password = request.body["password"];
	password = removeBadChars(password);


	console.log("~~~~~~~~~~~~~~~log in ~~~~~~~~~~~~~~~~~");

	if (username && password) {

		connection.query("SELECT * from users WHERE email=? AND password=?",[username, password], function(error, results, fields) {
			console.log(results);
			// console.log(results.length);
			// console.log(results[0].length);
			// console.log(results[0]);
			if(error){
				response.send('Incorrect Username and/or Password!');username
			}else if (results.length > 0) {
				console.log(results[0]['id']);
				console.log(results[0]['email']);
				request.session.user_id = results[0]['id'];
				request.session.token = results[0]['email'];
				request.session.username = results[0]['name'];
				// console.log(results[0]['id']);
				console.log("logged in! ");
				response.redirect('./home.html');

			}else{
				response.send('Incorrect Username and/or Password!');
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
			console.log("found feed");
			response.send(results);
		}
		response.end();
	});
});



app.get('/get_comments', function(req, response){

	var feedID = req.query.feed_id;
	console.log("~~~~~~~~~~~~~~feed id is:"+feedID);

	connection.query("SELECT * FROM comments where `feed_id`= ?",[feedID], function(error, results, fields) {

		if(error){
			response.send('errrrroor!!!');
		}
		else if (results.length > 0) {

			console.log("sending comments");
			response.send(results);

		}
		response.end();
	});
});

app.post('/set_likes', function(req, response){
	
	var feedID = req.query.feed_id;
	var numOfLikes =  req.query.likes;
	var likes = parseInt(numOfLikes) + 1;

	console.log("~~~~~~~~~~~~~~feed id is:"+feedID);
	console.log("~~~~~~~~~~~~~~num of likes:"+likes);

	connection.query("UPDATE feed SET `likes`=? WHERE `feed_id`=?",[likes, feedID], function(error, results, fields) {

		if(error){
			console.log("error");
			response.send('errrrroor!!!');
		}
		else if (results.length > 0) {

			console.log("likes set");
		}
		response.end();
	});
});
app.post('/reject_request', function(req, response){
	

	var receiver_id = req.session.user_id;
	var sender_id = req.session.sender_id;

	var receiver_friends = 'SELECT friends FROM users WHERE id = ';

	// var receiver_friends = "";
	// var receiver_requests = "";
	// var sender_friends = "";

	// receiver_requests = receiver_requests + ;e9ccb229a23d
	// sender_friends = sender_friends + ;
	// receiver_friends = receiver_friends + ,

		connection.query("SELECT users FROM `friends`=? WHERE `feed_id`=?",[likes, feedID], function(error, results, fields) {

		if(error){
			console.log("error");
			response.send('errrrroor!!!');
		}
		else if (results.length > 0) {

			console.log("likes set");
			res.redirect('./home.html');
		}
		response.end();
	});
});

app.post('/accept_request', function(req, response){


	var receiver_id = req.session.user_id;

	var sender_id = req.session.sender_id;
	var requests =

	//friends_rec = friends_rec + ;

	connection.query("SELECT users SET `friends`=? WHERE `id`=?",[likes, feedID], function(error, results, fields) {

		if(error){
			console.log("error");
			response.send('errrrroor!!!');
		}
		else if (results.length > 0) {

			console.log("likes set");
			res.redirect('./home.html');
		}
		response.end();
	});
});

app.get('/get_person', function(req, res, err){
	//name ###### id
	var user_id = req.session.user_id;
	connection.query("SELECT * FROM users where id= ?",[user_id], function(error, results, fileds){
		if(error){
			console.log(error.message);
		}else{
			var name = results[0]['name'];
			var id = results[0]['id'];
			res.send(name+"######"+ id);
		}

	})
	//res.send(req.session.)
});

app.get('/get_friends', function(req, res, err){
	//name ###### id
	var user_id = req.session.user_id;
	connection.query("SELECT * FROM users where id= ?",[user_id], function(error, results, fileds){
		if(error){
			console.log(error.message);
		}else{
			var friends = results[0]['friends'];
			console.log("all frineds"+ friends);
			res.send(friends);
		}
		
	})
	//res.send(req.session.)
});


///get_msg?to=2&from=1
app.get('/get_msg', function(req, response, err){
	//to_id	to_name	from_id	from_name	msg
	var to = req.query.to;
	var from = req.query.from;

	connection.query("SELECT * FROM messages where (`to_id`= ? AND `from_id`=? ) OR ( `to_id`= ? AND `from_id`=? ) ",[to, from, from , to], function(error, results, fields) {
		if(error){
			console.log(error.message);
		}
		console.log("sending msg");
		response.send(results);
		response.end();
	});
});
//send_message?to=1&to_name=mini%20the%20cat&from=2&from_name=sed&msg=hey
app.post('/send_message', function(req, response, err){
	
	//to_id	to_name	from_id	from_name	msg
	var to = req.query.to;
	var to_name = req.query.to_name;
	var from = req.query.from;
	var from_name = req.query.from_name;
	var msg = req.query.msg;

	console.log(to + " " + to_name + " " + from + " " + from_name + " " + msg );

	connection.query("INSERT INTO messages (`to_id`, `to_name`, `from_id`, `from_name`, `msg`) VALUES (?,?,?,?,?)",[to, to_name, from , from_name, msg], 
	function(error, results, fields) {
		if(error){
			console.log(error.message);
		}
		else if (results.length > 0) {
			console.log("succcessfully added msg");
			//response.send(results);
		}
		response.end();
	});
});

app.get('/get_profile', function(req, response, err){
	var user_id = req.session.user_id;
	connection.query("SELECT * FROM users where `to_id`= ?",[user_id], function(error, results, fields) {

		if(error){
			console.log(error.message);
		}
		else if (results.length > 0) {
			console.log("sending msg");
			response.send(results);
		}
		response.end();
	});
});


app.post('/description', textUpload.single("feed_text_body") ,function(req, res) {

	var feed_body = req.body["feed_text_body"];
	feed_body = removeBadChars(feed_body);
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"+feed_body);
	//UPDATE feed SET `likes`=? WHERE `feed_id`=?"
	connection.query( "UPDATE users SET `bio` = ? WHERE `id` = ? " , [feed_body, req.session.user_id], function(err, result){
        if(err){
			console.log(err.message);
		}else{
			console.log("record inserted into description");
			res.redirect('./home.html');
		}
    });

}) ;

app.get("/getInfo", function(req, res, err){
	var person_id = req.query.ide;
	console.log("looking for ~~"+ person_id);
	connection.query("SELECT * from users WHERE id=?",[person_id], function(error, results, fields){
		if(error){
			console.log(error.message);
		}else{
			console.log("sending other's info");
			res.send(results);
		}
	});
});

///follow?ide=1
app.post("/follow", function(req, res, err){
	var person_id = req.query.ide;
	console.log("looking for ~~ \""+ person_id + "\"");
	
	var person_name;
	var person_friends;
	var user_friends;

	connection.query("SELECT * from `users` WHERE `id` = ?",[req.session.user_id], function(error, results, fields){
		if(error){
			console.log(error.message);
		}else{
			user_friends = results[0]['friends'];
			console.log(results);
			console.log("user name : " + req.session.username);

			connection.query("SELECT * from `users` WHERE `id` = ?",[person_id], function(error2, results, fields){
				if(error){
					console.log(error2.message);
				}else{
					person_name = results[0]['name'];
					console.log(results);
					person_friends = results[0]['friends'];
					console.log("persons name : " + person_name);


					//user
					var user_friends__ = "";
					if(!user_friends || user_friends.length < 6){
						user_friends__ = person_name+"@@@" + person_id;
					}else{
						user_friends__ = user_friends + "######"+person_name+"@@@" + person_id;
					}
					console.log("here~~~~~~0");
					connection.query("UPDATE `users` SET `friends` = ? WHERE `id` = ?",[user_friends__, req.session.user_id], function(e){
						console.log("here~~~~~~1");
						if(e){
							console.log(e.message);
						}
					});
					console.log("here~~~~~~2");
					

					//person
					var person_friends__ = "";
					if(!person_friends || person_friends.length < 6){
						person_friends__ = req.session.username + "@@@" + req.session.user_id;
					}else{
						person_friends__ = person_friends + "######" + req.session.username + "@@@" + req.session.user_id;
					}
					console.log("here~~~~~~3");
					connection.query("UPDATE `users` SET `friends` = ? WHERE `id` = ?",[person_friends__, person_id], function(e){
						console.log("here~~~~~~4");
						if(e){
							console.log(e.message);
						}
					});
					console.log("here~~~~~~5");
				}
			});
		}
	});
	
});


app.use(function (req, res, next) {
	console.log("404---->" +req.originalUrl);
});

app.listen(port, function () {
        console.log('Example app listening on port' + port + '!');
});
