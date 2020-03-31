var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//Include page route.js here
var indexRouter = require('./routes/index');
var addItemRouter = require('./routes/addItem');
var allGroupsRouter = require('./routes/allGroups');
var allCategoriesRouter = require('./routes/allCategories');
var manageGroupRouter = require('./routes/manageGroup');
var manageCategoryRouter = require('./routes/manageCategory');
var infrastructureInformationRouter = require('./routes/infrastructureInformation');
var passwordsRouter = require('./routes/passwords');
var accountInformationRouter = require('./routes/accountInformation');
var addAccountRouter = require('./routes/addAccount');
var accessRightsRouter = require('./routes/accessRights');
var editAccessRightsRouter = require('./routes/editAccessRights');
var addAccessRightsRouter = require('./routes/addAccessRights');
var userManagementRouter = require('./routes/userManagement');
var addGroupRouter = require('./routes/addGroup');
var addCategoryRouter = require('./routes/addCategory');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Add page URL here
app.use('/', indexRouter);
app.use('/addItem', addItemRouter);
app.use('/allGroups', allGroupsRouter);
app.use('/allCategories', allCategoriesRouter);
app.use('/manageGroup', manageGroupRouter);
app.use('/manageCategory', manageCategoryRouter);
app.use('/infrastructureInformation', infrastructureInformationRouter);
app.use('/passwords', passwordsRouter);
app.use('/accountInformation', accountInformationRouter);
app.use('/addAccount', addAccountRouter);
app.use('/accessRights', accessRightsRouter);
app.use('/editAccessRights', editAccessRightsRouter);
app.use('/addAccessRights', addAccessRightsRouter);
app.use('/userManagement', userManagementRouter);
app.use('/addGroup', addGroupRouter);
app.use('/addCategory', addCategoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
