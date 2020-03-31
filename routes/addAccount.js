var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var encryption = require('../public/javascripts/encryption.js');
var router = express.Router();

var infrastructurePasswordsTable = new sqlConnection('infrastructure_passwords', 'account_id');

var EncryptionObject = new encryption();

async function getDatabaseInformation(mode, editID, req) {

  id = "";
  name = "";
  description = "";
  username = "";
  password = "";

  if (mode == "edit") {
    id = editID;

    accountInformation = await infrastructurePasswordsTable.findAllWhere('account_id', id);
    
    name = accountInformation[0]['name'];
    description = accountInformation[0]['description'];
    username = accountInformation[0]['username'];
    encryptedPassword = accountInformation[0]['password'];
    password = await EncryptionObject.decrypt(encryptedPassword);

  } else if (mode == "amend") {
    name = req.query.name;
    description = req.query.description;
    username = req.query.username;
    password = req.query.password;
  } 

  pageData = {
    'mode': mode,
    'databaseInformation': {
      'id': id,
      'name': name,
      'username': username,
      'password': password,
      'description': description
    }
  };
}

router.get('/', async function(req, res, next) {

  mode = "add";
  editID = null;
  if (typeof req.query.mode !== 'undefined') {
    if (req.query.mode == "edit") {
      mode = "edit";
      editID = req.query.id;
    }
    if (req.query.mode == "amend") {
      mode = "amend";
    }
  }

  await getDatabaseInformation(mode, editID, req);
  res.render('addAccount', {tabtitle: 'Documentation Software', pagetitle: 'Add Account', search: 'false', topnav: 'none', navSelected: 'passwords', subNavSelected: 'none', data: pageData});
});

module.exports = router;
