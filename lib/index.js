"use strict";

const findValue = require("find-value")
    , setValue = require("set-value")
    , unsetValue = require("unset-value")
    , rJson = require("r-json")
    , fs = require("fs")
    , iterateObject = require("iterate-object")
    ;

class JsonEditor {

    /**
     * JsonEditor
     *
     * @name JsonEditor
     * @function
     * @param {String} path The path to the JSON file.
     * @param {Object} options An object containing the following fields:
     *
     *  - `stringify_width` (Number): The JSON stringify indent width (default: `2`).
     *  - `stringify_fn` (Function): A function used by `JSON.stringify`.
     *  - `autosave` (Boolean): Save the file when setting some data in it.
     *
     * @returns {JsonEditor} The `JsonEditor` instance.
     */
    constructor (path, options) {
        this.options = options = options || {};
        options.stringify_width = options.stringify_width || 2;
        options.stringify_fn = options.stringify_fn || null;
        this.path = path;
        this.data = this.read();
    }

    /**
     * set
     * Set a value in a specific path.
     *
     * @name set
     * @function
     * @param {String} path The object path.
     * @param {Anything} value The value.
     * @returns {JsonEditor} The `JsonEditor` instance.
     */
    set (path, value) {
        if (typeof path === "object") {
            iterateObject(path, (val, n) => {
                setValue(this.data, n, val)
            });
        } else {
            setValue(this.data, path, value);
        }
        if (this.options.autosave) {
            this.save();
        }
        return this;
    }

    /**
     * get
     * Get a value in a specific path.
     *
     * @name get
     * @function
     * @param {String} path
     * @returns {Value} The object path value.
     */
    get (path) {
        if (path) {
            return findValue(this.data, path)
        }
        return this.toObject();
    }

    /**
     * unset
     * Remove a path from a JSON object.
     *
     * @name unset
     * @function
     * @param {String} path The object path.
     * @returns {JsonEditor} The `JsonEditor` instance.
     */
    unset (path) {
        if (typeof path === "object") {
            iterateObject(path, (val, n) => {
                unsetValue(this.data, n)
            });
        } else {
            unsetValue(this.data, path);
        }
        if (this.options.autosave) {
            this.save();
        }
        return this;
    }

    /**
     * read
     * Read the JSON file.
     *
     * @name read
     * @function
     * @param {Function} cb An optional callback function which will turn the function into an asynchronous one.
     * @returns {Object} The object parsed as object or an empty object by default.
     */
    read (cb) {
        if (!cb) {
            try {
                return rJson(this.path);
            } catch (e) {
                return {};
            }
        }
        rJson(this.path, function (err, data) {
            data = err ? {} : data;
            cb(null, data);
        });
    }

    /**
     * write
     * Write the JSON file.
     *
     * @name read
     * @function
     * @param {String} The file content.
     * @param {Function} cb An optional callback function which will turn the function into an asynchronous one.
     * @returns {JsonEditor} The `JsonEditor` instance.
     */
    write (content, cb) {
        if (cb) {
            fs.writeFile(this.path, content, cb);
        } else {
            fs.writeFileSync(this.path, content);
        }
        return this;
    }

    /**
     * save
     * Save the file back to disk.
     *
     * @name save
     * @function
     * @param {Function} cb An optional callback function which will turn the function into an asynchronous one.
     * @returns {JsonEditor} The `JsonEditor` instance.
     */
    save (cb) {
        this.write(JSON.stringify(this.data, this.options.stringify_fn, this.options.stringify_width), cb)
        return this;
    }

    /**
     * toObject
     *
     * @name toObject
     * @function
     * @returns {Object} The data object.
     */
    toObject () {
        return this.data;
    }
}

/**
 * editJsonFile
 * Edit a json file.
 *
 * @name editJsonFile
 * @function
 * @param {String} path The path to the JSON file.
 * @param {Object} options An object containing the following fields:
 * @return {JsonEditor} The `JsonEditor` instance.
 */
module.exports = function editJsonFile (path, options) {
    return new JsonEditor(path, options);
};
