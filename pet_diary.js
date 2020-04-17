var mysql = require('mysql');
const express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'pet_diary'
});

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const port = 8000;


app.use(express.static('website'));


app.get('/', function (req, res) {
         res.sendFile(__dirname + "/website/signUp.html")
    }
);



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
app.post('/auth', function(request, response) {
    var username = request.body.username;
    username = username.replace("\"", "");
    username = username.replace("\'", "");
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				console.log("logged in! ");
				response.redirect('/home');
			} else {
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



app.use(function (req, res, next) {
    res.status(404).send("404'ed")
});


app.listen(port, function () {
        console.log('Example app listening on port' + port + '!');
    }
);