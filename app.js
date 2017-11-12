var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session');
app = express();

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
  }));

app.use(bodyParser.urlencoded({extended: true}));

///////
var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
mongoose.connect("mongodb://localhost/user"); //connects the database

var UserSchema = new mongoose.Schema({ // creates structure for the User
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  }
});

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

  var User = mongoose.model('User', UserSchema); // takes the Schema and returns a Javascript object
  module.exports = User;
////////

app.use(express.static("public")); // Telling express to use the public folder
app.set("view engine", "ejs"); // Telling express that the files are ejs

var port = process.env.PORT || 1337;

app.get('/map', function(req,res){
    res.render('map');
});
app.get('/', function(req, res){
res.send('Hello World!');
});

app.get('/home', function(req, res){
    res.render('home');
});


app.listen(port, function(){
    console.log('Server has started on ' + port);
});
app.get("/signup",function(req, res){
    res.render('signup');
});

app.post("/addUser", function(req,res){
    if (req.body.email 
        && req.body.username &&
        req.body.password &&
        req.body.passwordConf
    ) {
        var userData = { // creating a object using user data that is being retrieved
          email: req.body.email,
          username: req.body.username,
          password: req.body.password, 
          passwordConf: req.body.passwordConf,
        }
        console.log("WE GOOD HERE SIR!");
    }


    // using schema.create to insert data into the db
    User.create(userData, function (err, user) {
        if (err) {
          console.log(err);
          console.log("SOMETHING WENT WRONG!!!");
        } else {
            req.session.userId = user._id;
          return res.redirect('/signup');
        }
      });
});
