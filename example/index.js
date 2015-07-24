// Dependencies
var DbMini = require("../lib");

// Create the database
var db = new DbMini("foo");
DbMini.root = __dirname + "/dbs";

// Get the collection
db.collection("foo", function (err, col) {
    if (err) { return console.log(err); }

    // Insert something
    col.insert({
        name: {
            first: "Ionică"
          , last: "Bizău"
        }
      , student: true
    }, function (err, data) {
        if (err) { return console.log(err); }
        var ids = col.find({ student: true });
        col.getById(ids[0], function (err, c) {
            if (err) { return console.log(err); }
            console.log(c);
        });
    });
});
