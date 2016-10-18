"use strict";

const editJsonFile = require("../lib");

// If the file doesn't exist, the content will be an empty object by default.
let file = editJsonFile(`${__dirname}/foo.json`);

// Set a couple of fields
file.set("planet", "Earth");
file.set("name.first", "Johnny");
file.set("name.last", "B.");
file.set("is_student", false);

// Output the content
console.log(file.get());
// { planet: 'Earth',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false } }

// Save the data to the disk
file.save();

// Reload it from the disk
file = editJsonFile(`${__dirname}/foo.json`, {
    autosave: true
});

// Get one field
console.log(file.get("name.first"));
// => Johnny

// This will save it to disk
file.set("a.new.field.as.object", {
    hello: "world"
});

// Output the whole thing
console.log(file.toObject());
// { planet: 'Earth',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false,
//   a: { new: { field: [Object] } } }
