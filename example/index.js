"use strict";

const editJsonFile = require("../lib");

// If the file doesn't exist, the content will be an empty object by default.
let file = editJsonFile(`${__dirname}/foo.json`);

// Set a couple of fields
file.set("planet", "Earth");
file.set("city\\.name", "anytown");
file.set("name.first", "Johnny");
file.set("name.last", "B.");
file.set("is_student", false);
//Create or append to an array
file.append("classes", "fysics");
//You can even append objects
file.append("classes", { class: "Computer Science", where: "KULeuven" });


// Output the content
console.log(file.get());
// { planet: 'Earth', 
//   city.name: 'anytown',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false,
//   classes: [
//     'fysics',
//     {
//       'class': 'Computer Science',
//       'where': 'KULeuven'
//     }
//   ]
// }

//if you want to remove the last element from an array use pop 
file.pop("classes")

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
