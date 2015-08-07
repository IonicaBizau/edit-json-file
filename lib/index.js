// Dependencies
var Mkdirp = require("mkdirp")
  , Id = require("idy")
  , WriteJson = require("w-json")
  , ReadJson = require("r-json")
  , Fs = require("fs")
  , IsThere = require("is-there")
  , OneByOne = require("one-by-one")
  , SameTime = require("same-time")
  , Typpy = require("typpy")
  , Ul = require("ul")
  , IterateObject = require("iterate-object")
  ;

/**
 * DbMini
 *
 * @name DbMini
 * @function
 * @param {String} name The database name.
 * @param {Object} options An object which will be merged with the defaults:
 *
 *  - `root` (String): The database root directory (this will contain the collection directories).
 *  - `id_length` (Number): The document id length (default: `16`).
 *  - `id_field` (String): The document id field (default: `"_id"`).
 *  - `json_indent` (Number): The JSON indent value (default: `2`).
 *
 * @return {DbMini} The `DbMini` instance.
 */
function DbMini(name, options) {
    var self = this;
    options = Ul.merge(options, DbMini.defaults);
    IterateObject(options, function (f, v) {
        self[f] = v;
    });
    self.name = name;
}

/**
 * collection
 * Creates a new database collection.
 *
 * @name collection
 * @function
 * @param {String} name The collection name.
 * @param {Function} callback The callback function.
 * @return {Collection} The `Collection` instance.
 */
DbMini.prototype.collection = function (name, callback) {
    var col = new DbMini.Collection(name, this);
    Mkdirp(col.path, function (err) {
        callback(err, col);
    });
    return col
};

/**
 * Collection
 * Creates a new `Collection` instance.
 *
 * @name Collection
 * @function
 * @param {String} name The collection name.
 * @param {DbMini} db The `DbMini` instance.
 * @return {Collection} The `Collection` instance.
 */
DbMini.Collection = function Collection (name, db) {
    var self = this;
    self.name = name;
    self.db = db;
    self.path = (db.root ? db.root + "/" : "") + db.name + "/" + name
};

/**
 * getDocumentPath
 * Gets the document path by id.
 *
 * @name getDocumentPath
 * @function
 * @param {String|undefined} id An optional id (if not provided, a new one will be generated).
 * @return {String} The path to the document file.
 */
DbMini.Collection.prototype.getDocumentPath = function (id) {
    return this.path + "/" + (id ? id : Id(this.db.id_length));
};

/**
 * insertOne
 * Inserts a new document in the collection.
 *
 * @name insertOne
 * @function
 * @param {Object} doc The document object.
 * @param {Function} callback The callback function.
 * @return {Collection} The `Collection` instance.
 */
DbMini.Collection.prototype.insertOne = function (doc, callback) {

    var self = this
      , id = doc[self.db.id_field]
      , path = null
      ;

    if (!id) {
        doc[self.db.id_field] = id = Id();
    }

    path = self.getDocumentPath(id);
    IsThere(path, function (exists) {
        if (exists) {
            return callback(new Error("Duplicated id: " + id + ". Ids must be unique."));
        }
        WriteJson(path, doc, self.db.json_indent, function (err) {
            callback(err, doc);
        });
    });

    return self;
};

/**
 * updateOne
 * Updates a document with known id.
 *
 * @name updateOne
 * @function
 * @param {String} id The document id to update.
 * @param {Object} doc The updated object.
 * @param {Function} callback The callback function.
 * @return {Collection} The `Collection` instance.
 */
DbMini.Collection.prototype.updateOne = function (id, doc, callback) {

    var self = this
      , path = null
      ;

    path = self.getDocumentPath(id);
    doc[self.db.id_field] = id;
    IsThere(path, function (exists) {
        if (!exists) {
            return callback(new Error("No item with such id."));
        }
        WriteJson(path, doc, self.db.json_indent, function (err) {
            callback(err, doc);
        });
    });

    return self;
};

/**
 * findOne
 * Finds a document with known id.
 *
 * @name findOne
 * @function
 * @param {String} id The document id to find.
 * @param {Function} callback The callback function.
 * @return {Collection} The `Collection` instance.
 */
