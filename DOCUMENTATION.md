## Documentation

You can see below the API reference of this module.

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

