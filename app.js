var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');

var routes = require('./routes/routes');
var cors = require('cors');
var app = express();

var fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))
app.use(cors());
//app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use(multer().single('image'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let User = require('./models/User');
let ServerUser = require('./models/ServerUser');
let Server = require('./models/Server');
let Room = require('./models/Room');
let Message = require('./models/Message');
let Friend = require('./models/Friend');

Server.hasMany(Room)
Room.belongsTo(Server)

Room.hasMany(Message)
Message.belongsTo(Room)

User.hasMany(Message)
Message.belongsTo(User)

User.belongsToMany(Server, { through: ServerUser })
Server.belongsToMany(User, { through: ServerUser })

User.hasMany(Friend, {foreignKey: 'userId1'})
Friend.belongsTo(User, {foreignKey: 'userId2'})

/*let sequelize = require('./controllers/DatabaseController');
sequelize.sync().then(result => {

}).catch(error => {
    console.log(error);
})*/

module.exports = app;
