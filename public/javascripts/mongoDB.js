const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'whiteLightDocumentation';

// Create a new MongoClient
//const client = new MongoClient(url);


/*
// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  findDocuments(db, function() {
    client.close();
  });
});*/

module.exports = function(collection) {
  this.collection = collection;
  this.data = [];

  this.getCollectionName = function() {
    return this.collection;
  }

  this.findAll = function() {
    return new Promise(function(resolve, reject) {
      client = new MongoClient(url);
      client.connect(function(err) {
        const db = client.db(dbName);
  
        workingCollection = db.collection(collection);
        workingCollection.find({}).toArray(function(err, docs) {
          assert.equal(err, null);
          resolve(docs);
        });  
      });
      client.close();  
    });
  }

  this.findWhere = function(criteria) {
    return new Promise(function(resolve, reject) {
      client = new MongoClient(url);
      client.connect(function(err) {
        const db = client.db(dbName);
        
        workingCollection = db.collection(collection);

        workingCollection.find(criteria).toArray(function(err, docs) {
          assert.equal(err, null);
          resolve(docs);
        });
      });
      client.close();
    });
  }

  //Keys - array of data keys
  //Values - array of data values that correspond to keys
  //Types - array of data types (will be ignored if blank array is parsed)
  this.insert = function(keys, values, types) {
    return new Promise(function(resolve, reject) {

      if (types.length == 0) {
        objectToAdd = {};
        for (i=0; i<keys.length; i++) {
          objectToAdd[keys[i]] = values[i];
        }
      } else {
        objectToAdd = {};
        for (i=0; i<keys.length; i++) {
          objectToAdd[keys[i]] = {value: values[i], type: types[i]};
        }
      }

      client = new MongoClient(url);
      client.connect(function(err) {
        const db = client.db(dbName);

        workingCollection = db.collection(collection);
        workingCollection.insertOne(
          objectToAdd
        , function(err, result) {
          assert.equal(err, null);
          resolve([]);
        });
      });
      client.close();
    });
  }

  this.delete = function(criteria) {
    return new Promise(function(resolve, reject) {
      client = new MongoClient(url);
      client.connect(function(err) {
        const db = client.db(dbName);

        workingCollection = db.collection(collection);
        workingCollection.deleteOne(criteria);

        resolve([]);
      });
      client.close();
    });
  }
}

/*
const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
*/

/*
const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('infrastructure');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}*/