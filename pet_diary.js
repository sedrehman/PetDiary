const express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const port = 8000;


app.use(express.static('public'));


app.get('/', function (req, res) {
         res.sendFile(__dirname + "/website/signUp.html")
    }
);

app.get('/signUp.html', function (req, res) {
    res.sendFile(__dirname + "/website/signUp.html")
}
);

app.get('/login.html', function (req, res) {
    res.sendFile(__dirname + "/website/login.html")
}
);

app.get('/createFeed.html', function (req, res) {
    res.sendFile(__dirname + "/website/createFeed.html")
}
);

app.get('/home.html', function (req, res) {
    res.sendFile(__dirname + "/website/home.html")
}
);

app.get('/item.html', function (req, res) {
    res.sendFile(__dirname + "/website/item.html")
}
);

app.get('/messages.html', function (req, res) {
    res.sendFile(__dirname + "/website/messages.html")
}
);

app.get('/profile.html', function (req, res) {
    res.sendFile(__dirname + "/website/profile.html")
}
);

app.get('/profile3.html', function (req, res) {
    res.sendFile(__dirname + "/website/profile3.html")
}
);

app.get('/profile2.html', function (req, res) {
    res.sendFile(__dirname + "/website/profile2.html")
}
);


app.get('/edit.html', function (req, res) {
    res.sendFile(__dirname + "/website/edit.html")
}
);
app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + "/website/style.css")
}
);

app.get('/Messenger.css', function (req, res) {
    res.sendFile(__dirname + "/website/Messenger.css")
}
);

app.get('/script.js', function (req, res) {
    res.sendFile(__dirname + "/website/script.js")
}
);

app.get('/images/banner.jpg', function (req, res) {
    res.sendFile(__dirname + "/images/banner.jpg")
}
);


app.get('/images/bunham.jpg', function (req, res) {
    res.sendFile(__dirname + "/images/bunham.jpg")
}
);

app.get('/images/cute_kitten.jpg', function (req, res) {
    res.sendFile(__dirname + "/images/cute_kitten.jpg")
    
}
);

app.get('/images/cuteDuo.jpg', function (req, res) {
    res.sendFile(__dirname + "/images/cuteDuo.jpg")
}
);

app.get('/images/cuteDuo.jpg', function (req, res) {
    res.sendFile(__dirname + "/images/cuteDuo.jpg")
}
);

app.get('/Profile_placeholder.png', function (req, res) {
    res.sendFile(__dirname + "/website/Profile_placeholder.png")
}
);

app.get('/images/turtleparrot.jpg', function (req, res) {
    res.sendFile(__dirname + "/images/turtleparrot.jpg")
}
);
app.use(function (req, res, next) {
    res.status(404).send("404'ed")
});


app.listen(port, function () {
        console.log('Example app listening on port' + port + '!');
    }
);