DbMini.Collection.prototype.findOne = function (id, callback) {

    var self = this
      , path = self.getDocumentPath(id)
      ;

    ReadJson(path, function (err, data) {
        if (err && err.code === "ENOENT") {
            err = new Error("No document with such id.");
        }
        callback(err, data);
    });

    return self;
};

/**
 * removeOne
 * Removes one document.
 *
 * @name removeOne
 * @function
 * @param {String} id The id of the document to update.
 * @param {Function} callback The callback function.
 * @return {Cursor} The `Cursor` instance.
 */
DbMini.Collection.prototype.removeOne = function (id, callback) {

    var self = this
      , path = self.getDocumentPath(id)
      ;

    Fs.unlink(path, function (err) {
        if (err && err.code === "ENOENT") {
            err = null;
        }
        callback(err);
    });

    return self;
};

function prepareArguments(filters, updated, fn, callback) {

    var out = {
        filters: filters
      , fn: fn
      , callback: callback
      , updated: updated
    };

    // each(filters, fn, callback)
    // each(filters, updated, callback)
    if (arguments.length === 3) {
        if (typeof updated === "function" && updated.length === 2) {
            out.fn = updated;
        } else {
            out.updated = updated;
        }
        out.callback = fn;
    }

    // each(filters, callback);
    else if (arguments.length === 2) {
        out.callback = updated;
        out.fn = DbMini.Filters.builtin;
    }

    // each(callback)
    else if (arguments.length === 1) {
        out.callback = filters;
        out.fn = DbMini.Filters.builtin;
        out.filters = {};
    }

    // Custom filter
    if (typeof out.fn === "string") {
        out.fn = DbMini.Filters[out.fn];
    }

    return out;
}


/**
 * insert
 * Inserts one or more documents.
 *
 * @name insert
 * @function
 * @param {Array|Object} doc The document(s) to insert.
 * @param {Function} callback The callback function.
 * @return {Collection} The `Collection` instance.
 */
DbMini.Collection.prototype.insert = function (doc, callback) {
    var self = this;
    if (Array.isArray(doc)) {
        return SameTime(doc.map(function (c) {
            return self.insertOne.bind(self, c);
        }), callback);
    }
    self.insertOne(doc, callback);
};

/**
 * remove
 * Removes the documents matching the filters.
 *
 * @name remove
 * @function
 * @param {Object} filters The filters object which will be passed to the filter function.
 * @param {Function} fn The filter function.
 * @param {Function} callback The callback function.
 * @return {Cursor} The `Cursor` instance.
 */
DbMini.Collection.prototype.remove = function (filters, fn, callback) {
    var self = this
      , args = prepareArguments.apply(this, arguments)
      ;

    if (Array.isArray(args.filters)) {
        return SameTime(args.filters.map(function (c) {
            return self.remove.bind(self, c, args.fn);
        }), args.callback);
    }

    if (typeof args.filters === "string") {
        return self.removeOne(args.filters, args.callback);
    }

    return self.each(args.filters, args.fn, function (err, doc, next) {
        if (err) { return args.callback(err); }
        if (!doc) {
            return args.callback(null, null);
        }
        self.remove(doc[self.db.id_field], fn, function (err) {
            if (err) { return args.callback(err); }
            next();
        });
    });
};

/**
 * getIds
 * Gets the ids of a collection.
 *
 * @name getIds
 * @function
 * @param {Function} callback The callback function.
 * @return {Collection} The `Collection` instance.
 */
DbMini.Collection.prototype.getIds = function (callback) {
    Fs.readdir(this.path, function (err, files) {
        callback(err, (files || []).filter(function (c) {
            return c.indexOf(".") === -1;
        }))
    });
    return this;
};

/**
 * Cursor
 * Creates a new `Cursor` instance.
 *
 * @name Cursor
 * @function
 * @param {Array} ids An array with the document ids.
 * @param {Collection} col The database collection.
 * @return {Cursor} The `Cursor` instance.
 */
DbMini.Collection.Cursor = function (ids, col) {
    this.ids = ids;
    this.col = col;
};

/**
 * each
 * Iterate the cursor documents.
 *
 * @name each
 * @function
 * @param {Function} callback The callback function.
 * @return {Cursor} The `Cursor` instance.
 */
