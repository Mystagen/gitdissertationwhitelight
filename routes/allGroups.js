var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var router = express.Router();

var infrastructureGroupTable = new sqlConnection('infrastructure_group', 'group_id');
var infrastructureTable = new sqlConnection('infrastructure', 'infrastructure_id');

async function getDatabaseInformation() {

  if (searchCriteria == "") {
    groupData = await infrastructureGroupTable.findAll('group_name');
  } else {
    groupData = await infrastructureGroupTable.findAllWhereLike('group_name', searchCriteria, 'group_name');
  }
/*
------------Page Data Structure------------
pageData = {
  'groupData': [
    {
      'id': '*ID*'
      'name': '*NAME*', 
      'memberCount': '*MEMBER COUNT*'
    }
  ]
}
-------------------------------------------
*/
  pageData = {
    'groupData': [],
    'searchCriteria': searchCriteria
  };

  for (counter = 0; counter < groupData.length; counter++) {

    infrastructureData = await infrastructureTable.findAllWhere('group_id', groupData[counter]['group_id']);

    pageData['groupData'].push(
      {
        'id': groupData[counter]['group_id'],
        'name': groupData[counter]['group_name'],
        'memberCount': infrastructureData.length
      }
    )
  }
}

async function insertNewGroup(name, description) {

  dataToInsert = {
    'dataTypes': ['string', 'string'],
    'group_name': name,
    'group_description': description
  };

  existingGroups = await infrastructureGroupTable.findAllWhere('group_name', name);

  if (existingGroups.length > 0) {
    return false;
  } else {
    await infrastructureGroupTable.insert(dataToInsert);
    return true;
  }
}

async function deleteGroup(id) {
  partOfGroup = await infrastructureTable.findAllWhere("group_id", id);
  if (partOfGroup.length == 0) {
    await infrastructureGroupTable.delete(id);
    return true;
  } else {
    return false;
  }
}

router.get('/', async function(req, res, next) {
  searchCriteria = "";
  if (typeof req.query.mode !== 'undefined') {
    if (req.query.mode == "addGroup") {
      success = await insertNewGroup(req.query.name, req.query.description);
      if (success == false) {
        return res.redirect('/addGroup?groupAddFailed&mode=amend&name=' + req.query.name + '&description=' + req.query.description);
      }
    } 

    if (req.query.mode == "deleteGroup") {
      result = await deleteGroup(req.query.id);
      if (result == false) {
        return res.redirect('/manageGroup?groupDeleteFailed&groupID=' + req.query.id)
      }
    }

    if (req.query.mode == "addGroupAndReturn") {
      success = await insertNewGroup(req.query.name, req.query.description);
      if (success == false) {
        return res.redirect('/addGroup?groupAddFailed&mode=amendMidAdd&priorLocation='+ req.query.priorLocation + '&previous=' + req.query.previous + '&name=' + req.query.name + '&description=' + req.query.description);
      } else {
        if (req.query.priorLocation == "edit") {
          console.log("a");
          return res.redirect("/addItem?mode=editInfrastructure&id=" + req.query.previous);
        } else {
          console.log("b");
          return res.redirect("/additem");
        }
      }
    }
  }

  if (typeof req.query.searchBarField !== 'undefined') {
    searchCriteria = req.query.searchBarField;
  }

  await getDatabaseInformation(searchCriteria);

  res.render('allGroups', {tabtitle: 'Documentation Software', pagetitle: 'Group Management', search: 'true', topnav: 'none', navSelected: 'infrastructure', subNavSelected: 'manageGroups', data: pageData});
});

module.exports = router;
