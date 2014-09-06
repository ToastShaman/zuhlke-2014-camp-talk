var when = require('when');

module.exports = function(db) {
  var notes = 'notes';

  return {
    count : function() {
      return when.promise(function(resolve, reject, notify) {
        db.collection(notes).find({}, function(err, notes) {
          if (err) reject(err);
          resolve(notes);
        });
      });
    }
  };
}
