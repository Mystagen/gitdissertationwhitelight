var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var encryption = require('../public/javascripts/encryption.js');
var router = express.Router();

var infrastructurePasswordsTable = new sqlConnection('infrastructure_passwords', 'account_id');

var EncryptionObject = new encryption();

async function getDatabaseInformation(passedID) {

  id = "";
  name = "";
  username = "";
  password = "";
  description = "";

  var infrastructurePasswordsTable = new sqlConnection('infrastructure_passwords');

  accountData = await infrastructurePasswordsTable.findAllWhere('account_id', passedID);

  if (accountData.length > 0) {
    id = accountData[0].account_id;
    name = accountData[0].name;
    username = accountData[0].username;
    encryptedPassword = accountData[0].password;
    password = await EncryptionObject.decrypt(encryptedPassword);
    description = accountData[0].description;
  }

  pageData = {
    'databaseInformation': {
      'id': id,
      'name': name,
      'username': username,
      'password': password,
      'description': description
    }
  };
}

async function updateAccounts(id, name, username, password, description) {
  encryptedPassword = await EncryptionObject.encrypt(password);
  values = {
    'dataTypes': ['string', 'string', 'string', 'string'],
    'name': name,
    'username': username,
    'password': encryptedPassword,
    'description': description
  }
  await infrastructurePasswordsTable.update(id, values);
}

router.get('/', async function(req, res, next) {

  if (req.query.mode != null) {
    if (req.query.mode == "update") {
      await updateAccounts(req.query.id, req.query.name, req.query.username, req.query.password, req.query.description);
    }
  }

  await getDatabaseInformation(req.query.id);

  res.render('accountInformation', {tabtitle: 'Documentation Software', pagetitle: 'Passwords', search: 'false', topnav: 'none', navSelected: 'passwords', subNavSelected: 'none', data: pageData});
});

module.exports = router;
