let fs = require("fs");
let Util = require("util");
let Path = require("path");
let Hash = require("./md5");

let util = {
	regular(path) {
		return Path.normalize(path).replace(/\\/g, "/");
	},
	moveSync(from, to) {
		return new Promise((resolve, reject) => {
			this.touchSync(to);
			let source = fs.createReadStream(from), dest = fs.createWriteStream(to);
			source.pipe(dest);
			source.on('end', function () {
				fs.unlink(from, function () {
					resolve(to);
				});
			});
			source.on('error', function (err) {
				reject(err);
			});
		});
	},
	copySync(from, to) {
		return new Promise((resolve, reject) => {
			this.touchSync(to);
			let source = fs.createReadStream(from), dest = fs.createWriteStream(to);
			source.pipe(dest);
			source.on('end', function () {
				resolve(to);
			});
			source.on('error', function (err) {
				reject(err);
			});
		});
	},
	touchSync(path) {
		let filePath = this.regular(path);
		this.mkdirSync(Path.resolve(filePath, "./../"));
		fs.closeSync(fs.openSync(filePath, "w"));
	},
	move(from, to) {
		return this.touch(to).then(() => {
			return new Promise((resolve, reject) => {
				let source = fs.createReadStream(from), dest = fs.createWriteStream(to);
				source.pipe(dest);
				source.on('end', function () {
					fs.unlink(from, function () {
						resolve(to);
					});
				});
				source.on('error', function (err) {
					reject(err);
				});
			});
		});
	},
	copy(from, to) {
		return this.touch(to).then(() => {
			return new Promise((resolve, reject) => {
				let source = fs.createReadStream(from), dest = fs.createWriteStream(to);
				source.pipe(dest);
				source.on('end', function () {
					resolve(to);
				});
				source.on('error', function (err) {
					reject(err);
				});
			});
		});
	},
	mkdirSync(path) {
		let dirpath = this.regular(path);
		dirpath.split("/").reduce((a, part) => {
			let path = (a ? (a === '/' ? '/' : (a + "/")) : ("/")) + part;
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
			return path;
		}, "");
	},
	mkdir(path) {
		let dirpath = this.regular(path);
		dirpath.split("/").reduce((a, part) => {
			return a.then(() => {
				let path = (a ? (a === '/' ? '/' : (a + "/")) : ("/")) + part;
				if (!fs.existsSync(path)) {
					return Util.promisify(fs.mkdir)(path);
				}
			});
		}, Promise.resolve());
	},
	touch(path) {
		let filePath = this.regular(path);
		return this.mkdir(Path.resolve(filePath, "./../")).then(() => {
			return Util.promisify(fs.open)(filePath, "a").then(fd => {
				return Util.promisify(fs.close)(fd);
			});
		});
	},
	deleteFolderRecursiveSync(path, self = true) {
		if (fs.existsSync(path)) {
			if (fs.statSync(curPath).isDirectory()) {
				fs.readdirSync(path).forEach(file => {
					this.deleteFolderRecursiveSync(Path.resolve(path, file), true);
				});
				if (self) {
					fs.rmdirSync(path);
				}
			} else {
				fs.unlinkSync(curPath);
			}
		}
	},
	deleteFolderRecursive(path, self = true) {
		if (fs.existsSync(path)) {
			return Util.promisify(fs.stat)(path).then(info => {
				if (info.isDirectory()) {
					return Util.promisify(fs.readdir)(path).then(files => {
						return files.reduce((a, file) => {
							return a.then(() => {
								return this.deleteFolderRecursive(Path.resolve(path, file), true);
							});
						}, Promise.resolve());
					}).then(() => {
						if (self) {
							return Util.promisify(fs.rmdir)(path);
						}
					});
				} else {
					return Util.promisify(fs.unlink)(path);
				}
			});
		} else {
			return Promise.resolve();
		}
	},
	getAllFilePathsSync(path) {
		let _fileList = [];
		fs.readdirSync(path).forEach(item => {
			let tmpPath = Path.resolve(path, item);
			if (fs.statSync(tmpPath).isDirectory()) {
				_fileList = _fileList.concat(this.getAllFilePathsSync(tmpPath));
			} else {
				_fileList.push(path);
			}
		});
		return _fileList;
	},
	getAllFilePaths(path) {
		let _fileList = [];
		return Util.promisify(fs.readdir)(path).then(files => {
			return files.reduce((a, file) => {
				return a.then(() => {
					let _path = Path.resolve(path, file);
					return Util.promisify(fs.stat)(_path).then(t => {
						if (t.isDirectory()) {
							return this.getAllFilePaths(_path).then(fileList => {
								_fileList = _fileList.concat(fileList);
							});
						} else {
							_fileList.push(_path);
						}
					});
				});
			}, Promise.resolve());
		}).then(() => _fileList);
	}
};

