var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var mongoConnection = require('../public/javascripts/mongoDB.js');
var router = express.Router();

var infrastructureTable = new sqlConnection('infrastructure', 'infrastructure_id');
var infrastructureCategoryTable = new sqlConnection('infrastructure_category', 'category_id');
var infrastructureGroupTable = new sqlConnection('infrastructure_group', 'group_id');

var mongoInfrastructure = new mongoConnection('infrastructure');

async function getDatabaseInformation(mode, editID) {

  allCategories = await infrastructureCategoryTable.findAll();
  allGroups = await infrastructureGroupTable.findAll();

  categoryList = [];
  for (counter in allCategories) {
    categoryList.push(allCategories[counter]['category_name']);
  }

  groupList = [];
  for (counter in allGroups) {
    groupList.push(allGroups[counter]['group_name']);
  }

  id = "";
  name = "";
  description = "";
  category = "";
  group = "";

  if (mode == "edit") {
    id = editID;

    infrastructureInformation = await infrastructureTable.findAllWhere('infrastructure_id', id);
    
    categoryInformation = await infrastructureCategoryTable.findAllWhere('category_id', infrastructureInformation[0]['category_id']);
    groupInformation = await infrastructureGroupTable.findAllWhere('group_id', infrastructureInformation[0]['group_id']);

    name = infrastructureInformation[0]['infrastructure_name'];
    description = infrastructureInformation[0]['infrastructure_description'];
    category = categoryInformation[0]['category_name'];
    if (groupInformation.length > 0) {
      group = groupInformation[0]['group_name'];
    }
    
  }

  extraInformation = await mongoInfrastructure.findWhere({id : {value:parseInt(id), type:null}});

  technicalInformation = [];
  if (extraInformation.length > 0) {
    tiKeys = Object.keys(extraInformation[0]);
    for (i=0; i<tiKeys.length; i++) {
      if (tiKeys[i] == "_id" || tiKeys[i] == "id") {
        //Pass
      } else {
        technicalInformation.push(
          {
            'informationLabel' : tiKeys[i],
            'fieldType' : extraInformation[0][tiKeys[i]]['type'],
            'fieldValue' : extraInformation[0][tiKeys[i]]['value']
          }
        );
      }
    }
  }


/*
------------Page Data Structure------------
pageData = {
  'mode': *ADD* | *EDIT*
  'databaseInformation': {
    'id': *ID*,
    'name': *NAME*,
    'description': *DESCRIPTION*,
    'category': *CATEGORY*,
    'group': *GROUP*,
    'groups': ['*NAME*'], 
    'categories': ['*NAME*'],
    'technicalInformation': [
      {
        'informationLabel': '*NAME*',
        'fieldType': '*FIELD_TYPE*',
        'fieldValue': '*VALUE*'
      }
    ]
  }
}
-------------------------------------------
*/

  pageData = {
    'mode': mode,
    'databaseInformation': {
      'id': id,
      'name': name,
      'description': description,
      'category': category,
      'group': group,
      'groups': groupList,
      'categories': categoryList,
      'technicalInformation': technicalInformation
    }
  };
}

router.get('/', async function(req, res, next) {
  mode = "add";
  editID = null;
  if (typeof req.query.mode !== 'undefined') {
    if (req.query.mode == "editInfrastructure") {
      mode = "edit"
      editID = req.query.id;
    }
  }

  await getDatabaseInformation(mode, editID);
  res.render('addItem', {tabtitle: 'Documentation Software', pagetitle: 'Add Item', topnav: 'none', search: 'false', navSelected: 'infrastructure', subNavSelected: 'addInfrastructure', data: pageData});
});

module.exports = router;
