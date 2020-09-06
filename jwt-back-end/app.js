var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./database');
const JwtUtil = require('./jwt');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res, next) => {
    const { origin, Origin, referer, Referer } = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", 'Express');
    next();
});

app.use(function (req, res, next) {
    // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验
    if (req.url != '/login' && req.url != '/save') {
        let token = req.headers.token;
        let jwt = new JwtUtil(token);
        let result = jwt.verifyToken();
        // 如果考验通过就next，否则就返回登陆信息不正确
        if (result == 'err') {
            res.send({status: 403, msg: '登录已过期,请重新登录'});
            // res.render('login.html');
        } else {
            next();
        }
    } else {
        next();
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(8088)

module.exports = app;
