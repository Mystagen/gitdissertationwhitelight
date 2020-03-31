var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('userManagement', {tabtitle: 'Documentation Software', pagetitle: 'User Management', topnav: 'none', search: 'false', navSelected: 'userManagement', subNavSelected: 'none'});
});

module.exports = router;
