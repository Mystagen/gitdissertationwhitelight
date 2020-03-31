var express = require('express');
var sqlConnection = require('../public/javascripts/connection.js');
var router = express.Router();

var infrastructureCategoryTable = new sqlConnection('infrastructure_category', 'category_id');
var infrastructureTable = new sqlConnection('infrastructure', 'infrastructure_id');

async function getDatabaseInformation() {

  if (searchCriteria == "") {
    categoryData = await infrastructureCategoryTable.findAll('category_name');
  } else {
    categoryData = await infrastructureCategoryTable.findAllWhereLike('category_name', searchCriteria, 'category_name');
  }

/*
------------Page Data Structure------------
pageData = {
  'categoryData': [
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
    'categoryData': [],
    'searchCriteria': searchCriteria
  };

  for (counter = 0; counter < categoryData.length; counter++) {

    infrastructureData = await infrastructureTable.findAllWhere('category_id', categoryData[counter]['category_id']);

    pageData['categoryData'].push(
      {
        'id': categoryData[counter]['category_id'],
        'name': categoryData[counter]['category_name'],
        'memberCount': infrastructureData.length
      }
    )
  }
}

async function insertNewCategory(name, description) {

  dataToInsert = {
    'dataTypes': ['string', 'string'],
    'category_name': name,
    'category_description': description
  };

  existingCategories = await infrastructureCategoryTable.findAllWhere('category_name', name);

  if (existingCategories.length > 0) {
    return false;
  } else {
    await infrastructureCategoryTable.insert(dataToInsert);
    return true;
  }
}

async function deleteCategory(id) {
  partOfCategory = await infrastructureTable.findAllWhere("category_id", id);
  if (partOfCategory.length == 0) {
    await infrastructureCategoryTable.delete(id);
    return true;
  } else {
    return false;
  }
}

router.get('/', async function(req, res, next) {
  searchCriteria = "";
  if (typeof req.query.mode !== 'undefined') {
    if (req.query.mode == "addCategory") {
      success = await insertNewCategory(req.query.name, req.query.description);
      if (success == false) {
        return res.redirect('/addCategory?categoryAddFailed&mode=amend&name=' + req.query.name + '&description=' + req.query.description);
      }
    } 

    if (req.query.mode == "deleteCategory") {
      result = await deleteCategory(req.query.id);
      if (result == false) {
        return res.redirect('/manageCategory?categoryDeleteFailed&categoryID=' + req.query.id)
      }
    }

    if (req.query.mode == "addCategoryAndReturn") {
      success = await insertNewCategory(req.query.name, req.query.description);
      if (success == false) {
        return res.redirect('/addCategory?categoryAddFailed&mode=amendMidAdd&priorLocation='+ req.query.priorLocation + '&previous=' + req.query.previous +'&name=' + req.query.name + '&description=' + req.query.description);
      } else {
        if (req.query.priorLocation == "edit") {
          return res.redirect("/addItem?mode=editInfrastructure&id=" + req.query.previous);
        } else {
          return res.redirect("/additem");
        }
      }
    }
  }

  if (typeof req.query.searchBarField !== 'undefined') {
    searchCriteria = req.query.searchBarField;
  }

  await getDatabaseInformation(searchCriteria);

  res.render('allCategories', {tabtitle: 'Documentation Software', pagetitle: 'Category Management', search: 'true', topnav: 'none', navSelected: 'infrastructure', subNavSelected: 'manageCategories', data: pageData});
});

module.exports = router;
