var when = require('when');

module.exports = function(db) {
  return {
    count : function() {
      return when.promise(function(resolve, reject, notify) {
        db.collection('notes').count(function(err, count) {
          if (err) reject(err);
          resolve(count);
        });
      });
    }
  };
}
