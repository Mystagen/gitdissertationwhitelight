var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var router = express.Router();

var infrastructureTable = new sqlConnection('infrastructure', 'infrastructure_id');
var infrastructureCategoryTable = new sqlConnection('infrastructure_category', 'category_id');
var infrastructureGroupTable = new sqlConnection('infrastructure_group', 'group_id');

async function getDatabaseInformation(categoryID) {

  category = await infrastructureCategoryTable.findAllWhere('category_id', categoryID);

/*
------------Page Data Structure------------
pageData = {
  'categoryInformation': {
    'id': '*ID*', 
    'name': '*NAME*',
    'description': '*DESCRIPTION*',
  }
}
-------------------------------------------
*/
  pageData = {
    'categoryInformation': {
      'id': category[0]['category_id'],
      'name': category[0]['category_name'],
      'description': category[0]['category_description']
    }
  };

}

async function updateDatabase(id, name, description) {

  //Save to file
  dataToInsert = {
    'dataTypes': ['string', 'string'],
    'category_name': name,
    'category_description': description
  }

  await infrastructureCategoryTable.update(id, dataToInsert);
}

router.get('/', async function(req, res, next) {

  if (typeof req.query.mode !== 'undefined') {
    if (req.query.mode == "updateCategory") {
      await updateDatabase(req.query.categoryID, req.query.name, req.query.description);
    }
  }

  await getDatabaseInformation(req.query.categoryID);
  res.render('manageCategory', {tabtitle: 'Documentation Software', pagetitle: 'Manage Category', search: 'false', topnav: 'none', navSelected: 'infrastructure', subNavSelected: 'manageCategories', data: pageData});
});

module.exports = router;

