var mysql = require('mysql');
const express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars');
var session = require('express-session');
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

app.post('/file-text', function(req, res) {
  const post = models.feed.build({
    id: req.session.id,
    username: req.session.username,
    name: req.name.file,
    type: "text",
    creation_time: Date.now()
  })

  post.save().then(function(post) {
    console.log(post);
  })
})

app.post('/file-image', function(req, res) {
  const post = models.feed.build({
    id: req.session.id,
    username: req.session.username,
    name: req.name.file,
    type: "image",
    creation_time: Date.now()
  })

  post.save().then(function(post) {
    console.log(post);
  })
})

app.post('/file-video', function(req, res) {
  const post = models.feed.build({
    id: req.session.id,
    username: req.session.username,
    name: req.name.file,
    type: "video",
    creation_time: Date.now()
  })

  post.save().then(function(post) {
    console.log(post);
  })
})

// app.get('/signUp.html', function (req, res) {
//     res.sendFile(__dirname + "/website/signUp.html")
// }
// );

// app.get('/login.html', function (req, res) {
//     res.sendFile(__dirname + "/website/login.html")
// }
// );

// app.get('/createFeed.html', function (req, res) {
//     res.sendFile(__dirname + "/website/createFeed.html")
// }
// );

// app.get('/home.html', function (req, res) {
//     res.sendFile(__dirname + "/website/home.html")
// }
// );

// app.get('/item.html', function (req, res) {
//     res.sendFile(__dirname + "/website/item.html")
// }
// );

// app.get('/messages.html', function (req, res) {
//     res.sendFile(__dirname + "/website/messages.html")
// }
// );

// app.get('/profile.html', function (req, res) {
//     res.sendFile(__dirname + "/website/profile.html")
// }
// );

// app.get('/profile3.html', function (req, res) {
//     res.sendFile(__dirname + "/website/profile3.html")
// }
// );

// app.get('/profile2.html', function (req, res) {
//     res.sendFile(__dirname + "/website/profile2.html")
// }
// );


// app.get('/edit.html', function (req, res) {
//     res.sendFile(__dirname + "/website/edit.html")
// }
// );
// app.get('/style.css', function (req, res) {
//     res.sendFile(__dirname + "/website/style.css")
// }
// );

// app.get('/Messenger.css', function (req, res) {
//     res.sendFile(__dirname + "/website/Messenger.css")
// }
// );

// app.get('/script.js', function (req, res) {
//     res.sendFile(__dirname + "/website/script.js")
// }
// );

// app.get('/images/banner.jpg', function (req, res) {
//     res.sendFile(__dirname + "/images/banner.jpg")
// }
// );


// app.get('/images/bunham.jpg', function (req, res) {
//     res.sendFile(__dirname + "/images/bunham.jpg")
// }
// );

// app.get('/images/cute_kitten.jpg', function (req, res) {
//     res.sendFile(__dirname + "/images/cute_kitten.jpg")

// }
// );

// app.get('/images/cuteDuo.jpg', function (req, res) {
//     res.sendFile(__dirname + "/images/cuteDuo.jpg")
// }
// );

// app.get('/images/cuteDuo.jpg', function (req, res) {
//     res.sendFile(__dirname + "/images/cuteDuo.jpg")
// }
// );

// app.get('/Profile_placeholder.png', function (req, res) {
//     res.sendFile(__dirname + "/website/Profile_placeholder.png")
// }
// );

// app.get('/images/turtleparrot.jpg', function (req, res) {
//     res.sendFile(__dirname + "/images/turtleparrot.jpg")
// }
// );
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
