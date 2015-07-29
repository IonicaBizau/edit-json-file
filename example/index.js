// Dependencies
var DbMini = require("../lib");

// Create the database
var db = new DbMini("foo");
DbMini.root = __dirname + "/dbs";

// Get the collection
db.collection("foo", function (err, col) {
    if (err) { return console.log(err); }

    // Insert something
    col.insert([{
        firstName: "Alice"
      , lastName: "Smith"
      , student: true
      , _id: (1000).toString(16)
    }, {
        firstName: "Bob"
      , lastName: "Smith"
      , student: true
      , _id: (1001).toString(16)
    }], function (err, data) {
        if (err) { console.log(err); }
        col.find(function (err, docs) {
            console.log(err || docs);
        });
    });
});
