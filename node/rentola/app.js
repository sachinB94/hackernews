
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var qt = require('quickthumb');

var app = express();

var mongo = require('mongoskin');
var db_static = mongo.db("mongodb://heroku_app35713051:3tnbagiho01qhum02aj3d7k6v6@ds061711.mongolab.com:61711/rentola_static", {native_parser:true});
var db = mongo.db("mongodb://heroku_app35713051:3tnbagiho01qhum02aj3d7k6v6@ds061611.mongolab.com:61611/rentola", {native_parser:true});

var RedisStore = require("connect-redis")(express);
var redis = require("redis").createClient();
redis.on("error", function (err) {
	console.log("ERROR: " + err);
});

var createdb = require('./routes/createdb');
var index = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');
var logout = require('./routes/logout');
var search = require('./routes/search');
var sendmessage = require('./routes/sendmessage');
var deletemessage = require('./routes/deletemessage');
var ownerviewlist = require('./routes/ownerviewlist');
var ownerinbox = require('./routes/ownerinbox.js')
var ownerhome = require('./routes/ownerhome');
var studenthome = require('./routes/studenthome');
var updateprofile = require('./routes/updateprofile')
var listbytype = require('./routes/listbytype');
var postlisting = require('./routes/postlisting');
var viewlist = require('./routes/viewlist');
var editlist = require('./routes/editlist');
var deletelist = require('./routes/deletelist');
var favourite = require('./routes/favourite');
var error = require('./routes/error');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({
	secret: "kqsdjfmlksdhfhzirzeoibrzecrbzuzefcuercazeafxzeokwdfzeijfxcerig",
	store: new RedisStore({ host: 'localhost', port: 6379, client: redis })
}));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(qt.static(__dirname + '/public/images'));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/createdb', function (req,res) { createdb.createdb(req,res,db_static); });

app.get('/', function (req,res) { index.index(req,res,db,db_static,redis); });
app.post('/register', function (req,res) { register.owner(req,res,db,redis); });
app.post('/login', function (req,res) { login.owner(req,res,db,redis); });
app.post('/studentregister', function (req,res) { register.student(req,res,db,redis); });
app.post('/studentlogin', function (req,res) { login.student(req,res,db,redis); });

app.get('/searchtitle', function (req,res) { search.title(req,res,db,db_static,redis); });
app.get('/searchall', function (req,res) { search.searchall(req,res,db,db_static,redis); });
app.get('/searchanything', function (req,res) { search.searchanything(req,res,db,db_static,redis); });

app.get('/list/:listId', function (req,res) { viewlist.viewlist(req,res,db,db_static,redis,req.params.listId); });
app.post('/sendmessage', function (req,res) { sendmessage.sendmessage(req,res,db); });
app.get('/deletemessage/:messageId', function (req,res) { deletemessage.deletemessage(req,res,db,req.params.messageId); });

app.get('/ownerhome', function (req,res) { ownerhome.ownerhome(req,res,db,db_static,redis); });
app.get('/studenthome', function (req,res) { studenthome.studenthome(req,res,db,db_static,redis); });
app.get('/userhome/ownerinbox', function (req,res) { ownerinbox.ownerinbox(req,res,db,redis); });
app.post('/updateprofile', function (req,res) { updateprofile.updateprofile(req,res,db,redis); });
app.post('/changepassword', function (req,res) { updateprofile.changepassword(req,res,db,redis); });
app.post('/listbytype', function (req,res) { listbytype.listbytype(req,res,redis); });
app.post('/postlisting', function (req,res) { postlisting.postlisting(req,res,db,redis); });
app.get('/ownerhome/:listId', function (req,res) { ownerviewlist.ownerviewlist(req,res,db,db_static,redis,req.params.listId); });
app.post('/editlist', function (req,res) { editlist.editlist(req,res,db); });
app.get('/deletelist/:listId', function (req,res) { deletelist.deletelist(req,res,db,req.params.listId); });
app.post('/addfavourite', function (req,res) { favourite.add(req,res,db); });
app.post('/removefavourite', function (req,res) { favourite.remove(req,res,db); });

app.get('/logout', function (req,res) { logout.logout(req,res,db,redis); });

app.get('/error/:errorCode/:err', function (req,res) { error.error(req,res,db_static,req.params.errorCode,req.params.err); });

http.createServer(app).listen(app.get('port'), function (){
	console.log('Express server listening on port ' + app.get('port'));
});