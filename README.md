# db-mini [![Support this project][donate-now]][paypal-donations]

## Installation

```sh
$ npm i --save db-mini
```

## Example

```js
// Dependencies
var DbMini = require("db-mini");

// Create the database
var db = new DbMini("foo", {
    root: __dirname + "/dbs"
});

// Get the collection
db.collection("bar", function (err, col) {
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
      , student: false
      , _id: (1001).toString(16)
    }], function (err, data) {
        if (err) { console.log(err); }
        col.find({ lastName: "Smith", student: true }, function (err, docs) {
            console.log(err || docs);
        });
        // var ids = col.find({ student: true });
        // col.getById(ids[0], function (err, c) {
        //     if (err) { return console.log(err); }
        //     console.log(c);
        // });
    });
});
```

## Documentation

### `DbMini(name, options)`

#### Params
- **String** `name`: The database name.
- **Object** `options`: An object which will be merged with the defaults:
 - `root` (String): The database root directory (this will contain the collection directories).
 - `id_length` (Number): The document id length (default: `16`).
 - `id_field` (String): The document id field (default: `"_id"`).
 - `json_indent` (Number): The JSON indent value (default: `2`).

#### Return
- **DbMini** The `DbMini` instance.

### `collection(name, callback)`
Creates a new database collection.

#### Params
- **String** `name`: The collection name.
- **Function** `callback`: The callback function.

#### Return
- **Collection** The `Collection` instance.

### `Collection(name, db)`
Creates a new `Collection` instance.

#### Params
- **String** `name`: The collection name.
- **DbMini** `db`: The `DbMini` instance.

#### Return
- **Collection** The `Collection` instance.

### `getDocumentPath(id)`
Gets the document path by id.

#### Params
- **String** `id`: An optional id (if not provided, a new one will be generated).

#### Return
- **String** The path to the document file.

### `insertOne(doc, callback)`
Inserts a new document in the collection.

#### Params
- **Object** `doc`: The document object.
- **Function** `callback`: The callback function.

#### Return
- **Collection** The `Collection` instance.

### `updateOne(id, doc, callback)`
Updates a document with known id.

#### Params
- **String** `id`: The document id to update.
- **Object** `doc`: The updated object.
- **Function** `callback`: The callback function.

#### Return
- **Collection** The `Collection` instance.

### `findOne(id, callback)`
Finds a document with known id.

#### Params
- **String** `id`: The document id to find.
- **Function** `callback`: The callback function.

#### Return
- **Collection** The `Collection` instance.

### `removeOne(id, callback)`
Removes one document.

#### Params
- **String** `id`: The id of the document to update.
- **Function** `callback`: The callback function.

#### Return
- **Cursor** The `Cursor` instance.

### `insert(doc, callback)`
Inserts one or more documents.

#### Params
- **Array|Object** `doc`: The document(s) to insert.
- **Function** `callback`: The callback function.

#### Return
- **Collection** The `Collection` instance.

### `remove(filters, fn, callback)`
Removes the documents matching the filters.

#### Params
- **Object** `filters`: The filters object which will be passed to the filter function.
- **Function** `fn`: The filter function.
- **Function** `callback`: The callback function.

#### Return
- **Cursor** The `Cursor` instance.

### `getIds(callback)`
Gets the ids of a collection.

#### Params
- **Function** `callback`: The callback function.

#### Return
- **Collection** The `Collection` instance.

### `Cursor(ids, col)`
Creates a new `Cursor` instance.

#### Params
- **Array** `ids`: An array with the document ids.
- **Collection** `col`: The database collection.

#### Return
- **Cursor** The `Cursor` instance.

### `each(callback)`
Iterate the cursor documents.

#### Params
- **Function** `callback`: The callback function.

#### Return
- **Cursor** The `Cursor` instance.

### `builtin(filters, doc)`
The built-in filter.

#### Params
- **Object** `filters`: A `<name>: <value>` filters object.
- **Object** `doc`: The current object.

#### Return
- **Boolean** `true` if the document matches the filters or `false` otherwise.

### `each(filters, fn, callback)`
Iterate the collection documents.

#### Params
- **Object** `filters`: The filters object which will be passed to the filter function.
- **Function** `fn`: The filter function.
- **Function** `callback`: The callback function.

#### Return
- **Cursor** The `Cursor` instance.

### `find(filters, fn, callback)`
Finds the documents matching the filters.

#### Params
- **Object** `filters`: The filters object which will be passed to the filter function.
- **Function** `fn`: The filter function.
- **Function** `callback`: The callback function.

#### Return
- **Cursor** The `Cursor` instance.

### `update(filters, updated, fn, callback)`
Updates the filtered documents.

#### Params
- **Object** `filters`: The filters object which will be passed to the filter function.
- **Object** `updated`: The updated document.
- **Function** `fn`: The filter function.
- **Function** `callback`: The callback function.

#### Return
- **Cursor** The `Cursor` instance.

## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:

## License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2015#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md