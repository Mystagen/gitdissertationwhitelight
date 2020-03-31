var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var encryption = require('../public/javascripts/encryption.js');
var router = express.Router();

var infrastructureAccountsTable = new sqlConnection('infrastructure_passwords', 'account_id');

var EncryptionObject = new encryption();

async function getDatabaseInformation(req) {
  searchCriteria = "";

  if (req.query.search == null) {
    allAccounts = await infrastructureAccountsTable.findAll('name', 'name');
  } else {
    allAccounts = await infrastructureAccountsTable.findAllWhereLike('name', req.query.searchBarField, 'name');
    searchCriteria = req.query.searchBarField;
  }

/*
------------Page Data Structure------------
pageData = {
  'accountInformation': {
    'id': '*ID*', 
    'name': '*NAME*',
    'username': '*USERNAME*'
  }
}
-------------------------------------------
*/
  pageData = {
    'groupInformation': [],
    'searchCriteria': searchCriteria
  };

  for (i = 0; i < allAccounts.length; i++) {
    pageData['groupInformation'].push(
      {
        'id': allAccounts[i]['account_id'],
        'name': allAccounts[i]['name'],
        'username': allAccounts[i]['username']
      }
    )
  }
}

async function addAccount(username, password, description, accountName) {
  //encrypt password
  encryptedText = await EncryptionObject.encrypt(password);

  dataToInsert = {
    'dataTypes': ['string', 'string', 'string', 'string'],
    'username': username,
    'password': encryptedText,
    'description': description,
    'name': accountName
  };

  await infrastructureAccountsTable.insert(dataToInsert);
  console.log(encryptedText);
}

async function deleteAccount(id) {
  await infrastructureAccountsTable.delete(id);
}

router.get('/', async function(req, res, next) {

  mode = "add";
  editID = null;
  if (typeof req.query.mode !== 'undefined') {
    if (req.query.mode == "addAccount") {
      await addAccount(req.query.username, req.query.password, req.query.description, req.query.name);
    } else if (req.query.mode == "delete") {
      await deleteAccount(req.query.id)
    }
  }
  await getDatabaseInformation(req);
  res.render('passwords', {tabtitle: 'Documentation Software', pagetitle: 'Passwords', search: 'true', topnav: 'none', navSelected: 'passwords', subNavSelected: 'none', data: pageData});
});

module.exports = router;
