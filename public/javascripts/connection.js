var sql = require ('mssql');

var sqlconfig = {
  user: 'documentationClient',
  password: 'whitelight',
  server: 'DESKTOP-5IJMDU5', 
  database: 'DocumentationDB',
  port: 1433
};

module.exports = function(tableName, primaryKey) {
  this.tableName = tableName;
  this.primaryKey = primaryKey;
  this.data = [];

  this.getTableName = function() {
    return this.tableName;
  }

  this.findAll = function(sortBy) {
    return new Promise(function(resolve, reject) {
      sql.connect(sqlconfig, function (err) {
        
        if (err) {
          console.log(err);
        } 
      
        var request = new sql.Request();
        
        if (sortBy == null) {
          queryString = 'SELECT * FROM ' + tableName
        } else {
          queryString = 'SELECT * FROM ' + tableName + ' ORDER BY ' + sortBy + ' ASC'
        }

        request.query(queryString, function (err, recordset) {
        
          sql.close();
          
          if (err) console.log(err);
          data = [];
          for (i=0; i<recordset['recordset'].length; i++) {
            this.data.push(recordset['recordset'][i]);
          }
          resolve(this.data);
        });
      });
    });
  }

  this.findAllWhereNull = function(field) {
    return new Promise(function(resolve, reject) {
      sql.connect(sqlconfig, function (err) {

        if (err) {
          console.log(err);
        }

        var request = new sql.Request();
        queryString = 'SELECT * FROM ' + tableName + ' WHERE ' + field + ' IS NULL';

        request.query(queryString, function (err, recordset) {
          sql.close();

          if (err) console.log(err);
          data = [];
          for (i=0; i<recordset['recordset'].length; i++) {
            this.data.push(recordset['recordset'][i]);
          }
          resolve(this.data);
        });
      });
    });
  }

  this.findAllWhere = function(field, criteria, sortBy) {
    return new Promise(function(resolve, reject) {
      sql.connect(sqlconfig, function (err) {

        if (err) {
          console.log(err);
        }
        
        var request = new sql.Request();
        if (sortBy == null) {
          if (typeof criteria === "string") {
            queryString = 'SELECT * FROM ' + tableName + ' WHERE ' + field + ' = \'' + criteria + '\''
          } else {
            queryString = 'SELECT * FROM ' + tableName + ' WHERE ' + field + ' = ' + criteria
          };
        } else {
          if (typeof criteria === "string") {
            queryString = 'SELECT * FROM ' + tableName + ' WHERE ' + field + ' = \'' + criteria + '\' ORDER BY ' + sortBy + ' ASC'
          } else {
            queryString = 'SELECT * FROM ' + tableName + ' WHERE ' + field + ' = ' + criteria + ' ORDER BY ' + sortBy + ' ASC'
          };
        }

        request.query(queryString, function (err, recordset) {
          sql.close();

          if (err) console.log(err);
          data = [];
          for (i=0; i<recordset['recordset'].length; i++) {
            this.data.push(recordset['recordset'][i]);
          }
          resolve(this.data);
        });
      });
    });
  }

  this.findAllWhereLike = function(field, likeCriteria, sortBy) {
    return new Promise(function(resolve, reject) {
      sql.connect(sqlconfig, function (err) {
        
        if (err) {
          console.log(err);
        } 
      
        var request = new sql.Request();
        
        if (sortBy == null) {
          queryString = 'SELECT * FROM ' + tableName + ' WHERE ' + field + ' LIKE \'%' + likeCriteria + '%\''
        } else {
          queryString = 'SELECT * FROM ' + tableName + ' WHERE ' + field + ' LIKE \'%' + likeCriteria + '%\' ORDER BY ' + sortBy + ' ASC'
        }
        
        request.query(queryString, function (err, recordset) {
        
          sql.close();
          
          if (err) console.log(err);
          data = [];
          for (i=0; i<recordset['recordset'].length; i++) {
            this.data.push(recordset['recordset'][i]);
          }
          resolve(this.data);
        });
      });
    });
  }

  //Takes a key array of structure {fieldname: value} with the first entry being the data types:
  /*
  dataToInsert = {
    'dataTypes': ['string', 'int', 'int'],
    'infrastructure_name': name,
    'group_id': groupEntered[0]['group_id'],
    'category_id': categoryEntered[0]['category_id']
  };
  */
  this.insert = function(values) {
    return new Promise(function(resolve, reject) {
      sql.connect(sqlconfig, function (err) {

        if (err) {
          console.log(err);
        }

        var request = new sql.Request();

        //Get all field names and values in a string
        fieldNameArray = Object.keys(values)
        fieldNames = "";
        valueToEnter = "";

        for (i = 1; i < fieldNameArray.length; i++) {
          fieldNames += fieldNameArray[i];
          if (values['dataTypes'][i-1] == 'string') {
            valueToEnter += "'" + values[fieldNameArray[i]] + "'";
          } else {  
            valueToEnter += values[fieldNameArray[i]];
          }
          if (i < fieldNameArray.length - 1) {
            fieldNames += ', ';
            valueToEnter += ', ';
          }
        }

        request.query("INSERT INTO " + tableName + " (" + fieldNames + ") VALUES (" + valueToEnter + "); SELECT SCOPE_IDENTITY() as id", function(err, recordset) {
          sql.close();

          if (err) console.log(err);
          data=recordset.recordset[0].id
          resolve(this.data);
        });
      });
    });
  }

  this.delete = function(id) {
    return new Promise(function(resolve, reject) {
      sql.connect(sqlconfig, function (err) {

        if (err) {
          console.log(err);
        }

        var request = new sql.Request();

        request.query("DELETE FROM " + tableName + " WHERE " + primaryKey + " = " + id + ";", function(err, recordset) {
          sql.close();

          if (err) console.log(err);
          data=[];
          resolve(this.data);
        });
      });
    }); 
  }
  
  //Takes a key array of structure {fieldname: value} with the first entry being the data types:
  /*
  dataToInsert = {
    'dataTypes': ['string', 'int', 'int'],
    'infrastructure_name': name,
    'group_id': groupEntered[0]['group_id'],
    'category_id': categoryEntered[0]['category_id']
  };
  */
  this.update = function(id, values) {
    return new Promise(function(resolve, reject) {
      sql.connect(sqlconfig, function (err) {

        if (err) {
          console.log(err);
        }

        var request = new sql.Request();

        //Get all field names and values in a string
        fieldNameArray = Object.keys(values)
        finalString = "";

        for (i = 1; i < fieldNameArray.length; i++) {
          fieldName = fieldNameArray[i];
          if (values['dataTypes'][i-1] == 'string') {
            valueToEnter = "'" + values[fieldNameArray[i]] + "'";
          } else {  
            valueToEnter = values[fieldNameArray[i]];
          }
          if (i < fieldNameArray.length - 1) {
            finalString += fieldName + " = " + valueToEnter + ", ";
          } else {
            finalString += fieldName + " = " + valueToEnter
          }
        }
        request.query("UPDATE " + tableName + " SET " + finalString + " WHERE " + primaryKey + " = " + id + ";", function(err, recordset) {
          sql.close();

          if (err) console.log(err);
          data=[];
          resolve(this.data);
        });
      });
    });
  }
}