class BaseFile {
	constructor(path) {
		this._path = util.regular(path);
	}

	get path() {
		return this._path;
	}

	get exist() {
		return fs.existsSync(this.path);
	}

	get suffix() {
		return Path.extname(this.path);
	}

	get name() {
		return Path.filename(this.path);
	}

	get dirname() {
		return Path.dirname(this.path);
	}

	get readStream() {
		return fs.createReadStream(this.path);
	}

	get writeStream() {
		fs.createWriteStream(this.path);
	}

	make() {
	}

	info() {
	}

	isFolder() {
	}

	isFile() {
	}

	chmod() {
	}

	chown() {
	}

	read() {
	}

	write() {
	}

	append() {
	}

	hash() {
	}

	remove() {
	}

	empty() {
	}

	moveTo() {
	}

	copyTo() {
	}

	getAllSubFilePaths() {
	}

	getSubFilePaths() {
	}

	getSubFile() {
	}

	getAllSubFiles() {
	}

	rename() {
	}

	moveFile() {
	}

	copyFile() {
	}

	transform() {
	}

	isSync() {
		return false;
	}
}

class SyncFile extends BaseFile {
	make() {
		if (!this.exist) {
			if (Path.extname(this.path)) {
				util.touchSync(this.path);
			} else {
				util.mkdir(this.path);
			}
		}
		return this;
	}

	info(option = {}) {
		return fs.statSync(this.path, option);
	}

	isFolder() {
		return this.info().isDirectory();
	}

	isFile() {
		return !this.info().isDirectory();
	}

	read(encode) {
		return fs.readFileSync(this.path, encode || "utf-8");
	}

	chmod(mode) {
		return fs.chmodSync(this.path, mode);
	}

	chown(uid, gid) {
		return fs.chownSync(this.path, uid, gid);
	}

	write(content, ops = {}) {
		fs.writeFileSync(this.path, content, ops);
		return this;
	}

	append(content, ops = {}) {
		fs.appendFileSync(this.path, content, ops);
		return this;
	}

	hash() {
		if (this.isFile()) {
			return Hash.md5(this.read());
		} else {
			return null;
		}
	}

	remove() {
		if (this.isFolder()) {
			util.deleteFolderRecursiveSync(this.path);
		} else {
			fs.unlinkSync(this.path);
		}
	}

	rename(name) {
		if (this.isFile()) {
			let path = Path.resolve(this.path, "./../", `./${name}`);
			fs.renameSync(this.path, path);
			this._path = path;
			return this;
		}
	}

	moveTo(path) {
		if (this.isFolder()) {
			this.getAllSubFilePaths().forEach(file => util.moveSync(file, Path.resolve(path, file.substring(this.path.length + 1))));
		} else {
			util.moveSync(this.path, path);
		}
		return this;
	}

	copyTo(path) {
		if (this.isFolder()) {
			this.getAllSubFilePaths().forEach(file => util.copySync(file, Path.resolve(path, file.substring(this.path.length + 1))));
		} else {
			util.copySync(this.path, path);
		}
		return this;
	}

	getAllSubFilePaths() {
		return util.getAllFilePaths(this.path);
	}

	getSubFilePaths() {
		if (this.isFolder()) {
			return fs.readdirSync(this.path);
		} else {
			return [];
		}
	}

	getSubFile() {
		return this.getSubFilePaths().map(files => files.map(file => new File(file)));
	}

	getAllSubFiles() {
		return this.getAllSubFilePaths().map(files => files.map(file => new File(file)));
	}

	moveFile(file) {
		if (file instanceof SyncFile && this.isFolder()) {
			file.moveTo(this.path);
		}
		return this;
	}

