var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var router = express.Router();

var infrastructureGroupTable = new sqlConnection('infrastructure_group', 'group_id');

async function getDatabaseInformation(mode, editID, req) {

  id = "";
  name = "";
  description = "";

  if (mode == "edit") {
    id = editID;

    groupInformation = await infrastructureGroupTable.findAllWhere('group_id', id);
    
    name = groupInformation[0]['group_name'];
    description = groupInformation[0]['group_description'];
    
  } else if (mode == "amend") {
    name = req.query.name;
    description = req.query.description;
  } else if (mode == "amendMidAdd") {
    name = req.query.name;
    description = req.query.description;
    id = req.query.previous;
  } else if (mode == "quickAdd") {
    id = req.query.previous;
  }


/*
------------Page Data Structure------------
pageData = {
  'mode': *ADD* | *EDIT*
  'databaseInformation': {
    'id': *ID*,
    'name': *NAME*,
    'description': *DESCRIPTION*
}
-------------------------------------------
*/

  pageData = {
    'mode': mode,
    'databaseInformation': {
      'id': id,
      'name': name,
      'description': description
    }
  };
}

router.get('/', async function(req, res, next) {
  mode = "add";
  editID = null;
  if (typeof req.query.mode !== 'undefined') {
    if (req.query.mode == "editGroup") {
      mode = "edit";
      editID = req.query.id;
    }
    if (req.query.mode == "amend") {
      mode = "amend";
    } 
    if(req.query.mode == "midAdd") {
      mode = "quickAdd";
    }
    if(req.query.mode == "amendMidAdd") {
      mode = "amendMidAdd";
    }
  }

  await getDatabaseInformation(mode, editID, req);
  res.render('addGroup', {tabtitle: 'Documentation Software', pagetitle: 'Add Group', search: 'false', topnav: 'none', navSelected: 'infrastructure', subNavSelected: 'addGroup', data: pageData});
});

module.exports = router;
