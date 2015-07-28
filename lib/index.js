var Mkdirp = require("mkdirp")
  , Id = require("random-id")
  , WriteJson = require("w-json")
  , ReadJson = require("r-json")
  , Fs = require("fs")
  , IsThere = require("is-there")
  ;

function DbMini(name) {
    this.name = name;
}

DbMini.prototype.collection = function (name, callback) {
    var col = new DbMini.Collection(name, this);
    Mkdirp(col.path, function (err) {
        callback(err, col);
    });
};

DbMini.Collection = function Collection (name, db) {
    var self = this;
    self.name = name;
    self.path = DbMini.root + DbMini.root + "/" + db.name + "/" + name
};

DbMini.Collection.prototype.getDocumentPath = function (id) {
    return this.path + (id ? id : Id(DbMini.id_length));
};

DbMini.Collection.prototype.insertOne = function (doc, callback) {

    var self = this
      , id = doc[DbMini.id_field]
      , path = null
      ;

    if (!id) {
        doc[DbMini.id_field] = id = Id();
    }

    path = self.getDocumentPath(id);
    IsThere(path, function (exists) {
        if (exists) {
            return callback(new Error("Duplicated id: " + id + ". Ids must be unique."));
        }
        WriteJson(path, doc, DbMini.json_indent, function (err) {
            callback(err, doc);
        });
    });
};

DbMini.Collection.prototype.findOne = function (id, callback) {

    var self = this
      , path = self.getDocumentPath(id)
      ;

    ReadJson(path, function (err, data) {
        if (err.code === "ENOENT") {
            err = new Error("No document with such id.");
        }
        callback(err, data);
    });
};

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
};

DbMini.Collection.prototype.insert = function (doc, callback) {
    var self = this;
    if (Array.isArray(doc)) {
        return SameTime(doc.map(function (c) {
            return self.insertOne.bind(c);
        }), callback);
    }
    self.insertOne(doc, callback);
};

DbMini.Collection.prototype.remove = function (filters, callback) {
    var self = this;
    if (typeof filters === "string") {
        return self.removeOne(filters, callback);
    }
    if (Array.isArray(filters)) {
        return SameTime(filters.map(function (c) {
            return self.removeOne.bind(c);
        }), callback);
    }
    // TODO Check filters, each
};

DbMini.Collection.prototype.getIds = function (callback) {
    Fs.readdir(this.path, callback);
};

DbMini.Collection.prototype.each = function (callback) {
    var self = this;
    self.getIds(function (err, ids) {
        if (err) { return callback(err); }
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
                    fn(err, doc);
                    callback(err, null, next, prev);
                });
            }
            self.findOne(id, function (err, doc) {
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
            pointer >= ids.length && (pointer = ids.length - 1);
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
    });
};

DbMini.Collection.prototype.find = function (filters, callback) {
    // TODO Check filters, each
};

DbMini.Collection.prototype.update = function (filters, updated, callback) {
    // TODO Check filters, each
};

DbMini.root = "";
DbMini.id_length = 16;
DbMini.id_field = "_id";
DbMini.json_indent = 2;

module.exports = DbMini;
