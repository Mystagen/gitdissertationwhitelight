var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var mongoConnection = require('../public/javascripts/mongoDB.js');
var router = express.Router();

var infrastructureTable = new sqlConnection('infrastructure', 'infrastructure_id');
var infrastructureCategoryTable = new sqlConnection('infrastructure_category', 'category_id');
var infrastructureGroupTable = new sqlConnection('infrastructure_group', 'group_id');

var mongoInfrastructure = new mongoConnection('infrastructure');

async function getDatabaseInformation(infrastructureID) {

  infrastructure = await infrastructureTable.findAllWhere('infrastructure_id', infrastructureID);
  infrastructure = infrastructure[0];
  extraInformation = await mongoInfrastructure.findWhere({id : {value:parseInt(infrastructureID), type:null}});
  category = await infrastructureCategoryTable.findAllWhere('category_id', infrastructure['category_id']);
  category = category[0];
  if (infrastructure['group_id'] != null) {
    group = await infrastructureGroupTable.findAllWhere('group_id', infrastructure['group_id']);
    groupName = group[0]['group_name'];
  } else {
    groupName = "No Group";
  }

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
  'infrastructureData': {
    'name': '*NAME*', 
    'category': '*NAME*',
    'group': '*NAME*',
    'description': '*DESCRIPTION*',
    'files': [
      {
        'fileName': '*NAME*',
        'filePath': '*PATH*'
      }
    ],
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
    'infrastructureInformation': {
      'name': infrastructure['infrastructure_name'],
      'id': infrastructure['infrastructure_id'],
      'category': category['category_name'],
      'group': groupName,
      'description': infrastructure['infrastructure_description'],
      'files': [],
      'technicalInformation': technicalInformation
    }
  };
}

async function updateDatabase(id, name, category, description, group, extraDataKeys, extraDataValues, extraDataDataTypes) {
  //Get Category ID
  category = await infrastructureCategoryTable.findAllWhere('category_name', category);
  categoryID = category[0]['category_id'];

  //Get Group ID (if in group)
  group = await infrastructureGroupTable.findAllWhere('group_name', group);

  if (group.length >= 1) {
    groupID = group[0]['group_id'];
  } else {
    groupID = null;
  }  

  //Save to file

  dataToInsert = {
    'dataTypes': ['string', 'int', 'int', 'string'],
    'infrastructure_name': name,
    'group_id': groupID,
    'category_id': categoryID,
    'infrastructure_description': description
  }

  await infrastructureTable.update(id, dataToInsert);

  await mongoInfrastructure.delete({'id' : {'value':parseInt(id), 'type':null}});

  extraDataKeys.push("id");
  extraDataValues.push(parseInt(id));
  await mongoInfrastructure.insert(extraDataKeys, extraDataValues, extraDataDataTypes);
}

router.get('/', async function(req, res, next) {

  if (typeof req.query.mode !== 'undefined') {
    if (req.query.mode == "updateInfrastructure") {
      arrayFormExtraData = req.query.extraData.split(",");
      extraDataDataTypes = req.query.extraDataDataTypes.split(",");
      extraDataKeys = [];
      extraDataValues = [];
      for (i=0; i<arrayFormExtraData.length/2; i++) {
        extraDataKeys.push(arrayFormExtraData[i]);
        extraDataValues.push(arrayFormExtraData[i + (arrayFormExtraData.length/2)]);
      }
      await updateDatabase(req.query.infrastructureID, req.query.name, req.query.category, req.query.description, req.query.group, extraDataKeys, extraDataValues, extraDataDataTypes);
    }
  }

  await getDatabaseInformation(req.query.infrastructureID);
  res.render('infrastructureInformation', {tabtitle: 'Documentation Software', pagetitle: 'Infrastructure', search: 'false', topnav: 'none', navSelected: 'infrastructure', subNavSelected: 'index', data: pageData});
});

module.exports = router;
