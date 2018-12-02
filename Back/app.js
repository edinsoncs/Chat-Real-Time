//Import framework MVC expressjs -> Ultimate
const express  = require('express');
const path = require('path');
const bodyParser  = require('body-parser');
const cookieParser = require('cookie-parser');

//Import config
import config from './database/config';


let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let socket_conect = require('./socket/init');

//Import database no-sql
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const monk = require('monk');
const db = monk('localhost:27017/chat');


//Import jwt
const jsonwebtoken = require("jsonwebtoken");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use(function(req, res, next) {

 if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
 	
 	jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'p4stx!d39xz<!ag', function(err, decode) {
    if (err)req.user = undefined;
       console.log('ingrese');
      req.user = decode;
      next();
    });

 } else {
 	req.user = undefined;
    next();
 }
 

});



//Other imports

socket_conect.connect(io);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

mongoose.connect(config.db, function(err, res) {
    if (err) throw err;
    console.log('MONGOOSE');
});

app.use(function(req, res, next) {
    req.db = db;
    next();
});


app.get('/list', (req, res, next) => {

  let db = req.db;
  let chats = db.get('chats');

  chats.find({}, { limit : 20 }, (err, data) =>{
    if(err) return err;
    if(data) {
      res.json(data.reverse());
    }
  });


});


app.post('/', (req, res, next) => {

  let db = req.db;
  let chats = db.get('chats');

  chats.insert(req.body, (err, data) => {
    if(err)return err;
    res.json({accept: true});
  })


});



server.listen(config.port, () => {

	console.log('run server in nodejs -> pasdog');

});