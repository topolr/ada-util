let crypto = require('crypto');
exports.encrypt = function (str, secret) {
    let cipher = crypto.createCipher("aes192", secret);
    let enc = cipher.update(str, "utf8", "hex");
    enc += cipher.final("hex");
    return enc;
};

exports.decrypt = function (str, secret) {
    let decipher = crypto.createDecipher("aes192", secret);
    let dec = decipher.update(str, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
};

exports.md5 = function (str) {
    let md5sum = crypto.createHash("md5");
    md5sum.update(str);
    str = md5sum.digest("hex");
    return str;
};

exports.randomString = function (size) {
    size = size || 6;
    let code_string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let max_num = code_string.length + 1;
    let new_pass = "";
    while (size > 0) {
        new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
        size--;
    }
    return new_pass;
};