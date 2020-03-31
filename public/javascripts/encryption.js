var CryptoJS = require("crypto-js");

module.exports = function(tableName, primaryKey) {
  this.returnValue = "";

  this.encrypt = function(string) {
    return new Promise(function(resolve, reject) {
      encryptedText = CryptoJS.AES.encrypt(string, 'L885AjGTCRhBOBPn').toString();
      this.returnValue = encryptedText;
      resolve(this.returnValue);
    });
  }

  this.decrypt = function(string) {
    return new Promise(function(resolve, reject) {
      bytes  = CryptoJS.AES.decrypt(string, 'L885AjGTCRhBOBPn');
      originalText = bytes.toString(CryptoJS.enc.Utf8);
      this.returnValue = originalText;
      resolve(this.returnValue);
    }); 
  }
}