DbMini.Collection.Cursor.prototype.each = function (callback) {

    var self = this;

    if (!self.ids) {
        self.col.getIds(function (err, ids) {
            if (err) { return callback(err); }
            self.ids = ids;
            self.each(callback);
        });
        return self;
    }

    var ids = self.ids;
    if (!ids.length) {
        return process.nextTick(function () {
            callback(null, null);
        });
    }
    var pointer = -1;

    function cb(fn) {
        var id = ids[pointer];
        fn = fn || function () {};
        if (!id) {
            return process.nextTick(function () {
                fn(null, null);
                callback(null, null, next, prev);
            });
        }
        self.col.findOne(id, function (err, doc) {
            fn(err, doc);
            callback(err, doc, next, prev);
        });
    }

    function prev(fn) {
        --pointer;
        pointer < 0 && (pointer = 0)
        cb(fn);
    }

    function next (fn) {
        ++pointer;
        cb(fn);
    }

    // each({}, function (err, doc) { ... });
    if (callback.length === 2) {
        OneByOne(ids.map(function () {
            return next;
        }), function () {});
    } else {
        next();
    }
};

// Filters
DbMini.Filters = {

    /**
     * builtin
     * The built-in filter.
     *
     * @name builtin
     * @function
     * @param {Object} filters A `<name>: <value>` filters object.
     * @param {Object} doc The current object.
     * @return {Boolean} `true` if the document matches the filters or `false` otherwise.
     */
    builtin: function (filters, doc) {
        if (!doc) { return false; }
        if (!Typpy(filters, Object)) { return false; }
        var keys = Object.keys(filters)
          , i = 0
          , c = null
          , v = null
          ;

        if (keys.length === 0) { return true; }

        for (; i < keys.length; ++i) {
            c = keys[i];
            v = filters[c];
            if (doc[c] !== v) {
                return false;
            }
        }

        return true;
    }
};

/**
 * each
 * Iterate the collection documents.
 *
 * @name each
 * @function
 * @param {Object} filters The filters object which will be passed to the filter function.
 * @param {Function} fn The filter function.
 * @param {Function} callback The callback function.
 * @return {Cursor} The `Cursor` instance.
 */
DbMini.Collection.prototype.each = function (filters, fn, callback) {

    var cursor = new DbMini.Collection.Cursor(null, this)
      , args = prepareArguments.apply(this, arguments)
      ;

    cursor.each(function (err, doc, next, prev) {
        if (err) { return callback(err); }
        if (doc === null || args.fn(args.filters, doc)) {
            args.callback(null, doc, next, prev);
            if (args.callback.length < 3 && !!doc) {
                next();
            }
            return;
        }
        next();
    });

    return cursor;
};

/**
 * find
 * Finds the documents matching the filters.
 *
 * @name find
 * @function
 * @param {Object} filters The filters object which will be passed to the filter function.
 * @param {Function} fn The filter function.
 * @param {Function} callback The callback function.
 * @return {Cursor} The `Cursor` instance.
 */
DbMini.Collection.prototype.find = function (filters, fn, callback) {
    var self = this
      , args = prepareArguments.apply(this, arguments)
      , docs = []
      ;

    return self.each(args.filters, args.fn, function (err, doc) {
        if (err) { return args.callback(err); }
        if (!doc) {
            return args.callback(null, docs);
        }
        docs.push(doc);
    });
};

/**
 * update
 * Updates the filtered documents.
 *
 * @name update
 * @function
 * @param {Object} filters The filters object which will be passed to the filter function.
 * @param {Object} updated The updated document.
 * @param {Function} fn The filter function.
 * @param {Function} callback The callback function.
 * @return {Cursor} The `Cursor` instance.
 */
DbMini.Collection.prototype.update = function (filters, updated, fn, callback) {
    var self = this
      , args = prepareArguments.apply(this, arguments)
      ;

    return self.each(args.filters, args.fn, function (err, doc, next) {
        if (err) { return args.callback(err); }
        if (!doc) {
            return args.callback(null, null);
        }
        self.updateOne(doc[self.db.id_field], updated, next);
    });
};

// Defaults
DbMini.defaults = {
    root: ""
  , id_length: 16
  , id_field: "_id"
  , json_indent: 2
};

module.exports = DbMini;
