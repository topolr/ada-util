let Path = require("path");
let fs = require("fs");
let os = require("os");

class File {
	constructor(path) {
		this.path = Path.normalize(path).replace(os.EOL, "/");
	}

	read(option) {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, Object.assign({
				encoding: "utf8",
				flag: 'r'
			}, option), (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

	readSync(encode = "utf-8") {
		return fs.readFileSync(this.path, encode);
	}

	isFolder() {
		if (this.isExists()) {
			return fs.statSync(this.path).isDirectory();
		} else {
			return false;
		}
	}

	isFile() {
		if (this.isExists()) {
			return !fs.statSync(this.path).isDirectory();
		} else {
			return false;
		}
	}

	isExists() {
		return fs.existsSync(this.path);
	}

	getInfoSync() {
		if (this.isExists()) {
			return fs.statSync(this.path);
		} else {
			return null;
		}
	}

	getInfo() {
		return new Promise((resolve, reject) => {
			if (this.isExists()) {
				fs.stat(this.path, (a, b) => {
					if (!a) {
						resolve(b);
					} else {
						reject();
					}
				});
			} else {
				reject();
			}
		});
	}

	suffix() {
		return Path.extname(this.path);
	}

	name() {
		return Path.basename(this.path);
	}

	create() {
		if (!this.isExists()) {
			let dirpath = this.path;
			let a = dirpath.split("/"), pathtmp = a[0] === "" ? "/" : "";
			let b = a.pop();
			a.forEach(_dot => {
				pathtmp += _dot;
				if (!fs.existsSync(pathtmp)) {
					fs.mkdirSync(pathtmp);
				}
				pathtmp += "/";
			});
			pathtmp = pathtmp + "/" + b;
			fs.closeSync(fs.openSync(pathtmp, "w"));
		}
	}

	write(content, ops = {}) {
		return new Promise((resolve, reject) => {
			this.create();
			fs.writeFile(this.path, content, ops, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}

module.exports = File;