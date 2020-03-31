var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var mongoConnection = require('../public/javascripts/mongoDB.js');
var router = express.Router();

var infrastructureTable = new sqlConnection('infrastructure', 'infrastructure_id');
var infrastructureCategoryTable = new sqlConnection('infrastructure_category', 'category_id');
var infrastructureGroupTable = new sqlConnection('infrastructure_group', 'group_id');

var mongoInfrastructure = new mongoConnection('infrastructure');

async function getDatabaseInformation(searchCriteria) {
  if (searchCriteria == "") {
    infrastructure = await infrastructureTable.findAll('infrastructure_name');
  } else {
    infrastructure = await infrastructureTable.findAllWhereLike('infrastructure_name', searchCriteria, 'infrastructure_name');
  }
  categoryIDs = [];
  for (counter = 0; counter < infrastructure.length; counter++) {
    if (!(categoryIDs.includes(infrastructure[counter]['category_id']))) {
      categoryIDs.push(infrastructure[counter]['category_id']);
    }
  }

  categories = []

  for (counter = 0; counter < categoryIDs.length; counter++) {
    categoryRecord = await infrastructureCategoryTable.findAllWhere('category_id', categoryIDs[counter]);
    categories.push(categoryRecord[0]);  
  }

  groups = await infrastructureGroupTable.findAll();

/*
------------Page Data Structure------------
pageData = {
  'infrastructureCategory': [
    {
      'categoryName': '*NAME*', 
      'categoryID': '*ID*',
      'infrastructure': []
    }
  ],
  'groupCategory': [
    {
      'groupName': '*NAME*',
      'groupID': ' *ID*',
      'infrastructure': []
    }
  ]
}
-------------------------------------------
*/
  pageData = {
    'infrastructureCategory': [],
    'groupCategory': [],
    'searchCriteria': searchCriteria
  };

  //Populate Infrastructure Category
  for (counter = 0; counter < categories.length; counter++) {
    infrastructureTempList = [];
    for (counter2 = 0; counter2 < infrastructure.length; counter2++) {
      if (categories[counter]['category_id'] == infrastructure[counter2]['category_id']) {
        if (infrastructure[counter2]['group_id'] != null) {
          for (i = 0; i < groups.length; i++) {
            if (groups[i]['group_id'] == infrastructure[counter2]['group_id']) {
              infrastructureTempList.push([infrastructure[counter2]['infrastructure_name'], groups[i]['group_name'], infrastructure[counter2]['infrastructure_id']]);
            }
          }
        } else {
          infrastructureTempList.push([infrastructure[counter2]['infrastructure_name'], infrastructure[counter2]['group_id'], infrastructure[counter2]['infrastructure_id']]);
        }
      }
    }
    pageData['infrastructureCategory'].push({'categoryName': categories[counter]['category_name'], 'categoryID': categories[counter]['category_id'], 'infrastructure': infrastructureTempList});
  }

  //Populate Group Category
  groupTempList = [];
  for (counter = 0; counter < infrastructure.length; counter++) {
    if (!(groupTempList.includes(infrastructure[counter]['group_id']))) {
      groupTempList.push(infrastructure[counter]['group_id']);
    }
  }
  for (counter = groupTempList.length-1; counter >= 0; counter--) {
    groupInfrastructureTempList = [];
    for (counter2 = 0; counter2 < infrastructure.length; counter2++) {
      if (infrastructure[counter2]['group_id'] == groupTempList[counter]) {
        currentCategory = "TEMP";
        for (i = 0; i < categories.length; i++) {
          if (infrastructure[counter2]['category_id'] == categories[i]['category_id']) {
            currentCategory = categories[i]['category_name'];
          }
        }
        groupInfrastructureTempList.push([infrastructure[counter2]['infrastructure_name'], currentCategory, infrastructure[counter2]['infrastructure_id']]);
      }
    }
    if (groupTempList[counter] == null) {
      pageData['groupCategory'].push({'groupName': "No Group", 'infrastructure': groupInfrastructureTempList});
    } else {
      groupInformation = await infrastructureGroupTable.findAllWhere('group_id', groupTempList[counter]);
      pageData['groupCategory'].push({'groupName': groupInformation[0]['group_name'], 'groupID': groupTempList[counter], 'infrastructure': groupInfrastructureTempList});
    }
  }
}

async function insertNewInfrastructure(name, category, description, group, extraDataKeys, extraDataValues, extraDataDataTypes) {
  
  categoryEntered = await infrastructureCategoryTable.findAllWhere('category_name', category);
  groupEntered = null;

  if (group != "No Group") {
    groupEntered = await infrastructureGroupTable.findAllWhere('group_name', group);
  }
  
  if (groupEntered == null) {
    dataToInsert = {
      'dataTypes': ['string', 'int', 'string'],
      'infrastructure_name': name,
      'category_id': categoryEntered[0]['category_id'],
      'infrastructure_description': description
    };
  } else {
    dataToInsert = {
      'dataTypes': ['string', 'int', 'int', 'string'],
      'infrastructure_name': name,
      'group_id': groupEntered[0]['group_id'],
      'category_id': categoryEntered[0]['category_id'],
      'infrastructure_description': description
    };
  }
  id = await infrastructureTable.insert(dataToInsert);
  extraDataKeys.push("id");
  extraDataValues.push(id);
  await mongoInfrastructure.insert(extraDataKeys, extraDataValues, extraDataDataTypes);
}

async function deleteExistingInfrastructure(id) {
  await infrastructureTable.delete(id);
  await mongoInfrastructure.delete({'id' : {'value':parseInt(id), 'type':null}});
}

router.get('/', async function(req, res, next) {
  searchCriteria = "";
  if (typeof req.query.mode !== 'undefined') {
    if (req.query.mode == "addInfrastructure") {
      arrayFormExtraData = req.query.extraData.split(",");
      extraDataDataTypes = req.query.extraDataDataTypes.split(",");
      extraDataKeys = [];
      extraDataValues = [];
      for (i=0; i<arrayFormExtraData.length/2; i++) {
        extraDataKeys.push(arrayFormExtraData[i]);
        extraDataValues.push(arrayFormExtraData[i + (arrayFormExtraData.length/2)]);
      }
      await insertNewInfrastructure(req.query.name, req.query.category, req.query.description, req.query.group, extraDataKeys, extraDataValues, extraDataDataTypes);
    }

    if (req.query.mode == "deleteInfrastructure") {
      await deleteExistingInfrastructure(req.query.id);
    }
  }

  if (typeof req.query.searchBarField !== 'undefined') {
    searchCriteria = req.query.searchBarField;
  }

  await getDatabaseInformation(searchCriteria);
  res.render('index', {tabtitle: 'Documentation Software', pagetitle: 'Infrastructure', search: 'true', topnav: 'index', navSelected: 'infrastructure', subNavSelected: 'index', data: pageData});
});


module.exports = router;
