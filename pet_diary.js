var mysql = require('mysql');
const express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

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
	resave: true,
	saveUninitialized: false
}));

const port = 8000;


app.use(express.static('website'));


app.get('/', function (req, res) {
         res.sendFile(__dirname + "/website/signUp.html")
    }
);

function removeBadChars(bad){
	bad = bad.replace('<', '');
	bad = bad.replace('>', '');
	bad = bad.replace('\'', '');
	bad = bad.replace('\"', '');
	bad = bad.replace(' ', '');
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

	console.log(username );
	console.log(password);

	if (username && password) {
		request.session.user_id = "";
		connection.query("SELECT * from users WHERE email=? AND password=?",[username, password], function(error, results, fields) {
			console.log(results);
			if(error){
				response.send('Incorrect Username and/or Password!');
			}
			else if (results.length > 0) {
				request.session.loggedin = true;
				request.session.user_id = results['id'];
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
    }
);