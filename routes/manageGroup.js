var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var router = express.Router();

var infrastructureTable = new sqlConnection('infrastructure', 'infrastructure_id');
var infrastructureCategoryTable = new sqlConnection('infrastructure_category', 'category_id');
var infrastructureGroupTable = new sqlConnection('infrastructure_group', 'group_id');

async function getDatabaseInformation(groupID) {

  group = await infrastructureGroupTable.findAllWhere('group_id', groupID);

  infrastructureNullSet = await infrastructureTable.findAllWhereNull('group_id');
  infrastructureSet = await infrastructureTable.findAllWhere('group_id', groupID);
  infrastructureCategorySet = await infrastructureCategoryTable.findAll();

  inGroupSet = [];
  noGroupSet = [];

  for (i=0; i<infrastructureNullSet.length; i++) {
    categoryName = "";
    for (c=0; c<infrastructureCategorySet.length; c++) {
      if (infrastructureNullSet[i]['category_id'] == infrastructureCategorySet[c]['category_id']) {
        categoryName = infrastructureCategorySet[c]['category_name'];
      }
    }
    noGroupSet.push({
      'infrastructure_id': infrastructureNullSet[i]['infrastructure_id'],
      'infrastructure_name': infrastructureNullSet[i]['infrastructure_name'],
      'category_name': categoryName
    });
  }

  for (i=0; i<infrastructureSet.length; i++) {
    categoryName = "";
    for (c=0; c<infrastructureCategorySet.length; c++) {
      if (infrastructureSet[i]['category_id'] == infrastructureCategorySet[c]['category_id']) {
        categoryName = infrastructureCategorySet[c]['category_name'];
      }
    }
    inGroupSet.push({
      'infrastructure_id': infrastructureSet[i]['infrastructure_id'],
      'infrastructure_name': infrastructureSet[i]['infrastructure_name'],
      'category_name': categoryName
    });
  }

/*
------------Page Data Structure------------
pageData = {
  'groupInformation': {
    'id': '*ID*', 
    'name': '*NAME*',
    'description': '*DESCRIPTION*',
    'infrastructureInGroup' : [],
  }
}
-------------------------------------------
*/
  pageData = {
    'groupInformation': {
      'id': group[0]['group_id'],
      'name': group[0]['group_name'],
      'description': group[0]['group_description'],
      'infrastructureInGroup': inGroupSet,
      'infrastructureNotInAGroup': noGroupSet
    }
  };
}

async function updateDatabase(id, name, description) {

  //Save to file
  dataToInsert = {
    'dataTypes': ['string', 'string'],
    'group_name': name,
    'group_description': description
  }

  await infrastructureGroupTable.update(id, dataToInsert);
}

async function addItem(groupID, itemID) {

  dataToInsert = {
    'dataTypes': ['int'],
    'group_id': groupID
  }

  await infrastructureTable.update(itemID, dataToInsert);
}

async function removeItem(groupID, itemID) {
  
  dataToInsert = {
    'dataTypes': ['int'],
    'group_id': null
  }

  await infrastructureTable.update(itemID, dataToInsert);
}

router.get('/', async function(req, res, next) {

  if (typeof req.query.mode !== 'undefined') {
    if (req.query.mode == "updateGroup") {
      await updateDatabase(req.query.groupID, req.query.name, req.query.description);
    }

    if (req.query.mode == "add") {
      await addItem(req.query.groupID, req.query.itemID);
    }

    if (req.query.mode == "remove") {
      await removeItem(req.query.groupID, req.query.itemID);
    }
  }

  await getDatabaseInformation(req.query.groupID);
  res.render('manageGroup', {tabtitle: 'Documentation Software', pagetitle: 'Manage Groups', search: 'false', topnav: 'none', navSelected: 'infrastructure', subNavSelected: 'manageGroups', data: pageData});
});

module.exports = router;

