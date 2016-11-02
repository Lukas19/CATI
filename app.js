var express 	= require('express');
var ip 			= require('ip');
var app 		= express();
var passport	= require('passport');
var bodyParser 	= require('body-parser');
var path 		= require('path');
var mysql 		= require('mysql');
var Usuario		= require('./models/usuario.js');
//var Admin 		= require('./models/admin.js');
var models 		= require("./models/index.js");
var parse		= require('csv-parse');
var morgan 		= require('morgan');
var cookieParser = require('cookie-parser');
var session		= require('express-session');
var multer = require('multer');

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

var parser = parse({delimiter: ','}, function(err, data){
// console.log(data);
});
//fs.createReadStream(__dirname+'/data.csv').pipe(parser);*/

/*var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));*/

//Express
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(multer({
	dest: "./public/uploads/"
}).single('sampleFile'));
app.use(session({ secret: 'estaweaeselsecretoctm' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname))); //REVISAR ESTA LÍNEA SI HAY PROBLEMAS!

//Routes
app.use('/api', require('./router/api'));
app.use('/',require('./router/routes.js'));
require('./config/passport')(passport);


//Start Server
models.sequelize.sync().then(function () {
	var server = app.listen(3000, function () {
		var host = ip.address();
		var port = server.address().port;
		console.log('Example app listening at http://%s:%s', host, port);
	});
});
