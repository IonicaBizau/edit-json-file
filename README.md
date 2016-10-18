
# edit-json-file

 [![Patreon](https://img.shields.io/badge/Support%20me%20on-Patreon-%23e6461a.svg)][patreon] [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Version](https://img.shields.io/npm/v/edit-json-file.svg)](https://www.npmjs.com/package/edit-json-file) [![Downloads](https://img.shields.io/npm/dt/edit-json-file.svg)](https://www.npmjs.com/package/edit-json-file) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> Edit a json file with ease.

## :cloud: Installation

```sh
$ npm i --save edit-json-file
```


## :clipboard: Example



```js
const editJsonFile = require("edit-json-file");

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
//   is_student: false }

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
```

## :memo: Documentation


### `JsonEditor(path, options)`

#### Params
- **String** `path`: The path to the JSON file.
- **Object** `options`: An object containing the following fields:
 - `stringify_width` (Number): The JSON stringify indent width (default: `2`).
 - `stringify_fn` (Function): A function used by `JSON.stringify`.
 - `autosave` (Boolean): Save the file when setting some data in it.

#### Return
- **JsonEditor** The `JsonEditor` instance.

### `set(path, value)`
Set a value in a specific path.

#### Params
- **String** `path`: The object path.
- **Anything** `value`: The value.

#### Return
- **JsonEditor** The `JsonEditor` instance.

### `get(path)`
Get a value in a specific path.

#### Params
- **String** `path`:

#### Return
- **Value** The object path value.

### `read(cb)`
Read the JSON file.

#### Params
- **Function** `cb`: An optional callback function which will turn the function into an asynchronous one.

#### Return
- **Object** The object parsed as object or an empty object by default.

### `read(The, cb)`
write
Write the JSON file.

#### Params
- **String** `The`: file content.
- **Function** `cb`: An optional callback function which will turn the function into an asynchronous one.

#### Return
- **JsonEditor** The `JsonEditor` instance.

### `save(cb)`
Save the file back to disk.

#### Params
- **Function** `cb`: An optional callback function which will turn the function into an asynchronous one.

#### Return
- **JsonEditor** The `JsonEditor` instance.

### `toObject()`

#### Return
- **Object** The data object.

### `editJsonFile(path, options)`
Edit a json file.

#### Params
- **String** `path`: The path to the JSON file.
- **Object** `options`: An object containing the following fields:

#### Return
- **JsonEditor** The `JsonEditor` instance.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :moneybag: Donations

Another way to support the development of my open-source modules is
to [set up a recurring donation, via Patreon][patreon]. :rocket:

[PayPal donations][paypal-donations] are appreciated too! Each dollar helps.

Thanks! :heart:


## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[patreon]: https://www.patreon.com/ionicabizau
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2016#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
