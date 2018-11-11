let {File, SyncFile} = require("./src/file");
let Commander = require("./src/commander");
let {
    isString,
    isFunction,
    isEqual,
    isObject,
    isPlainObject,
    isArray,
    isQueryString,
    queue,
    randomid,
    setProp,
    queryString,
    hashCode,
    extend,
    clone
} = require("./src/helper");

module.exports = {
    File,
    SyncFile,
    isString,
    isFunction,
    isEqual,
    isObject,
    isPlainObject,
    isArray,
    isQueryString,
    queue,
    randomid,
    setProp,
    queryString,
    hashCode,
    extend,
    clone,
    Commander
};