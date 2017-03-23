
# edit-json-file

 [![Support me on Patreon][badge_patreon]][patreon] [![Buy me a book][badge_amazon]][amazon] [![PayPal][badge_paypal_donate]][paypal-donations] [![Version](https://img.shields.io/npm/v/edit-json-file.svg)](https://www.npmjs.com/package/edit-json-file) [![Downloads](https://img.shields.io/npm/dt/edit-json-file.svg)](https://www.npmjs.com/package/edit-json-file)

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

## :question: Get Help

There are few ways to get help:

 1. Please [post questions on Stack Overflow](https://stackoverflow.com/questions/ask). You can open issues with questions, as long you add a link to your Stack Overflow question.
 2. For bug reports and feature requests, open issues. :bug:
 3. For direct and quick help from me, you can [use Codementor](https://www.codementor.io/johnnyb). :rocket:


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


## :sparkling_heart: Support my projects

I open-source almost everything I can, and I try to reply everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

 - Starring and sharing the projects you like :rocket:
 - [![PayPal][badge_paypal]][paypal-donations]—You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
 - [![Support me on Patreon][badge_patreon]][patreon]—Set up a recurring monthly donation and you will get interesting news about what I'm doing (things that I don't share with everyone).
 - **Bitcoin**—You can send me bitcoins at this address (or scanning the code below): `1P9BRsmazNQcuyTxEqveUsnf5CERdq35V6`

    ![](https://i.imgur.com/z6OQI95.png)

Thanks! :heart:


## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`bloggify-tools`](https://github.com/Bloggify/bloggify-tools)—Interactive command line tool to help you win at Bloggify.

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[badge_patreon]: http://ionicabizau.github.io/badges/patreon.svg
[badge_amazon]: http://ionicabizau.github.io/badges/amazon.svg
[badge_paypal]: http://ionicabizau.github.io/badges/paypal.svg
[badge_paypal_donate]: http://ionicabizau.github.io/badges/paypal_donate.svg
[patreon]: https://www.patreon.com/ionicabizau
[amazon]: http://amzn.eu/hRo9sIZ
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(https%3A%2F%2Fionicabizau.net)&year=2016#license-mit
[website]: https://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