	copyFile(file) {
		if (file instanceof SyncFile && this.isFolder()) {
			file.copyTo(this.path);
		}
		return this;
	}

	empty() {
		if (this.isFolder()) {
			util.deleteFolderRecursiveSync(this.path, false);
		}
		return this;
	}

	transform() {
		return new File(this.path);
	}

	isSync() {
		return true;
	}
}

class File extends BaseFile {
	make() {
		if (!this.exist) {
			if (Path.extname(this.path)) {
				return util.touch(this.path).then(() => this);
			} else {
				return util.mkdir(this.path).then(() => this);
			}
		}
		return Promise.resolve(this);
	}

	info(option = {}) {
		return Util.promisify(fs.stat)(this.path, option);
	}

	isFolder() {
		return this.info().then(t => t.isDirectory());
	}

	isFile() {
		return this.info().then(t => !t.isDirectory());
	}

	chmod(mode) {
		return Util.promisify(fs.chmod)(this.path, mode);
	}

	chown(uid, gid) {
		return Util.promisify(fs.chown)(this.path, uid, gid);
	}

	read(option = {}) {
		return Util.promisify(fs.readFile)(this.path, Object.assign({
			encoding: "utf8",
			flag: 'r'
		}, option));
	}

	write(content, ops = {}) {
		return Util.promisify(fs.writeFile)(this.path, content, ops).then(() => this);
	}

	append(content, ops = {}) {
		return Util.promisify(fs.appendFile)(this.path, content, ops).then(() => this);
	}

	hash() {
		return this.isFile().then(result => {
			if (result) {
				return this.read().then(content => Hash.md5(content));
			} else {
				return Promise.resolve(null);
			}
		})
	}

	rename(name) {
		return this.isFile().then(r => {
			if (r) {
				let path = Path.resolve(this.path, "./../", `./${name}`);
				return Util.promisify(fs.rename)(this.path, path).then(() => {
					this._path = path;
					return this;
				});
			} else {
				return Promise.resolve();
			}
		});
	}

	remove() {
		return this.isFolder().then(r => {
			if (r) {
				return util.deleteFolderRecursive(this.path);
			} else {
				return Util.promisify(fs.unlink)(this.path);
			}
		});
	}

	moveTo(path) {
		return this.isFolder().then(r => {
			if (r) {
				return this.getAllSubFilePaths().then(files => {
					return files.reduce((a, file) => {
						return a.then(() => {
							return util.move(file, Path.resolve(path, file.substring(this.path.length + 1)));
						});
					}, Promise.resolve());
				});
			} else {
				return util.move(this.path, path);
			}
		}).then(() => this);
	}

	copyTo(path) {
		return this.isFolder().then(r => {
			if (r) {
				return this.getAllSubFilePaths().then(files => {
					return files.reduce((a, file) => {
						return a.then(() => {
							return util.copy(file, Path.resolve(path, file.substring(this.path.length + 1)));
						});
					}, Promise.resolve());
				});
			} else {
				return util.copy(this.path, path);
			}
		}).then(() => this);
	}

	getAllSubFilePaths() {
		return util.getAllFilePaths(this.path);
	}

	getSubFilePaths() {
		return this.isFolder().then(r => {
			if (r) {
				return Util.promisify(fs.readdir)(this.path);
			}
			return Promise.resolve([]);
		});
	}

	getSubFile() {
		return this.getSubFilePaths().then(files => files.map(file => new File(file)));
	}

	getAllSubFiles() {
		return this.getAllSubFilePaths().then(files => files.map(file => new File(file)));
	}

	moveFile(file) {
		if (file instanceof File) {
			return this.isFolder().then(f => {
				if (f) {
					return file.moveTo(this.path).then(() => this);
				}
			});
		}
		return Promise.resolve();
	}

	copyFile(file) {
		if (file instanceof File) {
			return this.isFolder().then(f => {
				if (f) {
					return file.copyTo(this.path).then(() => this);
				}
			});
		}
		return Promise.resolve();
	}

	empty() {
		return this.isFolder().then(r => {
			if (r) {
				return util.deleteFolderRecursive(this.path, false).then(() => this);
			}
			return Promise.resolve(this);
		});
	}

	transform() {
		return new SyncFile(this.path);
	}
}

module.exports = {File, SyncFile};