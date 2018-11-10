const QUREYREG = /(^|&).*=([^&]*)(&|$)/;

function isString(obj) {
    return (typeof obj === 'string') && obj.constructor === String;
}

function isFunction(obj) {
    return (typeof obj === 'function') && obj.constructor === Function;
}

function isEqual(one, two) {
    if (one === null || one === undefined || two === null || two === undefined) {
        return one === two;
    }
    if (one.constructor !== two.constructor) {
        return false;
    }
    if (one instanceof Function) {
        return one === two;
    }
    if (one instanceof RegExp) {
        return one === two;
    }
    if (one === two || one.valueOf() === two.valueOf()) {
        return true;
    }
    if (Array.isArray(one) && one.length !== two.length) {
        return false;
    }
    if (one instanceof Date) {
        return false;
    }
    if (!(one instanceof Object)) {
        return false;
    }
    if (!(two instanceof Object)) {
        return false;
    }
    let p = Object.keys(one);
    return Object.keys(two).every(function (i) {
        return p.indexOf(i) !== -1;
    }) && p.every(function (i) {
        return isEqual(one[i], two[i]);
    });
}

function isObject(obj) {
    return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
}

function isPlainObject(obj) {
    return isObject(obj) && obj.constructor.prototype === Object.prototype;
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function isQueryString(str) {
    return isString(str) && QUREYREG.test(str);
}

function queue(arr) {
    let current = null, result = [];
    arr.forEach(task => {
        if (!current) {
            current = task();
        } else {
            current = current.then(info => {
                result.push(info);
                return task();
            });
        }
    });
    return current ? current.then((info) => {
        result.push(info);
        return result;
    }) : Promise.resolve([]);
}

function randomid(len = 7) {
    if (len <= 2) {
        len = 7;
    }
    return Math.random().toString(36).slice(2, len + 2);
}

function setProp(target, key, value) {
    Reflect.defineProperty(target, key, {
        enumerable: false,
        configurable: false,
        writable: true,
        value: value
    });
}

function queryString(obj) {
    let result = [];
    if (obj) {
        for (let i in obj) {
            let val = obj[i];
            if (isString(val)) {
                result.push(`${i}=${encodeURIComponent(val)}`);
            } else if (isObject(val) || isArray(val)) {
                result.push(`${i}=${encodeURIComponent(JSON.stringify(val))}`);
            } else {
                result.push(`${i}=${(val !== undefined && val !== null ? encodeURIComponent(val.toString()) : "")}`);
            }
        }
        return result.join("&");
    } else {
        return "";
    }
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash;
    }
    return hash;
}

function extend() {
    let options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[i] || {};
        i++;
    }
    if (typeof target !== "object" && !isFunction(target)) {
        target = {};
    }
    if (i === length) {
        target = this;
        i--;
    }
    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) {
                    continue;
                }
                if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

function clone(data) {
    if (isArray(data)) {
        return extend(true, [], data);
    } else if (isObject(data)) {
        return extend(true, {}, data);
    } else {
        return data;
    }
}

module.exports = {
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
};